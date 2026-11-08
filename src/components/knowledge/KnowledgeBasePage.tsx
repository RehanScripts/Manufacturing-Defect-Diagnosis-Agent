import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import { KNOWLEDGE_BASE_ITEMS } from '../../mock/seedData';

export const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const filteredItems = KNOWLEDGE_BASE_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manufacturing Quality Knowledge Base
          </h1>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Expert-Reviewed Knowledge
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Peer-reviewed SOPs, defect physics criteria, ISO 9001 / AS9100 RCA protocols, and CNC tooling standards.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search standards, defect categories, or tool wear limits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {filteredItems.length} Verified Articles
        </span>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer text-xs text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.id} • {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Reviewed: {item.lastReviewed}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Audited By: <strong className="text-slate-800 font-semibold">{item.reviewedBy}</strong>
              </span>

              <span className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
                Read SOP <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail SOP Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  {selectedItem.id}: {selectedItem.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {selectedItem.status}
                </div>
                <div>Reviewer: {selectedItem.reviewedBy} • Version Date: {selectedItem.lastReviewed}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Standard Scope & Summary:</h4>
                <p className="text-slate-600 leading-relaxed font-sans">{selectedItem.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mandatory Inspection Guidelines & Decision Tree:</h4>
                <ul className="space-y-2">
                  {selectedItem.guidelines.map((rule: string, idx: number) => (
                    <li key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer"
              >
                Close SOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
