"""Unit tests for Multi-Party Conversation-to-Commitment Knowledge Graph (Rank 4 Innovation)."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.commitment_graph import commitment_graph_service


@pytest.fixture
def client():
    return TestClient(app)


def test_extract_commitment_dag_conditional_trade():
    """Verify DAG extraction from conditional B2B trade conversation."""
    transcript = (
        "Hello Murugan, this is Suresh speaking. I need 200 cotton shirts by Friday. "
        "I will transfer 50% advance payment tomorrow by 2 PM. "
        "Murugan says: Understood Suresh, we will dispatch the 200 shirts on Thursday morning "
        "once the advance is received. Delivery will reach your warehouse by Friday afternoon."
    )
    fields = [
        {"field_name": "order_item", "current_value": "cotton shirts"},
        {"field_name": "quantity", "current_value": "200"},
        {"field_name": "delivery_deadline", "current_value": "Friday"},
    ]

    res = commitment_graph_service.extract_commitment_graph(
        transcript=transcript,
        record_type="business_order",
        fields=fields,
    )

    assert res["is_dag"] is True
    assert res["deadlocks_detected"] is False
    assert len(res["nodes"]) >= 4  # 2 actors + 3 commitments
    assert len(res["edges"]) >= 3

    # Check that advance payment is READY and dispatch is BLOCKED
    node_map = {n["label"]: n for n in res["nodes"]}
    adv_node = next((n for n in res["nodes"] if "advance" in n["label"].lower()), None)
    dispatch_node = next((n for n in res["nodes"] if "dispatch" in n["label"].lower()), None)

    assert adv_node is not None
    assert adv_node["status"] == "READY"

    assert dispatch_node is not None
    assert dispatch_node["status"] == "BLOCKED"
    assert dispatch_node["is_conditional"] is True


def test_extract_commitment_dag_meeting_sprint():
    """Verify DAG extraction for multi-party engineering sprint sync."""
    transcript = (
        "In today's sync, Priya will prepare the slide deck by Friday. "
        "Rahul to review the client contract after slide deck draft is ready. "
        "Ankit will deploy the security patch before EOD."
    )
    action_items = [
        {"description": "Priya will prepare the slide deck by Friday", "assignee": "Priya", "deadline": "Friday"},
        {"description": "Rahul to review the client contract after slide deck draft is ready", "assignee": "Rahul", "deadline": "Friday"},
        {"description": "Ankit will deploy the security patch before EOD", "assignee": "Ankit", "deadline": "EOD"},
    ]

    res = commitment_graph_service.extract_commitment_graph(
        transcript=transcript,
        record_type="meeting_action_items",
        action_items=action_items,
    )

    assert res["is_dag"] is True
    assert len(res["topological_order"]) == len(res["nodes"])
    
    # Check that Rahul's task depends on Priya's task
    rahul_node = next((n for n in res["nodes"] if "review" in n["label"].lower()), None)
    assert rahul_node is not None
    assert rahul_node["status"] == "BLOCKED"


def test_detect_cycle_deadlock():
    """Verify cyclic dependency detection when parties make mutually blocking demands."""
    nodes = [
        {"id": "c1", "label": "Buyer Advance Payment", "node_type": "COMMITMENT", "status": "BLOCKED"},
        {"id": "c2", "label": "Seller Consignment Dispatch", "node_type": "COMMITMENT", "status": "BLOCKED"},
    ]
    # c1 depends on c2, and c2 depends on c1 (Deadlock cycle)
    edges = [
        {"id": "e1", "source": "c2", "target": "c1", "relationship": "DEPENDS_ON"},
        {"id": "e2", "source": "c1", "target": "c2", "relationship": "DEPENDS_ON"},
    ]

    is_dag, cycles = commitment_graph_service._detect_cycles(nodes, edges)
    assert is_dag is False
    assert len(cycles) > 0


def test_simulate_causal_propagation():
    """Verify that completing a prerequisite unblocks downstream dependent commitments."""
    nodes = [
        {"id": "adv", "label": "50% Advance Payment", "node_type": "COMMITMENT", "status": "READY"},
        {"id": "disp", "label": "Dispatch Shirts", "node_type": "COMMITMENT", "status": "BLOCKED"},
    ]
    edges = [
        {"id": "e1", "source": "adv", "target": "disp", "relationship": "DEPENDS_ON"},
    ]

    # 1. Simulate marking advance payment as COMPLETED
    res = commitment_graph_service.simulate_node_transition(nodes, edges, "adv")

    node_map = {n["id"]: n for n in res["nodes"]}
    assert node_map["adv"]["status"] == "COMPLETED"
    # Downstream dispatch should now be unblocked and READY!
    assert node_map["disp"]["status"] == "READY"

    # 2. Simulate toggling advance payment back to READY (uncompleted)
    res2 = commitment_graph_service.simulate_node_transition(res["nodes"], edges, "adv")
    node_map2 = {n["id"]: n for n in res2["nodes"]}
    assert node_map2["adv"]["status"] == "READY"
    assert node_map2["disp"]["status"] == "BLOCKED"


def test_api_graph_endpoints(client):
    """Test FastAPI HTTP endpoints for DAG extraction and simulation."""
    # 1. Test /api/graph/extract
    payload = {
        "transcript": "Hello Murugan, this is Suresh. I need 200 shirts. I will pay 50% advance tomorrow. You dispatch Thursday.",
        "record_type": "business_order",
    }
    extract_resp = client.post("/api/graph/extract", json=payload)
    assert extract_resp.status_code == 200
    data = extract_resp.json()
    assert data["is_dag"] is True
    assert len(data["nodes"]) > 0

    # 2. Test /api/graph/simulate
    target_node = data["nodes"][1]
    sim_payload = {
        "nodes": data["nodes"],
        "edges": data["edges"],
        "target_node_id": target_node["id"],
    }
    sim_resp = client.post("/api/graph/simulate", json=sim_payload)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert sim_data["toggled_node_id"] == target_node["id"]
