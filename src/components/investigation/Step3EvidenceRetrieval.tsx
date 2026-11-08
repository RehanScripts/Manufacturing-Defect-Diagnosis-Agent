import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { EvidenceItem, EvidenceUserStatus } from '../../types';

export const Step3EvidenceRetrieval: React.FC = () => {
  const {
    activeCase,
    setCaseStep,
    simulateEvidenceRetrieval,
    toggleEvidenceStatus,
    isAgentRunning,
  } = useInvestigation();

  const [expandedCardId, setExpandedCardId] = useState<string | null>('EVD-101');
  const [selectedDocModal, setSelectedDocModal] = useState<EvidenceItem | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');

  if (!activeCase) return null;

  const { evidenceList } = activeCase;

  const filteredEvidence =
    filterSource === 'all'
      ? evidenceList
      : evidenceList.filter((e) => e.sourceType === filterSource);

  // Evidence summary stats
  const totalRetrieved = evidenceList.length;
  const relevantCount = evidenceList.filter((e) => e.status === 'relevant').length;
  const conflictingCount = evidenceList.filter((e) => e.isConflicting).length;
  const unreviewedCount = evidenceList.filter((e) => e.status === 'unreviewed').length;

  const handleStartRetrieval = () => {
    simulateEvidenceRetrieval(activeCase.id);
  };

  const handleGenerateHypotheses = () => {
    setCaseStep(4);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'CNC Machine Log':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Maintenance Record':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Material Inspection Report':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Historical Quality Case':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Quality Procedure':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Retrieval Trigger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Step 3 — Multi-Source Evidence Retrieval
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate semantic and telemetry querying across CNC machines, maintenance logs, material certificates, and quality procedures.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartRetrieval}
          disabled={isAgentRunning}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {isAgentRunning ? 'Retrieving 6 Industrial Streams...' : 'Retrieve Evidence Sources'}
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Total Evidence</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{totalRetrieved} Records</div>
          <span className="text-[10px] text-slate-400">Queried from 6 systems</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600">Marked Relevant</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">{relevantCount} Records</div>
          <span className="text-[10px] text-slate-400">Supports root cause triage</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600">Conflicting Evidence</span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">{conflictingCount} Records</div>
          <span className="text-[10px] text-slate-400">Rules out raw stock flaw</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-purple-600">Missing Information</span>
          <div className="text-xl font-bold font-mono text-purple-600 mt-1">1 Critical Item</div>
          <span className="text-[10px] text-purple-600 font-medium">Fixture runout measurement</span>
        </div>
      </div>

      {/* Filter and Evidence Card List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Sources' },
              { id: 'CNC Machine Log', label: 'CNC Logs' },
              { id: 'Maintenance Record', label: 'Tool Life' },
              { id: 'Material Inspection Report', label: 'Material MTR' },
              { id: 'Historical Quality Case', label: 'Historical 8D' },
              { id: 'CMM Telemetry', label: 'CMM Runout' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterSource(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterSource === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing {filteredEvidence.length} of {evidenceList.length} evidence records
          </div>
        </div>

        {/* Evidence Cards Stack */}
        <div className="space-y-3">
          {filteredEvidence.map((ev) => {
            const isExpanded = expandedCardId === ev.id;
            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <div
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  onClick={() => setExpandedCardId(isExpanded ? null : ev.id)}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ev.id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSourceBadgeColor(
                          ev.sourceType
                        )}`}
                      >
                        {ev.sourceType}
                      </span>
                      {ev.isConflicting && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Contradicting Data
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400 ml-auto hidden sm:inline">
                        {ev.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>

                    <p className="text-xs text-slate-600 font-medium">
                      Finding:{' '}
                      <span className="text-slate-800 font-normal">{ev.finding}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-[11px] font-mono font-bold text-slate-900">
                        Relevance: {ev.relevanceScore}%
                      </div>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${ev.relevanceScore}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle expansion"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Document / Log File
                        </span>
                        <span className="font-mono text-slate-800">{ev.documentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Machine or Batch Ref
                        </span>
                        <span className="font-mono text-slate-800">{ev.batchOrMachineRef}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Engineer Review Status
                        </span>
                        <span
                          className={`font-semibold capitalize ${
                            ev.status === 'relevant'
                              ? 'text-emerald-600'
                              : ev.status === 'inconclusive'
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>
                    </div>

                    {ev.fullContent && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed">
                        <div className="text-slate-400 uppercase text-[9px] mb-1 font-bold">
                          Document Telemetry Extract
                        </div>
                        {ev.fullContent}
                      </div>
                    )}

                    {/* Metadata Key-Value Chips */}
                    {ev.metadata && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {Object.entries(ev.metadata).map(([k, v]) => (
                          <div
                            key={k}
                            className="bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px] font-mono"
                          >
                            <span className="text-slate-500">{k}:</span>{' '}
                            <span className="font-bold text-slate-800">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Actions on Evidence */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">Mark as:</span>
                        <button
                          type="button"
                          onClick={() => toggleEvidenceStatus(activeCase.id, ev.id, 'relevant')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            ev.status === 'relevant'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Relevant
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEvidenceStatus(activeCase.id, ev.id, 'inconclusive')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            ev.status === 'inconclusive'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Inconclusive
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEvidenceStatus(activeCase.id, ev.id, 'dismissed')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                            ev.status === 'dismissed'
                              ? 'bg-slate-600 text-white border-slate-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Dismiss
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDocModal(ev)}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Inspect Raw Source
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Document Source Preview Modal */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  {selectedDocModal.documentName}
                </span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {selectedDocModal.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono text-slate-700">
              <div className="p-3 bg-slate-900 text-emerald-400 rounded-lg text-[11px] space-y-1">
                <div>[SYSTEM] RAW SOURCE RECORD ACCESS VERIFIED</div>
                <div>[CERT] ISO 9001 / AS9100 AUDIT LOG TRACE ID: 0x992B</div>
                <div>[TIMESTAMP] {selectedDocModal.timestamp}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Finding Description:</h4>
                <p className="text-slate-600 leading-relaxed font-sans text-xs">
                  {selectedDocModal.finding}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Full Telemetry Payload / Certificate:</h4>
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] whitespace-pre-wrap font-mono">
                  {selectedDocModal.fullContent}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDocModal(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCaseStep(2)}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          Back to Visual Inspection
        </button>

        <button
          type="button"
          onClick={handleGenerateHypotheses}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Generate Investigation Hypotheses
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
