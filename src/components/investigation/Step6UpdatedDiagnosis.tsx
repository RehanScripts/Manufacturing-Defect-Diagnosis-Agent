import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Brain,
  FileCheck,
  UserX,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const Step6UpdatedDiagnosis: React.FC = () => {
  const {
    activeCase,
    setCaseStep,
    approveDiagnosis,
    rejectDiagnosis,
    escalateDiagnosis,
  } = useInvestigation();

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);

  const [approvalNotes, setApprovalNotes] = useState(
    'Root cause confirmed via 0.046mm dial test indicator deflection and direct physical discovery of trapped swarf under Datum A locating nest.'
  );
  const [rejectReason, setRejectReason] = useState(
    'Insufficient data on whether spindle bearing runout contributed to vibration.'
  );
  const [escalationReason, setEscalateReason] = useState(
    'Requires review by Chief Metallurgist & Plant Tooling Director for potential batch-wide fixture recall.'
  );
  const [targetSeniorEngineer, setTargetSeniorEngineer] = useState(
    'Dr. Arvind Kulkarni (Chief Metallurgist & Quality Director)'
  );

  if (!activeCase) return null;

  const { hypotheses, primaryRootCause, aiConfidence, activeCheckResult, status } = activeCase;

  const handleApproveConfirm = () => {
    approveDiagnosis(activeCase.id, approvalNotes);
    setApproveModalOpen(false);
  };

  const handleRejectConfirm = () => {
    rejectDiagnosis(activeCase.id, rejectReason);
    setRejectModalOpen(false);
  };

  const handleEscalateConfirm = () => {
    escalateDiagnosis(activeCase.id, escalationReason, targetSeniorEngineer);
    setEscalateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Root Cause Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Primary Root Cause Candidate
              </span>
              <span className="text-xs font-mono font-medium text-slate-500">
                Status: {activeCase.diagnosisStatus || 'Likely — Awaiting Lead QE Verification'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {primaryRootCause || 'Fixture Misalignment / Swarf Contamination'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-blue-600">
                {aiConfidence}%
              </div>
              <div className="text-[11px] text-slate-400">Illustrative Score</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 font-bold text-lg">
              8D
            </div>
          </div>
        </div>

        {/* Diagnosis Narrative */}
        <div className="pt-4 text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            <strong>Investigation Synthesis:</strong> Visual surface scratches on Datum A face were initially weighted toward Tool Wear due to an overdue tool life counter. However, physical inspection of cutting tool T12 revealed nominal flank wear (0.04mm vs 0.20mm allowable). Follow-up dial indicator runout verification confirmed <strong>0.046mm angular tilt in the hydraulic fixture</strong> caused by packed aluminum swarf chips under locating pin A.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-500">
            <span>Supporting Evidence: EVD-101, EVD-104, EVD-106, CHK-01</span>
            <span>•</span>
            <span>Contradicting Evidence Disproved: Tool Wear Land Nominal</span>
          </div>
        </div>
      </div>

      {/* Comparison: Original Hypotheses vs Revised State */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            Empirical Revision of Hypotheses (Before vs After Physical Check)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Dynamic Agent Re-weighting</span>
        </div>

        <div className="space-y-3">
          {hypotheses.map((h) => {
            const diff = h.confidence - h.initialConfidence;
            return (
              <div
                key={h.id}
                className={`p-3.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  h.isPrimary
                    ? 'border-blue-600 bg-blue-50/20'
                    : h.status === 'downgraded'
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{h.title}</span>
                    {h.isPrimary && (
                      <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.2 rounded font-mono">
                        TOP CANDIDATE
                      </span>
                    )}
                    {h.status === 'downgraded' && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                        DISPROVED / DOWNGRADED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{h.aiRationale}</p>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Prior: {h.initialConfidence}%</span>
                    <span className="font-mono font-bold text-sm text-slate-800">
                      Now: {h.confidence}%
                    </span>
                  </div>

                  <div className="w-20 text-right">
                    {diff > 0 ? (
                      <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{diff}%
                      </span>
                    ) : diff < 0 ? (
                      <span className="inline-flex items-center text-xs font-bold font-mono text-red-600">
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {diff}%
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">0%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnosis Review & Human-in-the-Loop Decision Panel */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Quality Assurance Governance
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Engineer Diagnosis Review & Authorization
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            MANDATORY HUMAN SIGN-OFF
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The AI investigation agent cannot unilaterally approve root causes or mandate physical line modifications. Review the findings, evaluate remaining uncertainties, and authorize one of the four actions below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Action 1: Approve Diagnosis */}
          <button
            type="button"
            onClick={() => setApproveModalOpen(true)}
            className="p-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Approve Diagnosis</span>
            <span className="text-[10px] font-normal text-emerald-100">Draft CAPA in Step 7</span>
          </button>

          {/* Action 2: Reject Diagnosis */}
          <button
            type="button"
            onClick={() => setRejectModalOpen(true)}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <XCircle className="w-5 h-5 text-red-400" />
            <span>Reject Diagnosis</span>
            <span className="text-[10px] font-normal text-slate-400">Return to Step 4 Hypotheses</span>
          </button>

          {/* Action 3: Request More Evidence */}
          <button
            type="button"
            onClick={() => setCaseStep(5)}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <span>Request More Evidence</span>
            <span className="text-[10px] font-normal text-slate-400">Run additional checks</span>
          </button>

          {/* Action 4: Escalate to Senior Engineer */}
          <button
            type="button"
            onClick={() => setEscalateModalOpen(true)}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span>Escalate to Senior</span>
            <span className="text-[10px] font-normal text-slate-400">Chief Metallurgist Review</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal 1: Approve Diagnosis */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        title="Approve Root Cause Diagnosis?"
        subtitle={`Case: ${activeCase.id} • Root Cause: ${primaryRootCause}`}
        message="By approving this diagnosis, you confirm that empirical evidence confirms the defect mechanism. The case will advance to Step 7 to draft Corrective & Preventive Actions (CAPA)."
        confirmLabel="Approve & Draft CAPA"
        variant="success"
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalOpen(false)}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Verification Rationale / Engineer Signature Notes
          </label>
          <textarea
            rows={3}
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
          />
        </div>
      </ConfirmationModal>

      {/* Confirmation Modal 2: Reject Diagnosis */}
      <ConfirmationModal
        isOpen={rejectModalOpen}
        title="Reject Proposed Diagnosis?"
        subtitle="Return case to investigation workspace"
        message="Rejecting the diagnosis indicates the evidence does not sufficiently substantiate the proposed root cause. Provide a reason to guide the agent in formulating alternate hypotheses."
        confirmLabel="Confirm Rejection"
        variant="danger"
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalOpen(false)}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Rejection Reason *</label>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
          />
        </div>
      </ConfirmationModal>

      {/* Confirmation Modal 3: Escalate Case */}
      <ConfirmationModal
        isOpen={escalateModalOpen}
        title="Escalate Quality Investigation?"
        subtitle="Formal routing to Senior Metallurgical & Quality Leadership"
        message="Escalation is recommended when defect severity compromises structural safety, contradictory evidence cannot be resolved on the line, or tooling failure poses plant-wide risk."
        confirmLabel="Confirm Escalation"
        variant="warning"
        onConfirm={handleEscalateConfirm}
        onCancel={() => setEscalateModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Escalate To Senior Engineer / Director:
            </label>
            <input
              type="text"
              value={targetSeniorEngineer}
              onChange={(e) => setTargetSeniorEngineer(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Escalation Summary & Risk Assessment *
            </label>
            <textarea
              rows={3}
              value={escalationReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          </div>
        </div>
      </ConfirmationModal>

      {/* Bottom Nav Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCaseStep(5)}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          Back to Diagnostic Checks
        </button>

        {activeCase.diagnosisStatus === 'Approved' && (
          <button
            type="button"
            onClick={() => setCaseStep(7)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Open Corrective Action Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
