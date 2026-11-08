import React from 'react';
import {
  FileText,
  ScanEye,
  Database,
  Brain,
  Wrench,
  CheckCircle,
  CheckSquare,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Share2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Step1ReportDefect } from './Step1ReportDefect';
import { Step2VisualInspection } from './Step2VisualInspection';
import { Step3EvidenceRetrieval } from './Step3EvidenceRetrieval';
import { Step4HypothesesWorkspace } from './Step4HypothesesWorkspace';
import { Step5DiagnosticCheck } from './Step5DiagnosticCheck';
import { Step6UpdatedDiagnosis } from './Step6UpdatedDiagnosis';
import { Step7CorrectiveAction } from './Step7CorrectiveAction';
import { AgentActivityPanel } from '../common/AgentActivityPanel';

export const InvestigationWizard: React.FC = () => {
  const { activeCase, setCaseStep, setCurrentView, openScenarioModal } = useInvestigation();

  if (!activeCase) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">No active investigation case selected.</p>
        <button
          onClick={() => setCurrentView('overview')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-xs"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Report Defect', icon: FileText },
    { num: 2, title: 'Analyze Inspection', icon: ScanEye },
    { num: 3, title: 'Retrieve Evidence', icon: Database },
    { num: 4, title: 'Investigate Root Cause', icon: Brain },
    { num: 5, title: 'Diagnostic Checks', icon: Wrench },
    { num: 6, title: 'Review Diagnosis', icon: CheckCircle },
    { num: 7, title: 'Corrective Action', icon: CheckSquare },
  ];

  const currentStep = activeCase.currentStep || 1;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ReportDefect />;
      case 2:
        return <Step2VisualInspection />;
      case 3:
        return <Step3EvidenceRetrieval />;
      case 4:
        return <Step4HypothesesWorkspace />;
      case 5:
        return <Step5DiagnosticCheck />;
      case 6:
        return <Step6UpdatedDiagnosis />;
      case 7:
        return <Step7CorrectiveAction />;
      default:
        return <Step1ReportDefect />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Case Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentView('cases')}
                className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 text-xs font-semibold mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Cases
              </button>
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {activeCase.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {activeCase.defectCategory}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  activeCase.severity === 'Critical'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : activeCase.severity === 'High'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {activeCase.severity} Severity
              </span>
              <span className="text-xs font-medium text-slate-500 font-mono">
                Batch: {activeCase.batchId} • Line: {activeCase.machineId}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900">{activeCase.title}</h1>
            <p className="text-xs text-slate-500">
              Part: <strong className="text-slate-700 font-mono">{activeCase.componentId}</strong> ({activeCase.componentName}) • Assigned QE: {activeCase.assignedEngineer}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openScenarioModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Demo Scenarios
            </button>
          </div>
        </div>

        {/* Horizontal 7-Step Navigation Stepper */}
        <div className="mt-6 pt-5 border-t border-slate-100 overflow-x-auto">
          <ol className="flex items-center min-w-[760px] justify-between relative" aria-label="Investigation Steps">
            {steps.map((st, index) => {
              const Icon = st.icon;
              const isCompleted = st.num < currentStep;
              const isCurrent = st.num === currentStep;
              const isPending = st.num > currentStep;
              const isEscalated = activeCase.status === 'Escalated' && st.num === 6;

              return (
                <li
                  key={st.num}
                  className="flex-1 flex flex-col items-center relative group select-none"
                >
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 z-0 transition-colors ${
                        isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Step circle button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Allow navigating to any completed step or the active step
                      if (st.num <= currentStep) {
                        setCaseStep(st.num);
                      }
                    }}
                    disabled={isPending}
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isEscalated
                        ? 'bg-red-600 text-white shadow-md'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110'
                        : isCompleted
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                        : 'bg-white border-2 border-slate-300 text-slate-400 cursor-not-allowed'
                    }`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isEscalated ? (
                      <AlertTriangle className="w-4 h-4 text-white" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </button>

                  {/* Step Title Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider block ${
                        isCurrent
                          ? 'text-blue-600'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      Step {st.num}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isCurrent
                          ? 'text-slate-900 font-bold'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Real-time Agent Activity Trace Widget (if running or completed) */}
      <AgentActivityPanel />

      {/* Main Step Workspace */}
      <main className="min-h-[460px]">{renderStepContent()}</main>
    </div>
  );
};
