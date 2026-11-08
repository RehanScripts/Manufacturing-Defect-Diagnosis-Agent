import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Bot,
  User,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const AuditTrailPage: React.FC = () => {
  const { auditTrail, navigateToCase } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActor, setFilterActor] = useState<string>('all');
  const [filterCase, setFilterCase] = useState<string>('all');

  const uniqueCaseIds = Array.from(new Set(auditTrail.map((e) => e.caseId)));

  const filteredEvents = auditTrail.filter((e) => {
    const matchesSearch =
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesActor = filterActor === 'all' || e.actorType === filterActor;
    const matchesCase = filterCase === 'all' || e.caseId === filterCase;

    return matchesSearch && matchesActor && matchesCase;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Regulatory Audit Trail & Compliance Log
            </h1>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
              FDA 21 CFR Part 11 / AS9100
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Immutable chronological record of AI agent reasoning steps, telemetry queries, and human engineer authorization decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Compliance Log
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search action, description, engineer, or case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Actors (AI + Human)</option>
            <option value="human">Human Engineers Only</option>
            <option value="ai">AI Agent Only</option>
          </select>

          <select
            value={filterCase}
            onChange={(e) => setFilterCase(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Cases ({uniqueCaseIds.length})</option>
            {uniqueCaseIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-mono">Timestamp</th>
                <th className="py-3 px-4 font-mono">Case ID</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Audit Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Navigate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{ev.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">
                    <button
                      onClick={() => navigateToCase(ev.caseId)}
                      className="hover:underline"
                    >
                      {ev.caseId}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">{ev.action}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-sans">
                      {ev.actorType === 'ai' ? (
                        <span className="p-1 rounded bg-blue-50 text-blue-600">
                          <Bot className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-slate-100 text-slate-700">
                          <User className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className="text-slate-700">{ev.actor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-md leading-relaxed">
                    {ev.description}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ev.status === 'Approved' || ev.status === 'Closed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ev.status === 'Escalated' || ev.status === 'Rejected'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ev.status || 'Logged'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => navigateToCase(ev.caseId)}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
