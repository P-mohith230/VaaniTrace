import React, { useState, useEffect } from 'react';
import {
  CommitmentNode,
  CommitmentEdge,
  CommitmentGraphData,
  ExtractedField,
  ActionItem,
} from '../types';
import { api } from '../services/api';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  Clock,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Layers,
  FileCode,
} from 'lucide-react';

interface CommitmentGraphViewProps {
  transcript: string;
  recordType?: string;
  fields?: ExtractedField[];
  actionItems?: ActionItem[];
  detectedLanguage?: string;
}

export const CommitmentGraphView: React.FC<CommitmentGraphViewProps> = ({
  transcript,
  recordType = 'business_order',
  fields = [],
  actionItems = [],
  detectedLanguage = 'en-IN',
}) => {
  const [graphData, setGraphData] = useState<CommitmentGraphData | null>(null);
  const [initialGraphData, setInitialGraphData] = useState<CommitmentGraphData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Fetch or construct DAG from backend
  useEffect(() => {
    let isCancelled = false;

    const loadGraph = async () => {
      if (!transcript || transcript.trim().length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.extractCommitmentGraph(transcript, recordType, fields, actionItems);
        if (!isCancelled) {
          setGraphData(data);
          setInitialGraphData(JSON.parse(JSON.stringify(data)));
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to extract commitment graph:', err);
          setError(err.message || 'Failed to extract commitment graph.');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadGraph();

    return () => {
      isCancelled = true;
    };
  }, [transcript, recordType, fields, actionItems]);

  // Handle Interactive Causal State Toggle
  const handleToggleNode = async (nodeId: string) => {
    if (!graphData || isSimulating) return;

    setIsSimulating(true);
    setActiveNodeId(nodeId);

    try {
      const res = await api.simulateCommitmentNode(
        graphData.nodes,
        graphData.edges,
        nodeId
      );

      setGraphData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nodes: res.nodes,
          edges: res.edges,
        };
      });
      setSimulationMessage(res.message);
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'Failed to simulate milestone fulfillment.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset simulation to initial extracted state
  const handleResetSimulation = () => {
    if (initialGraphData) {
      setGraphData(JSON.parse(JSON.stringify(initialGraphData)));
      setSimulationMessage('Simulation reset to original spoken state.');
      setActiveNodeId(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        background: 'var(--color-rich-black)',
        border: '2px solid var(--color-white)',
        padding: '36px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        boxShadow: '4px 4px 0px var(--accent-wine)',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--color-soft-white)' }}>
          Computing Conversation-to-Commitment DAG & Cycle Audits...
        </div>
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <div style={{
        background: 'var(--color-rich-black)',
        border: '2px solid var(--accent-crimson)',
        padding: '24px',
        color: '#FFFFFF',
      }}>
        <p style={{ margin: 0, fontSize: '13px' }}>
          {error || 'Unable to load commitment knowledge graph.'}
        </p>
      </div>
    );
  }

  const { nodes, edges, is_dag, topological_order, cycles, deadlocks_detected, summary } = graphData;

  // Group nodes by Layer for visual column layout
  const layerGroups: { [layer: number]: CommitmentNode[] } = {};
  nodes.forEach((n) => {
    const l = n.layer ?? 0;
    if (!layerGroups[l]) layerGroups[l] = [];
    layerGroups[l].push(n);
  });

  const sortedLayers = Object.keys(layerGroups)
    .map(Number)
    .sort((a, b) => a - b);

  const commitmentNodes = nodes.filter((n) => n.node_type === 'COMMITMENT');
  const completedCount = commitmentNodes.filter((n) => n.status === 'COMPLETED').length;
  const readyCount = commitmentNodes.filter((n) => n.status === 'READY').length;
  const blockedCount = commitmentNodes.filter((n) => n.status === 'BLOCKED').length;
  const progressPercent = commitmentNodes.length > 0 ? Math.round((completedCount / commitmentNodes.length) * 100) : 0;

  return (
    <div style={{
      background: 'var(--color-rich-black)',
      border: '2px solid var(--color-white)',
      padding: 'clamp(14px, 2.5vw, 24px)',
      position: 'relative',
      fontFamily: 'var(--font-sans)',
      boxShadow: '4px 4px 0px var(--accent-wine)',
      marginBottom: '24px',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Editorial Header Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '2px solid var(--color-border)',
        paddingBottom: '16px',
        marginBottom: '18px',
        gap: '12px',
        width: '100%',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--accent-wine)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 7px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              🏅 RANK 4 INNOVATION // KNOWLEDGE GRAPH (DAG)
            </span>
            <span style={{
              background: deadlocks_detected ? 'rgba(235, 87, 87, 0.2)' : 'rgba(92, 219, 149, 0.15)',
              color: deadlocks_detected ? 'var(--accent-crimson)' : '#5cdb95',
              border: `1px solid ${deadlocks_detected ? 'var(--accent-crimson)' : '#5cdb95'}`,
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 7px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {deadlocks_detected ? '⚠️ DEADLOCK DETECTED' : '✓ ACYCLIC VALIDATED (DAG)'}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              TOPOLOGICAL SORT: {topological_order.length} STEPS
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.7rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#FFFFFF',
            lineHeight: 1.25,
          }}>
            Conversation-to-Commitment Knowledge Graph
          </h2>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-muted-grey)',
            marginTop: '4px',
            margin: 0,
          }}>
            Multi-Party Causal Dependency Engine: Maps spoken promises into an executable directed acyclic state machine.
          </p>
        </div>

        {/* Graph Health Badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: deadlocks_detected ? 'rgba(235, 87, 87, 0.15)' : 'rgba(92, 219, 149, 0.15)',
            border: `1px solid ${deadlocks_detected ? 'var(--accent-crimson)' : '#5cdb95'}`,
            padding: '5px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 800,
            color: deadlocks_detected ? 'var(--accent-crimson)' : '#5cdb95',
          }}>
            {deadlocks_detected ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
            <span>{deadlocks_detected ? 'CYCLIC DEADLOCK IN NEGOTIATION' : 'ZERO-DEADLOCK GUARANTEE'}</span>
          </div>
        </div>
      </div>

      {/* Deadlock Alert Strip (If cyclic negotiation exists) */}
      {deadlocks_detected && (
        <div style={{
          background: 'rgba(235, 87, 87, 0.15)',
          border: '2px solid var(--accent-crimson)',
          padding: '12px 16px',
          marginBottom: '18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-crimson)', fontWeight: 800 }}>
            <AlertTriangle size={16} />
            <span>CRITICAL DEADLOCK DETECTED IN SPOKEN NEGOTIATION</span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'var(--color-soft-white)' }}>
            Parties have made circular conditional demands (e.g., Party A demands Party B complete an action, while Party B simultaneously conditions it on Party A).
            Arbitration or contract restructuring is required before commitments can execute.
          </p>
        </div>
      )}

      {/* Interactive Execution Metrics & Simulation Bar */}
      <div style={{
        background: 'var(--color-charcoal)',
        border: '1px solid var(--color-border)',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
      }}>
        {/* Left: Milestone Status Counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)' }}>PROGRESS:</span>
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#5cdb95' }}>
              {completedCount} / {commitmentNodes.length} ({progressPercent}%)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#5cdb95',
            }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
              {readyCount} READY
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ffb300',
            }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#ffb300' }}>
              {blockedCount} CONDITIONALLY BLOCKED
            </span>
          </div>
        </div>

        {/* Right: Simulator Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-crimson)',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            ⚡ Interactive Causal Simulator:
          </span>
          <button
            type="button"
            onClick={handleResetSimulation}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '4px 10px' }}
            title="Reset DAG to initial spoken condition"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Feedback Toast */}
      {simulationMessage && (
        <div style={{
          background: 'rgba(92, 219, 149, 0.1)',
          border: '1px solid #5cdb95',
          padding: '8px 12px',
          marginBottom: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#5cdb95',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Sparkles size={14} color="#5cdb95" />
          <span>{simulationMessage}</span>
        </div>
      )}

      {/* Visual Topological DAG Spread */}
      <div style={{
        background: 'var(--color-black)',
        border: '1px solid var(--color-border)',
        padding: '20px',
        marginBottom: '20px',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          minWidth: '780px',
          alignItems: 'flex-start',
          position: 'relative',
        }}>
          {sortedLayers.map((layerNum) => {
            const layerNodes = layerGroups[layerNum] || [];
            const isActorLayer = layerNum === 0;

            return (
              <div
                key={layerNum}
                style={{
                  flex: '1 1 240px',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Column Layer Header */}
                <div style={{
                  borderBottom: '2px solid var(--color-border)',
                  paddingBottom: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: isActorLayer ? 'var(--color-muted-grey)' : 'var(--accent-crimson)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>
                    {isActorLayer && 'LAYER 0: PARTICIPATING ACTORS'}
                    {layerNum === 1 && 'LAYER 1: TRIGGER PREREQUISITES'}
                    {layerNum === 2 && 'LAYER 2: CORE ACTIONS / DISPATCH'}
                    {layerNum >= 3 && `LAYER ${layerNum}: FINAL ACCEPTANCE & SETTLEMENT`}
                  </span>
                  <span>({layerNodes.length})</span>
                </div>

                {/* Nodes in this layer */}
                {layerNodes.map((node) => {
                  const isActor = node.node_type === 'ACTOR';
                  const isBlocked = node.status === 'BLOCKED';
                  const isReady = node.status === 'READY';
                  const isCompleted = node.status === 'COMPLETED';

                  return (
                    <div
                      key={node.id}
                      style={{
                        background: isActor
                          ? 'var(--color-charcoal)'
                          : isCompleted
                          ? 'rgba(35, 89, 55, 0.35)'
                          : isBlocked
                          ? 'rgba(40, 30, 20, 0.4)'
                          : 'rgba(114, 47, 55, 0.3)',
                        border: `1px solid ${
                          isCompleted
                            ? '#5cdb95'
                            : isBlocked
                            ? 'rgba(255, 179, 0, 0.4)'
                            : isActor
                            ? 'var(--color-border)'
                            : 'var(--accent-crimson)'
                        }`,
                        boxShadow: isCompleted
                          ? '0px 0px 8px rgba(92, 219, 149, 0.2)'
                          : 'none',
                        padding: '12px',
                        borderRadius: '2px',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                    >
                      {/* Top Node Pill */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          fontWeight: 700,
                          color: isActor ? 'var(--color-muted-grey)' : '#FFFFFF',
                          background: isActor ? 'var(--color-black)' : 'var(--accent-wine)',
                          padding: '1px 5px',
                          borderRadius: '2px',
                          textTransform: 'uppercase',
                        }}>
                          {node.actor}
                        </span>

                        {!isActor && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            fontWeight: 800,
                            color: isCompleted
                              ? '#5cdb95'
                              : isBlocked
                              ? '#ffb300'
                              : '#70a5ff',
                          }}>
                            {isCompleted && <CheckCircle size={10} />}
                            {isBlocked && <Lock size={10} />}
                            {isReady && <Unlock size={10} />}
                            <span>{node.status}</span>
                          </span>
                        )}
                      </div>

                      {/* Node Label / Title */}
                      <div style={{
                        fontWeight: 700,
                        fontSize: '12px',
                        color: '#FFFFFF',
                        lineHeight: 1.35,
                        marginBottom: '4px',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}>
                        {node.label}
                      </div>

                      {/* Description */}
                      {node.description && (
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--color-soft-white)',
                          lineHeight: 1.4,
                          marginBottom: '8px',
                        }}>
                          {node.description}
                        </div>
                      )}

                      {/* Deadline Tag */}
                      {node.deadline && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: '#ffb300',
                          background: 'rgba(255, 179, 0, 0.1)',
                          border: '1px solid rgba(255, 179, 0, 0.3)',
                          padding: '2px 5px',
                          marginBottom: '8px',
                        }}>
                          <Clock size={10} />
                          <span>Due: {node.deadline}</span>
                        </div>
                      )}

                      {/* Causal Simulation Toggle Button */}
                      {!isActor && (
                        <button
                          type="button"
                          onClick={() => handleToggleNode(node.id)}
                          disabled={isSimulating}
                          style={{
                            width: '100%',
                            background: isCompleted ? 'var(--color-black)' : 'var(--accent-wine)',
                            border: `1px solid ${isCompleted ? '#5cdb95' : '#FFFFFF'}`,
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginTop: '6px',
                          }}
                          title="Simulate fulfilling this milestone and watch downstream dependencies unlock"
                        >
                          {isCompleted ? (
                            <>
                              <RotateCcw size={10} />
                              <span>↺ Reopen Milestone</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={10} color="#5cdb95" />
                              <span>⚡ Simulate Fulfillment</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Causal Edges & Dependency Relationship Registry */}
      <div style={{
        background: 'var(--color-charcoal)',
        border: '1px solid var(--color-border)',
        padding: '14px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          color: '#FFFFFF',
          textTransform: 'uppercase',
        }}>
          <GitPullRequest size={13} color="var(--accent-crimson)" />
          <span>Causal Dependency Registry ({edges.length} Directed Edges)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);

            return (
              <div
                key={edge.id}
                style={{
                  background: 'var(--color-black)',
                  border: '1px solid var(--color-border)',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {sourceNode?.label || edge.source}
                  </span>
                  <ArrowRight size={11} color="var(--accent-crimson)" />
                  <span style={{ color: 'var(--color-soft-white)', whiteSpace: 'nowrap' }}>
                    {targetNode?.label || edge.target}
                  </span>
                </div>

                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: edge.relationship === 'DEPENDS_ON' ? '#ffb300' : '#70a5ff',
                  background: edge.relationship === 'DEPENDS_ON' ? 'rgba(255, 179, 0, 0.15)' : 'rgba(112, 165, 255, 0.15)',
                  padding: '1px 5px',
                  border: `1px solid ${edge.relationship === 'DEPENDS_ON' ? 'rgba(255, 179, 0, 0.3)' : 'rgba(112, 165, 255, 0.3)'}`,
                  whiteSpace: 'nowrap',
                }}>
                  {edge.condition_label || edge.relationship}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statutory Causal Execution Guarantee */}
      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid var(--color-border)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-muted-grey)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <ShieldCheck size={12} color="var(--accent-crimson)" />
        <span>RANK 4 PROVENANCE GUARANTEE: Commitments are validated against cyclic deadlocks via Tarjan\'s SCC. Downstream actions remain locked until conversational prerequisites are proven complete.</span>
      </div>
    </div>
  );
};
