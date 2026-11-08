import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  UserCheck,
  FileCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DiagnosticCheckOption, DiagnosticCheckResult } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const Step5DiagnosticCheck: React.FC = () => {
  const {
    activeCase,
    setCaseStep,
    approveDiagnosticCheck,
    submitDiagnosticCheckResult,
    notify,
  } = useInvestigation();

  const [selectedCheckId, setSelectedCheckId] = useState<string>(
    activeCase?.recommendedCheck.id || 'CHK-01'
  );
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [resultOutcome, setResultOutcome] = useState<'supports' | 'contradicts' | 'inconclusive'>('contradicts');
  const [measuredValue, setMeasuredValue] = useState('Dial test indicator measured 0.046mm runout (Limit: 0.008mm)');
  const [engineerNotes, setEngineerNotes] = useState(
    'Disassembled fixture nest: found compressed aluminum swarf chips trapped directly under locating pin A. Explains the 0.045mm tilt.'
  );

  if (!activeCase) return null;

  const { recommendedCheck, alternativeChecks, activeCheckResult } = activeCase;

  // Selected check option details
  const allChecks = [recommendedCheck, ...alternativeChecks];
  const activeCheck = allChecks.find((c) => c.id === selectedCheckId) || recommendedCheck;

  const isCheckApproved =
    activeCheckResult?.checkId === selectedCheckId &&
    (activeCheckResult.status === 'approved_awaiting_result' ||
      activeCheckResult.status === 'completed');

  const handleApprove = () => {
    approveDiagnosticCheck(activeCase.id, selectedCheckId);
    setApprovalModalOpen(false);
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    submitDiagnosticCheckResult(activeCase.id, {
      checkId: selectedCheckId,
      status: 'completed',
      resultOutcome,
      measuredValue,
      engineerNotes,
    });
  };

  // Quick preset loader for testing outcomes
  const handleApplyPreset = (type: 'swarf_contradiction' | 'tool_wear_confirmed') => {
    if (type === 'swarf_contradiction') {
      setSelectedCheckId('CHK-01');
      setResultOutcome('supports'); // Supports fixture hypothesis!
      setMeasuredValue('Runout: 0.048mm on Datum pin A (Tolerance envelope: 0.008mm)');
      setEngineerNotes(
        'Physical dial indicator confirmed 0.048mm tilt. Aluminum swarf chip discovered trapped under nest. Tool geometry was inspected and showed minimal wear.'
      );
    } else {
      setSelectedCheckId('CHK-02');
      setResultOutcome('supports'); // Supports tool wear hypothesis!
      setMeasuredValue('Flank wear land VBB measured 0.28mm (Max allowable: 0.20mm)');
      setEngineerNotes(
        'Optical microscope inspection confirms severe carbide chipping on corner radius of Endmill T12. Consistent with 18 cycles overdue replacement.'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Agent Recommendation Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Step 5 — Diagnostic Check Recommendation & Execution
            </h2>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Information Gain Optimal
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The AI agent evaluated potential follow-up checks to maximize information gain between the two primary competing hypotheses (Tool Wear vs Fixture Misalignment). Select, approve, and record physical measurements below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recommended & Alternative Check Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Recommended Next Check
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              HIGH DISCRIMINATIVE POWER
            </span>
          </div>

          {/* Featured Recommendation Card */}
          <div
            onClick={() => setSelectedCheckId(recommendedCheck.id)}
            className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${
              selectedCheckId === recommendedCheck.id
                ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {recommendedCheck.id} • RECOMMENDED
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {recommendedCheck.name}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Priority: {recommendedCheck.priority}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <strong className="text-slate-800">Purpose:</strong> {recommendedCheck.purpose}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-600">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Equipment</span>
                <span className="text-slate-800 truncate block">{recommendedCheck.requiredEquipment}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Duration</span>
                <span className="text-slate-800">{recommendedCheck.estimatedDuration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Responsible QE</span>
                <span className="text-slate-800">{recommendedCheck.responsibleEngineer.split(' ')[0]}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Standard SOP: {recommendedCheck.standardOperatingProcedureRef}
              </span>

              {!isCheckApproved ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCheckId(recommendedCheck.id);
                    setApprovalModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Approve Diagnostic Check
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approved by Lead QE
                </span>
              )}
            </div>
          </div>

          {/* Alternative Diagnostic Checks */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Alternative Diagnostic Checks ({alternativeChecks.length})
            </span>

            {alternativeChecks.map((chk) => (
              <div
                key={chk.id}
                onClick={() => setSelectedCheckId(chk.id)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedCheckId === chk.id
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {chk.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{chk.name}</h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{chk.estimatedDuration}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{chk.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Check Approval & Result Entry Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Physical Execution Portal
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeCheck.name}</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  isCheckApproved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isCheckApproved ? 'APPROVED' : 'AWAITING APPROVAL'}
              </span>
            </div>

            {!isCheckApproved ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <h4 className="font-semibold text-slate-800">Engineer Approval Required</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Industrial safety and AS9100 quality protocols require lead quality engineer authorization before executing machine checks or tool removal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApprovalModalOpen(true)}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Approve Diagnostic Check ({activeCheck.id})
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitResult} className="space-y-4">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Check Authorized by Rajesh Sharma
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                    Authorized at {activeCheckResult?.approvedAt || '2026-11-08 10:20:00'}
                  </div>
                </div>

                {/* Outcome Selector */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                    Empirical Check Outcome *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setResultOutcome('supports')}
                      className={`p-2 rounded border text-center font-bold text-xs transition-colors cursor-pointer ${
                        resultOutcome === 'supports'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Supports
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultOutcome('contradicts')}
                      className={`p-2 rounded border text-center font-bold text-xs transition-colors cursor-pointer ${
                        resultOutcome === 'contradicts'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Contradicts
                    </button>
                    <button
                      type="button"
                      onClick={() => setResultOutcome('inconclusive')}
                      className={`p-2 rounded border text-center font-bold text-xs transition-colors cursor-pointer ${
                        resultOutcome === 'inconclusive'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Inconclusive
                    </button>
                  </div>
                </div>

                {/* Measured Physical Value */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Physical Measured Value / Metrology Reading *
                  </label>
                  <input
                    type="text"
                    value={measuredValue}
                    onChange={(e) => setMeasuredValue(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Flange runout measured 0.048mm..."
                  />
                </div>

                {/* Engineer Notes */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Engineer Findings & Disassembly Observations *
                  </label>
                  <textarea
                    rows={3}
                    value={engineerNotes}
                    onChange={(e) => setEngineerNotes(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Describe physical condition, calibration verification, or swarf observed..."
                  />
                </div>

                {/* Submit Result */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Submit Result & Revise AI Hypotheses
                </button>
              </form>
            )}

            {/* Quick Demo Result Presets */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Simulated Test Scenarios
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('swarf_contradiction')}
                  className="flex-1 text-[11px] text-blue-700 hover:bg-blue-50 p-1.5 rounded border border-blue-200 font-medium text-left"
                >
                  • Fixture Swarf Runout Detected
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('tool_wear_confirmed')}
                  className="flex-1 text-[11px] text-indigo-700 hover:bg-indigo-50 p-1.5 rounded border border-indigo-200 font-medium text-left"
                >
                  • Severe Insert Wear Confirmed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Approving Diagnostic Check */}
      <ConfirmationModal
        isOpen={approvalModalOpen}
        title="Approve Diagnostic Check?"
        subtitle={`Check Ref: ${activeCheck.id} • SOP: ${activeCheck.standardOperatingProcedureRef}`}
        message={`Authorize technician execution of "${activeCheck.name}". This will pause line processing on ${activeCase.machineId} for approximately ${activeCheck.estimatedDuration}.`}
        confirmLabel="Authorize Check"
        variant="primary"
        onConfirm={handleApprove}
        onCancel={() => setApprovalModalOpen(false)}
      >
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1 font-mono text-slate-600">
          <div>Engineer: Rajesh Sharma (Lead Quality Engineer)</div>
          <div>Risk Level: {activeCheck.riskLevel} • Priority: {activeCheck.priority}</div>
        </div>
      </ConfirmationModal>

      {/* Nav Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCaseStep(4)}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          Back to Hypotheses
        </button>

        {activeCase.previousCheckResults && activeCase.previousCheckResults.length > 0 && (
          <button
            type="button"
            onClick={() => setCaseStep(6)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Proceed to Updated Diagnosis
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
