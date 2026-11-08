import React from 'react';
import { Bot, CheckCircle2, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const AgentActivityPanel: React.FC = () => {
  const { isAgentRunning, agentActivities } = useInvestigation();

  if (!isAgentRunning && agentActivities.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-100 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md border border-blue-500/30">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Quality Investigation Agent
              </span>
              {isAgentRunning ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  Reasoning in Progress
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Execution Complete
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulated telemetry correlation, ISO 9001 rule checking & multi-source synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono">HUMAN-IN-THE-LOOP GUARDRAIL</span>
        </div>
      </div>

      <div className="space-y-2">
        {agentActivities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-2.5 text-xs p-2 rounded transition-colors ${
              activity.status === 'running'
                ? 'bg-blue-950/60 border border-blue-800/60 text-blue-200'
                : activity.status === 'completed'
                ? 'bg-slate-800/40 text-slate-300'
                : 'text-slate-500'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {activity.status === 'running' && (
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              )}
              {activity.status === 'completed' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {activity.status === 'pending' && (
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono">{activity.label}</span>
              {activity.detail && (
                <p className="text-[11px] text-slate-400 mt-0.5">{activity.detail}</p>
              )}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              {activity.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
