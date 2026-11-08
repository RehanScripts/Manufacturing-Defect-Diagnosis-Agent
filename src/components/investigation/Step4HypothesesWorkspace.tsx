import React, { useState } from 'react';
import {
  Brain,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Search,
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Hypothesis } from '../../types';

export const Step4HypothesesWorkspace: React.FC = () => {
  const { activeCase, setCaseStep } = useInvestigation();
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string>('hyp-tool');

  if (!activeCase) return null;

  const { hypotheses, evidenceList } = activeCase;

  const selectedHypothesis =
    hypotheses.find((h) => h.id === selectedHypothesisId) || hypotheses[0];

  const getSupportingEvidence = (ids: string[]) => {
    return evidenceList.filter((e) => ids.includes(e.id));
  };

  const getContradictingEvidence = (ids: string[]) => {
    return evidenceList.filter((e) => ids.includes(e.id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Disclaimer on Mock Probabilities */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 text-slate-700 text-xs">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Illustrative Confidence Scores:</strong>{' '}
          Confidence scores represent simulated diagnostic ranking based on weighted heuristics and historical priors. They are illustrative indicators to guide engineer follow-up, not scientifically calibrated physical probabilities.
        </p>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Investigation Timeline & Prior Evidence Stream (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
              <span>Evidence Timeline</span>
              <span className="text-[10px] font-mono text-slate-400">BATCH {activeCase.batchId}</span>
            </h3>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              <div className="relative">
                <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <span className="text-[10px] font-mono text-slate-400">08:24 UTC</span>
                <p className="font-semibold text-slate-800">Visual Defect Detected</p>
                <p className="text-[11px] text-slate-500">Surface scratch cluster on Datum A face</p>
              </div>

              <div className="relative">
                <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                <span className="text-[10px] font-mono text-slate-400">08:42 UTC</span>
                <p className="font-semibold text-slate-800">Spindle Vibration Spike</p>
                <p className="text-[11px] text-slate-500">4.8 mm/s on Cut #14 (EVD-101)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white" />
                <span className="text-[10px] font-mono text-slate-400">09:10 UTC</span>
                <p className="font-semibold text-slate-800">Tool Life Limit Flagged</p>
                <p className="text-[11px] text-slate-500">Endmill T12 overdue by 18 cycles (EVD-102)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-[10px] font-mono text-slate-400">10:15 UTC</span>
                <p className="font-semibold text-slate-800">CMM Datum Skew</p>
                <p className="text-[11px] text-slate-500">0.048mm planarity deviation (EVD-106)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-600" />
              Hypothesis Generation
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              The AI evaluated 4 plausible hypotheses against retrieved CNC telemetry, maintenance records, and material chemistry.
            </p>
          </div>
        </div>

        {/* Center Col: Competing Diagnostic Hypotheses Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Competing Hypotheses ({hypotheses.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click to inspect reasoning</span>
          </div>

          <div className="space-y-3">
            {hypotheses.map((h) => {
              const isSelected = selectedHypothesisId === h.id;
              const isPrimary = h.isPrimary;

              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHypothesisId(h.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {isPrimary && (
                          <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-blue-600 text-white">
                            Primary Candidate
                          </span>
                        )}
                        {h.status === 'downgraded' && (
                          <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Downgraded
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{h.title}</h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold font-mono text-slate-900">
                        {h.confidence}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Confidence</span>
                    </div>
                  </div>

                  {/* Horizontal Confidence Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        h.confidence > 70
                          ? 'bg-blue-600'
                          : h.confidence > 45
                          ? 'bg-indigo-500'
                          : h.confidence > 25
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${h.confidence}%` }}
                    />
                  </div>

                  {/* Evidence tag indicators */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-medium">
                        ✓ {h.supportingEvidenceIds.length} Supporting
                      </span>
                      {h.contradictingEvidenceIds.length > 0 && (
                        <span className="text-red-700 font-medium">
                          ✗ {h.contradictingEvidenceIds.length} Contradicting
                        </span>
                      )}
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-blue-600 rotate-90' : 'text-slate-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Reasoning & Missing Evidence Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                Hypothesis Deep Dive
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedHypothesis.title}
              </h3>
            </div>

            {/* Why is AI considering this hypothesis? */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                Why is the AI considering this?
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-sans">
                {selectedHypothesis.aiRationale}
              </div>
            </div>

            {/* Supporting Evidence Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Supporting Evidence ({selectedHypothesis.supportingEvidenceIds.length})
              </span>
              {selectedHypothesis.supportingEvidenceIds.length === 0 ? (
                <div className="text-slate-400 italic">No strong direct evidence yet.</div>
              ) : (
                <div className="space-y-2">
                  {getSupportingEvidence(selectedHypothesis.supportingEvidenceIds).map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-emerald-800">
                        <span>{e.id}</span>
                        <span>{e.sourceType}</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 mt-1 font-sans leading-tight">
                        {e.finding}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contradicting Evidence */}
            {selectedHypothesis.contradictingEvidenceIds.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                  Contradicting Evidence
                </span>
                <div className="space-y-2">
                  {getContradictingEvidence(selectedHypothesis.contradictingEvidenceIds).map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-red-950"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-red-800">
                        <span>{e.id}</span>
                        <span>{e.sourceType}</span>
                      </div>
                      <p className="text-[11px] text-red-900 mt-1 font-sans leading-tight">
                        {e.finding}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Evidence Callout Panel */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                Missing Information Needed
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                {selectedHypothesis.missingEvidenceNotes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCaseStep(3)}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          Back to Evidence
        </button>

        <button
          type="button"
          onClick={() => setCaseStep(5)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Select Next Diagnostic Check
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
