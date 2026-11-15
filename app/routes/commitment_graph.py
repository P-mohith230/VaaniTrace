"""API routes for Multi-Party Conversation-to-Commitment Knowledge Graph (Rank 4 Innovation)."""

import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas import (
    CommitmentGraphExtractRequest,
    CommitmentGraphResponse,
    CommitmentSimulateRequest,
    CommitmentSimulateResponse,
)
from app.services.commitment_graph import commitment_graph_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/graph", tags=["Commitment Knowledge Graph"])


@router.post("/extract", response_model=CommitmentGraphResponse)
async def extract_commitment_graph(request: CommitmentGraphExtractRequest):
    """Extract multi-party commitment nodes, dependencies, and topological ordering from conversation."""
    try:
        result = commitment_graph_service.extract_commitment_graph(
            transcript=request.transcript,
            record_type=request.record_type,
            fields=request.fields,
            action_items=request.action_items,
        )
        return CommitmentGraphResponse(**result)
    except Exception as exc:
        logger.error(f"Failed to extract commitment graph: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to extract commitment graph: {str(exc)}",
        )


@router.post("/simulate", response_model=CommitmentSimulateResponse)
async def simulate_node_transition(request: CommitmentSimulateRequest):
    """Simulate fulfilling or unfulfilling a milestone, cascading causal states down the DAG."""
    try:
        # Convert Pydantic schemas to dicts
        raw_nodes = [n.model_dump() for n in request.nodes]
        raw_edges = [e.model_dump() for e in request.edges]

        result = commitment_graph_service.simulate_node_transition(
            nodes=raw_nodes,
            edges=raw_edges,
            target_node_id=request.target_node_id,
        )
        return CommitmentSimulateResponse(**result)
    except Exception as exc:
        logger.error(f"Failed to simulate node transition: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to simulate commitment node transition: {str(exc)}",
        )
