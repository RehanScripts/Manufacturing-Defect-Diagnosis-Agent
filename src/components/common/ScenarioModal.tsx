import React from 'react';
import { X, PlayCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DEMO_SCENARIOS } from '../../mock/seedData';

export const ScenarioModal: React.FC = () => {
  const { scenarioModalOpen, openScenarioModal, loadScenario, resetDemo } = useInvestigation();

  if (!scenarioModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scenario-modal-title"
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 id="scenario-modal-title" className="text-lg font-bold text-slate-900">
                Load Manufacturing Quality Demo Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select a pre-configured industrial scenario to inspect agent hypothesis generation, telemetry correlation, exception handling, and human approval workflows.
            </p>
          </div>
          <button
            onClick={() => openScenarioModal(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          {DEMO_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              className="pt-3.5 first:pt-0 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-slate-50/80 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sc.title}
                  </h3>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${sc.badgeColor}`}
                  >
                    {sc.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{sc.subtitle}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{sc.description}</p>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => loadScenario(sc.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Load Scenario
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset All Demo Data
          </button>

          <button
            type="button"
            onClick={() => openScenarioModal(false)}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
