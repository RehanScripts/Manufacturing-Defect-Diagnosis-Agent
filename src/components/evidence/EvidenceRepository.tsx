import React, { useState } from 'react';
import {
  FileArchive,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { SEED_EVIDENCE_ITEMS } from '../../mock/seedData';
import { EvidenceItem } from '../../types';

export const EvidenceRepository: React.FC = () => {
  const { cases, navigateToCase } = useInvestigation();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocModal, setSelectedDocModal] = useState<EvidenceItem | null>(null);

  const tabs = [
    'All',
    'CNC Machine Log',
    'Maintenance Record',
    'Material Inspection Report',
    'Historical Quality Case',
    'Quality Procedure',
    'CMM Telemetry',
  ];

  const filteredItems = SEED_EVIDENCE_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'All' || item.sourceType === activeTab;
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchOrMachineRef.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <FileArchive className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Industrial Evidence Repository
          </h1>
          <span className="text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            ISO 9001 Correlated Archives
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Explore production machine logs, CMM metrology telemetry, billet mill test certificates, and historical quality cases.
        </p>
      </div>

      {/* Tabs and Search Strip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search evidence finding, machine ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow text-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.sourceType}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{item.timestamp}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.finding}</p>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Document:</span>
                  <span className="text-slate-800 truncate">{item.documentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ref / Machine:</span>
                  <span className="text-slate-800 truncate">{item.batchOrMachineRef}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-slate-700">
                Relevance: {item.relevanceScore}%
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocModal(item)}
                  className="px-2.5 py-1 text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Raw Record
                </button>
              </div>
            </div>
          </div>
        ))}
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
                <div>[SYSTEM] RAW REPOSITORY ENTRY VERIFIED</div>
                <div>[AUDIT] ARCHIVAL RECORD CHECKSUM: SHA-256 VALID</div>
                <div>[TIMESTAMP] {selectedDocModal.timestamp}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Extracted Synthesis:</h4>
                <p className="text-slate-600 leading-relaxed font-sans text-xs">
                  {selectedDocModal.finding}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Full Source Payload:</h4>
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
    </div>
  );
};
