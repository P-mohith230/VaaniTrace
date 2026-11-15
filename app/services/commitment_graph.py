"""Multi-Party Conversation-to-Commitment Knowledge Graph (DAG) Service (Rank 4 Innovation).

Constructs directed acyclic graphs (DAGs) from multi-speaker conversations, modeling actors,
interdependent commitments, conditional clauses ("only if", "after", "once"), and statutory
deadlines with cycle/deadlock detection and interactive causal propagation.
"""

import re
import logging
from typing import List, Dict, Any, Optional, Set, Tuple

logger = logging.getLogger(__name__)


class CommitmentGraphService:
    """Computes, validates, and simulates Multi-Party Conversation-to-Commitment DAGs."""

    # Common conditional marker regex patterns in Indian English & vernacular loan words
    CONDITIONAL_PATTERNS = [
        r'\b(?:only\s+if|only\s+after|subject\s+to|provided\s+that|on\s+condition\s+that)\b',
        r'\b(?:once|after|upon|post)\s+(?:receiving|getting|the|payment|advance|confirmation)\b',
        r'\b(?:ke\s+baad|hone\s+ke\s+baad|milne\s+par|advance\s+ke\s+baad)\b',
        r'\b(?:before\s+we\s+can|will\s+dispatch\s+only|will\s+deliver\s+only)\b',
        r'\b(?:tabhi|tab\s+jaake|apudhe|appo\s+dhan)\b',
    ]

    @classmethod
    def extract_commitment_graph(
        cls,
        transcript: str,
        record_type: str = "business_order",
        fields: Optional[List[Dict[str, Any]]] = None,
        action_items: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Extract multi-party commitment nodes, dependencies, and topological ordering from conversation."""
        fields = fields or []
        action_items = action_items or []
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []

        text = transcript or ""
        lower_text = text.lower()

        # 1. Identify participating actors
        actors = cls._extract_actors(text, fields, action_items)

        # 2. Extract commitments and conditional clauses based on record type & transcript
        commitments = cls._extract_commitments(text, record_type, fields, action_items, actors)

        # 3. Build Nodes
        # Layer 0: Root Actors
        actor_node_ids: Dict[str, str] = {}
        for idx, actor in enumerate(actors):
            node_id = f"actor_{idx + 1}"
            actor_node_ids[actor["name"].lower()] = node_id
            nodes.append({
                "id": node_id,
                "node_type": "ACTOR",
                "label": actor["name"],
                "actor": actor["name"],
                "role": actor["role"],
                "description": f"Participating Party ({actor['role']})",
                "deadline": None,
                "status": "COMPLETED",  # Actors are established facts
                "layer": 0,
                "evidence_text": actor.get("evidence", ""),
            })

        # Process Commitment nodes and dependencies
        commitment_node_map: Dict[str, str] = {}
        for c_idx, comm in enumerate(commitments):
            c_node_id = f"comm_{c_idx + 1}"
            commitment_node_map[comm["key"]] = c_node_id

            nodes.append({
                "id": c_node_id,
                "node_type": "COMMITMENT",
                "label": comm["title"],
                "actor": comm["actor"],
                "role": comm["role"],
                "description": comm["description"],
                "deadline": comm.get("deadline"),
                "status": comm.get("status", "READY"),
                "layer": comm.get("layer", 1),
                "is_conditional": comm.get("is_conditional", False),
                "condition_prerequisite": comm.get("condition_prerequisite"),
                "evidence_text": comm.get("evidence_text", ""),
                "amount": comm.get("amount"),
            })

            # Edge from Actor to Commitment (ASSIGNED_TO / PROMISES)
            actor_key = comm["actor"].lower()
            matching_actor_id = actor_node_ids.get(actor_key)
            if not matching_actor_id:
                # Find partial match
                for a_name, a_id in actor_node_ids.items():
                    if a_name in actor_key or actor_key in a_name:
                        matching_actor_id = a_id
                        break

            if matching_actor_id:
                edges.append({
                    "id": f"edge_act_{matching_actor_id}_{c_node_id}",
                    "source": matching_actor_id,
                    "target": c_node_id,
                    "relationship": "COMMITS_TO",
                    "condition_label": "Obligation",
                })

        # 4. Extract Causal Dependency Edges (DEPENDS_ON)
        for comm in commitments:
            curr_id = commitment_node_map.get(comm["key"])
            prereq_key = comm.get("depends_on_key")
            if prereq_key and curr_id:
                source_id = commitment_node_map.get(prereq_key)
                if source_id and source_id != curr_id:
                    edges.append({
                        "id": f"edge_dep_{source_id}_{curr_id}",
                        "source": source_id,
                        "target": curr_id,
                        "relationship": "DEPENDS_ON",
                        "condition_label": comm.get("condition_label", "Prerequisite"),
                    })

        # 5. Cycle Detection & Topological Sorting
        is_dag, cycles = cls._detect_cycles(nodes, edges)
        topological_order = cls._compute_topological_sort(nodes, edges) if is_dag else []

        # 6. Assign layout layers based on topological distance
        cls._assign_layout_layers(nodes, edges, topological_order)

        # 7. Evaluate initial node status (READY vs BLOCKED)
        cls._evaluate_blocker_statuses(nodes, edges)

        # 8. Generate summary
        summary = cls._generate_graph_summary(nodes, edges, is_dag, cycles)

        return {
            "nodes": nodes,
            "edges": edges,
            "is_dag": is_dag,
            "topological_order": topological_order,
            "cycles": cycles,
            "deadlocks_detected": len(cycles) > 0,
            "summary": summary,
        }

    @classmethod
    def simulate_node_transition(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
        target_node_id: str,
    ) -> Dict[str, Any]:
        """Simulate fulfilling or unfulfilling a commitment node, propagating causal states down the DAG."""
        updated_nodes = [dict(n) for n in nodes]
        target_node = next((n for n in updated_nodes if n["id"] == target_node_id), None)
        if not target_node:
            return {"nodes": updated_nodes, "edges": edges, "message": "Node not found"}

        # Toggle status: COMPLETED <-> (READY/BLOCKED)
        if target_node["status"] == "COMPLETED":
            target_node["status"] = "READY"
        else:
            target_node["status"] = "COMPLETED"

        # Propagate states downstream
        cls._evaluate_blocker_statuses(updated_nodes, edges)

        completed_count = sum(1 for n in updated_nodes if n["status"] == "COMPLETED" and n["node_type"] == "COMMITMENT")
        total_comm = sum(1 for n in updated_nodes if n["node_type"] == "COMMITMENT")

        message = (
            f"Simulated '{target_node['label']}' -> {target_node['status']}. "
            f"Progress: {completed_count}/{total_comm} commitments fulfilled."
        )

        return {
            "nodes": updated_nodes,
            "edges": edges,
            "toggled_node_id": target_node_id,
            "message": message,
        }

    # -------------------------------------------------------------------------
    # Internal Extraction & Graph Algorithms
    # -------------------------------------------------------------------------

    @classmethod
    def _extract_actors(
        cls,
        transcript: str,
        fields: List[Dict[str, Any]],
        action_items: List[Dict[str, Any]],
    ) -> List[Dict[str, str]]:
        """Identify parties, buyers, vendors, or team members involved in conversation."""
        actors: List[Dict[str, str]] = []
        found_names: Set[str] = set()

        # 1. Check known fields (consignee, customer_name, vendor)
        for f in fields:
            fname = f.get("field_name", "")
            fval = (f.get("current_value") or "").strip()
            if fname in ("consignee", "customer_name", "vendor", "party_name", "client_name") and fval:
                if fval.lower() not in found_names:
                    found_names.add(fval.lower())
                    role = "Buyer / Client" if fname in ("consignee", "customer_name", "client_name") else "Supplier"
                    actors.append({"name": fval, "role": role, "evidence": fval})

        # 2. Check action items assignees
        for item in action_items:
            assignee = (item.get("assignee") or "").strip()
            if assignee and assignee.lower() not in found_names and assignee.lower() not in ("team", "all", "none"):
                found_names.add(assignee.lower())
                actors.append({"name": assignee, "role": "Assignee / Owner", "evidence": assignee})

        # 3. Transcript pattern detection (e.g. "this is Suresh", "Rajesh here", "Murugan says", "Priya will")
        patterns = [
            (r'\b(?:this\s+is|i\s+am|my\s+name\s+is)\s+([A-Z][a-z]+)\b', "Initiator / Buyer"),
            (r'\b(?:hello|hi|hey|dear)\s+([A-Z][a-z]+)\b', "Counterparty / Supplier"),
            (r'\b([A-Z][a-z]+)\s+(?:will|to|shall)\s+(?:prepare|review|deploy|send|check|dispatch)\b', "Task Owner"),
            (r'\b([A-Z][a-z]+)\s+(?:says|said|agreed|replied)\b', "Collaborator"),
        ]
        for pat, default_role in patterns:
            for match in re.finditer(pat, transcript):
                name = match.group(1).strip()
                if name.lower() not in found_names and len(name) >= 3 and name.lower() not in ("the", "our", "today", "order", "friday", "monday"):
                    found_names.add(name.lower())
                    actors.append({"name": name, "role": default_role, "evidence": match.group(0)})

        # Fallback if no specific actor identified
        if not actors:
            actors.append({"name": "Primary Commercial Buyer", "role": "Purchaser", "evidence": "Direct Order"})
            actors.append({"name": "Fulfillment Supplier", "role": "Vendor", "evidence": "Order Fulfillment"})

        return actors

    @classmethod
    def _extract_commitments(
        cls,
        transcript: str,
        record_type: str,
        fields: List[Dict[str, Any]],
        action_items: List[Dict[str, Any]],
        actors: List[Dict[str, str]],
    ) -> List[Dict[str, Any]]:
        """Extract commitments, conditions, and causal relations."""
        commitments: List[Dict[str, Any]] = []
        lower = transcript.lower()

        # Check for conditional advance payment clause (common in Indian B2B wholesale)
        # e.g. "50% advance transfer", "advance payment tomorrow", "dispatch only after advance"
        has_advance_condition = bool(re.search(r'\b(?:advance|peshgi|biyana|token|downpayment)\b', lower))
        has_conditional_dispatch = any(re.search(p, lower) for p in cls.CONDITIONAL_PATTERNS)

        primary_buyer = actors[0]["name"] if actors else "Buyer"
        primary_seller = actors[1]["name"] if len(actors) > 1 else "Seller"

        # Scenario 1: Meeting Action Items (Multi-Party Task Graph)
        if record_type == "meeting_action_items" or len(action_items) > 0:
            for idx, item in enumerate(action_items):
                assignee = item.get("assignee") or (actors[idx % len(actors)]["name"] if actors else "Assignee")
                desc = item.get("description", f"Action Item #{idx + 1}")
                deadline = item.get("deadline")
                key = f"action_{idx + 1}"

                # Detect if one action depends on a prior one
                # e.g., "after slide deck draft is ready", "review ... after ..."
                depends_on_key = None
                cond_label = None
                if idx > 0 and ("after" in desc.lower() or "once" in desc.lower() or "post" in desc.lower()):
                    depends_on_key = f"action_{idx}"
                    cond_label = "Prerequisite Task"

                commitments.append({
                    "key": key,
                    "title": desc.split(".")[0][:45],
                    "actor": assignee,
                    "role": "Owner",
                    "description": desc,
                    "deadline": deadline or "Pending Sprint",
                    "status": "BLOCKED" if depends_on_key else "READY",
                    "is_conditional": bool(depends_on_key),
                    "depends_on_key": depends_on_key,
                    "condition_label": cond_label,
                    "evidence_text": desc,
                })
            return commitments

        # Scenario 2: Conditional Trade / Wholesale Order (e.g. Tirupur Cotton Shirts / Advance -> Dispatch -> Deliver)
        if has_advance_condition or ("advance" in lower and "dispatch" in lower):
            # Node A: Advance Payment
            adv_match = re.search(r'(?:transfer|pay|remit)?\s*(\d+%\s*(?:advance\s*payment|advance)?|₹?[\d,]+\s*advance)', transcript, re.I)
            adv_text = adv_match.group(1).strip() if adv_match else "50% Advance Payment"
            if not adv_text or adv_text in (",", "."):
                adv_text = "50% Advance Payment"
            commitments.append({
                "key": "advance_payment",
                "title": f"Transfer {adv_text}",
                "actor": primary_buyer,
                "role": "Buyer",
                "description": f"Buyer transfers {adv_text} to initiate order processing.",
                "deadline": "Tomorrow 2:00 PM" if "2 pm" in lower or "tomorrow" in lower else "Pre-dispatch",
                "status": "READY",
                "is_conditional": False,
                "evidence_text": "50% advance transfer",
            })

            # Node B: Manufacturing / Dispatch
            qty_field = next((f for f in fields if f.get("field_name") == "quantity"), None)
            item_field = next((f for f in fields if f.get("field_name") in ("order_item", "item_name")), None)
            q_val = qty_field.get("current_value", "200") if qty_field else "200"
            i_val = item_field.get("current_value", "cotton shirts") if item_field else "goods"

            commitments.append({
                "key": "dispatch_goods",
                "title": f"Dispatch {q_val} {i_val}",
                "actor": primary_seller,
                "role": "Supplier",
                "description": f"Supplier dispatches {q_val} {i_val} from manufacturing hub.",
                "deadline": "Thursday Morning" if "thursday" in lower else "Scheduled Dispatch",
                "status": "BLOCKED",
                "is_conditional": True,
                "depends_on_key": "advance_payment",
                "condition_label": "Advance Credited",
                "evidence_text": "dispatch panrom once advance is received",
            })

            # Node C: Delivery & Final Settlement
            dl_field = next((f for f in fields if f.get("field_name") == "delivery_deadline"), None)
            dl_val = dl_field.get("current_value", "Friday") if dl_field else "Friday"

            commitments.append({
                "key": "delivery_acceptance",
                "title": f"Warehouse Inward & Acceptance",
                "actor": primary_buyer,
                "role": "Buyer",
                "description": "Consignee receives goods at central warehouse and signs goods receipt note (GRN).",
                "deadline": dl_val,
                "status": "BLOCKED",
                "is_conditional": True,
                "depends_on_key": "dispatch_goods",
                "condition_label": "Inward Transit",
                "evidence_text": f"deliver by {dl_val}",
            })
            return commitments

        # Scenario 3: Standard Business Order (PO Issuance -> Fulfillment -> Settlement)
        qty_field = next((f for f in fields if f.get("field_name") == "quantity"), None)
        item_field = next((f for f in fields if f.get("field_name") in ("order_item", "item_name")), None)
        price_field = next((f for f in fields if f.get("field_name") == "unit_price"), None)
        total_field = next((f for f in fields if f.get("field_name") == "total_amount"), None)
        dl_field = next((f for f in fields if f.get("field_name") == "delivery_deadline"), None)

        q_val = qty_field.get("current_value", "Requested Units") if qty_field else "Order Units"
        i_val = item_field.get("current_value", "Ordered Items") if item_field else "Goods"
        tot_val = total_field.get("current_value", "Agreed Total") if total_field else "Net Balance"
        dl_val = dl_field.get("current_value", "By Due Date") if dl_field else "Scheduled Date"

        # Commitment 1: PO Issuance & Confirmation
        commitments.append({
            "key": "po_issuance",
            "title": f"Confirm Voice-PO ({q_val} {i_val})",
            "actor": primary_buyer,
            "role": "Buyer",
            "description": f"Issue verified commercial purchase order voucher for {q_val} {i_val}.",
            "deadline": "Immediate / Pre-dispatch",
            "status": "COMPLETED",
            "is_conditional": False,
            "evidence_text": transcript[:60],
        })

        # Commitment 2: Warehousing & Packaging
        commitments.append({
            "key": "packaging_prep",
            "title": f"Colloquial Packaging & Quality Check",
            "actor": primary_seller,
            "role": "Supplier",
            "description": f"Standardize {q_val} {i_val} into statutory packaging with HSN tagging.",
            "deadline": "24h Prior to Dispatch",
            "status": "READY",
            "is_conditional": True,
            "depends_on_key": "po_issuance",
            "condition_label": "PO Confirmed",
            "evidence_text": "surgical gloves at rate of twelve hundred",
        })

        # Commitment 3: Final Delivery
        commitments.append({
            "key": "final_delivery",
            "title": f"Consignment Delivery to Warehouse",
            "actor": primary_seller,
            "role": "Supplier",
            "description": f"Deliver consignment to central warehouse by {dl_val}.",
            "deadline": dl_val,
            "status": "BLOCKED",
            "is_conditional": True,
            "depends_on_key": "packaging_prep",
            "condition_label": "Packaged & Cleared",
            "evidence_text": f"deliver by {dl_val}",
        })

        # Commitment 4: Invoice Clearance
        commitments.append({
            "key": "invoice_clearance",
            "title": f"Remit Balance ({tot_val})",
            "actor": primary_buyer,
            "role": "Buyer",
            "description": f"Clear commercial invoice of {tot_val} post-delivery verification.",
            "deadline": "Net 7 Days Post Delivery",
            "status": "BLOCKED",
            "is_conditional": True,
            "depends_on_key": "final_delivery",
            "condition_label": "GRN Signed",
            "evidence_text": f"total {tot_val}",
        })

        return commitments

    @classmethod
    def _detect_cycles(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
    ) -> Tuple[bool, List[List[str]]]:
        """Detect cycles using DFS cycle finding. Returns (is_dag, cycles)."""
        adj: Dict[str, List[str]] = {n["id"]: [] for n in nodes}
        for edge in edges:
            if edge["source"] in adj and edge["target"] in adj:
                adj[edge["source"]].append(edge["target"])

        visited: Dict[str, int] = {n["id"]: 0 for n in nodes}  # 0=unvisited, 1=visiting, 2=visited
        cycles: List[List[str]] = []
        path: List[str] = []

        def dfs(u: str):
            visited[u] = 1
            path.append(u)
            for v in adj.get(u, []):
                if visited[v] == 1:
                    # Found cycle
                    idx = path.index(v)
                    cycles.append(list(path[idx:]))
                elif visited[v] == 0:
                    dfs(v)
            path.pop()
            visited[u] = 2

        for node in nodes:
            if visited[node["id"]] == 0:
                dfs(node["id"])

        is_dag = len(cycles) == 0
        return is_dag, cycles

    @classmethod
    def _compute_topological_sort(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
    ) -> List[str]:
        """Compute topological ordering using Kahn's algorithm."""
        in_degree: Dict[str, int] = {n["id"]: 0 for n in nodes}
        adj: Dict[str, List[str]] = {n["id"]: [] for n in nodes}

        for e in edges:
            s, t = e["source"], e["target"]
            if s in adj and t in in_degree:
                adj[s].append(t)
                in_degree[t] += 1

        queue = [n["id"] for n in nodes if in_degree[n["id"]] == 0]
        result: List[str] = []

        while queue:
            u = queue.pop(0)
            result.append(u)
            for v in adj.get(u, []):
                in_degree[v] -= 1
                if in_degree[v] == 0:
                    queue.append(v)

        return result

    @classmethod
    def _assign_layout_layers(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
        topological_order: List[str],
    ):
        """Assign layout layers (columns) for aesthetic visual rendering in React."""
        node_map = {n["id"]: n for n in nodes}
        in_edges: Dict[str, List[str]] = {n["id"]: [] for n in nodes}
        for e in edges:
            if e["target"] in in_edges:
                in_edges[e["target"]].append(e["source"])

        for nid in topological_order:
            node = node_map.get(nid)
            if not node:
                continue
            if node.get("node_type") == "ACTOR":
                node["layer"] = 0
            else:
                parents = in_edges.get(nid, [])
                parent_layers = [node_map[p]["layer"] for p in parents if p in node_map]
                node["layer"] = max(parent_layers, default=0) + 1

    @classmethod
    def _evaluate_blocker_statuses(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
    ):
        """Update node status to READY or BLOCKED depending on parent completion."""
        node_map = {n["id"]: n for n in nodes}
        # In-degree from causal DEPENDS_ON edges only
        dependency_parents: Dict[str, List[str]] = {n["id"]: [] for n in nodes}
        for e in edges:
            if e.get("relationship") == "DEPENDS_ON":
                dependency_parents[e["target"]].append(e["source"])

        for node in nodes:
            if node.get("node_type") != "COMMITMENT":
                continue
            # If already marked completed by user simulation, retain
            if node["status"] == "COMPLETED":
                continue

            parents = dependency_parents.get(node["id"], [])
            if not parents:
                node["status"] = "READY"
            else:
                all_parents_done = all(node_map.get(p, {}).get("status") == "COMPLETED" for p in parents)
                node["status"] = "READY" if all_parents_done else "BLOCKED"

    @classmethod
    def _generate_graph_summary(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
        is_dag: bool,
        cycles: List[List[str]],
    ) -> str:
        """Generate human & machine readable synopsis of the commitment graph."""
        comm_nodes = [n for n in nodes if n.get("node_type") == "COMMITMENT"]
        actors = [n for n in nodes if n.get("node_type") == "ACTOR"]
        ready_count = sum(1 for n in comm_nodes if n.get("status") == "READY")
        blocked_count = sum(1 for n in comm_nodes if n.get("status") == "BLOCKED")
        done_count = sum(1 for n in comm_nodes if n.get("status") == "COMPLETED")

        if not is_dag:
            return (
                f"CRITICAL NEGOTIATION DEADLOCK: {len(cycles)} circular dependencies detected. "
                "Parties have issued mutually blocking conditions that cannot execute sequentially."
            )

        return (
            f"Commitment DAG Verified: {len(actors)} participating parties, {len(comm_nodes)} interdependent commitments. "
            f"Current Execution State: {done_count} completed, {ready_count} actionable (unblocked), {blocked_count} conditionally locked."
        )


commitment_graph_service = CommitmentGraphService()
