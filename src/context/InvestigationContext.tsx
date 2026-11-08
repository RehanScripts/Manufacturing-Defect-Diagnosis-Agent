import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  InvestigationCase,
  AuditEvent,
  EvidenceUserStatus,
  DiagnosticCheckResult,
  CorrectiveActionItem,
  MonitoringBatchItem,
} from '../types';
import {
  INITIAL_SEEDED_CASES,
  INITIAL_AUDIT_TRAIL,
  DEMO_SCENARIOS,
  INITIAL_DIAGNOSTIC_CHECKS,
  SEED_EVIDENCE_ITEMS,
  DEFECT_IMAGES,
} from '../mock/seedData';
import {
  recalculateHypothesesAfterCheckResult,
  calculateBatchDefectRate,
  evaluateMonitoringEffectiveness,
  generateCaseId,
} from '../utils/investigationLogic';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface AgentActivityStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}

interface InvestigationContextType {
  cases: InvestigationCase[];
  activeCaseId: string;
  activeCase: InvestigationCase | undefined;
  currentView: string;
  auditTrail: AuditEvent[];
  scenarioModalOpen: boolean;
  notifications: ToastNotification[];
  agentActivities: AgentActivityStep[];
  isAgentRunning: boolean;

  // Actions
  setCurrentView: (view: string) => void;
  setActiveCaseId: (id: string) => void;
  navigateToCase: (caseId: string, step?: number) => void;
  openScenarioModal: (open: boolean) => void;
  dismissNotification: (id: string) => void;
  notify: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Case workflow actions
  createNewCase: (formData: Partial<InvestigationCase>) => string;
  setCaseStep: (stepNumber: number) => void;
  simulateAgentVisualAnalysis: (caseId: string, onComplete?: () => void) => void;
  simulateEvidenceRetrieval: (caseId: string, onComplete?: () => void) => void;
  toggleEvidenceStatus: (caseId: string, evidenceId: string, status: EvidenceUserStatus) => void;
  approveDiagnosticCheck: (caseId: string, checkId: string) => void;
  submitDiagnosticCheckResult: (caseId: string, result: DiagnosticCheckResult) => void;
  approveDiagnosis: (caseId: string, notes?: string) => void;
  rejectDiagnosis: (caseId: string, reason: string) => void;
  escalateDiagnosis: (caseId: string, reason: string, targetEngineer: string) => void;
  updateCorrectiveActions: (caseId: string, actions: CorrectiveActionItem[]) => void;
  approveCorrectiveActionPlan: (caseId: string, notes?: string) => void;
  updateMonitoringBatch: (caseId: string, batchId: string, patch: Partial<MonitoringBatchItem>) => void;
  closeInvestigation: (caseId: string) => void;

  // Demo controls
  loadScenario: (scenarioId: string) => void;
  resetDemo: () => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CASES = 'mqi_app_cases_v1';
const LOCAL_STORAGE_KEY_AUDIT = 'mqi_app_audit_v1';

export const InvestigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<InvestigationCase[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CASES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SEEDED_CASES;
  });

  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUDIT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_AUDIT_TRAIL;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>('MQI-2026-0042');
  const [currentView, setCurrentView] = useState<string>('overview');
  const [scenarioModalOpen, setScenarioModalOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [agentActivities, setAgentActivities] = useState<AgentActivityStep[]>([]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch {
      // storage quota or disabled
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_AUDIT, JSON.stringify(auditTrail));
    } catch {
      // storage quota or disabled
    }
  }, [auditTrail]);

  const activeCase = useMemo(() => {
    return cases.find((c) => c.id === activeCaseId) || cases[0];
  }, [cases, activeCaseId]);

  const notify = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);

    setTimeout(() => {
      dismissNotification(id);
    }, 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addAuditEvent = (action: string, description: string, caseId: string, actor = 'Quality Agent (AI)', actorType: 'ai' | 'human' | 'system' = 'ai', status = 'Completed') => {
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      actor,
      actorType,
      caseId,
      description,
      status,
    };
    setAuditTrail((prev) => [newEvent, ...prev]);
  };

  const navigateToCase = (caseId: string, step?: number) => {
    setActiveCaseId(caseId);
    if (step !== undefined) {
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, currentStep: step } : c))
      );
    }
    setCurrentView('wizard');
  };

  const createNewCase = (formData: Partial<InvestigationCase>): string => {
    const newId = generateCaseId(cases.length);
    const category = formData.defectCategory || 'Surface Scratches';
    let defaultImg = DEFECT_IMAGES.surfaceScratches;
    if (category === 'Dimensional Deviation') defaultImg = DEFECT_IMAGES.dimensionalDeviation;
    if (category === 'Burr Formation') defaultImg = DEFECT_IMAGES.burrFormation;
    if (category === 'Surface Cracks') defaultImg = DEFECT_IMAGES.surfaceCracks;

    const newCase: InvestigationCase = {
      id: newId,
      title: formData.title || `${category} on Precision Housing`,
      componentName: formData.componentName || 'Precision Optical Housing (Rev D)',
      componentId: formData.componentId || 'POH-6061-043',
      batchId: formData.batchId || 'B-205',
      manufacturingLine: formData.manufacturingLine || 'CNC Line 3 — 5-Axis Cell',
      machineId: formData.machineId || 'CNC-DMU50-L3',
      inspectionDate: formData.inspectionDate || new Date().toISOString().slice(0, 10),
      defectCategory: category,
      severity: formData.severity || 'Medium',
      description: formData.description || 'Observed surface defect during standard stage inspection.',
      inspectorName: formData.inspectorName || 'Rajesh Sharma (Lead QE)',
      assignedEngineer: 'Rajesh Sharma (Lead QE)',
      status: 'Under Investigation',
      currentStep: 2, // Go directly to visual inspection analysis
      aiConfidence: 75,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      imageDetails: {
        url: formData.imageDetails?.url || defaultImg,
        fileName: formData.imageDetails?.fileName || 'Inspected_Housing_Sample.jpg',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        resolution: '4096 x 3072 px',
        lightingCondition: 'High-Intensity Inspection Dome',
        simulatedVisualConfidence: 94.8,
        visualObservations: [
          `Visual feature profile matches ${category} signature.`,
          'Localized coordinates detected in finish milled sector.',
          'Subsequent telemetry and process verification required.',
        ],
        detectedBBoxes: [
          {
            x: 52,
            y: 36,
            width: 24,
            height: 16,
            label: category,
            confidence: 94.8,
          },
        ],
      },
      evidenceList: SEED_EVIDENCE_ITEMS,
      hypotheses: [
        {
          id: 'hyp-fixture',
          title: 'Fixture Misalignment / Swarf Contamination',
          confidence: 52,
          initialConfidence: 52,
          supportingEvidenceIds: ['EVD-101', 'EVD-104'],
          contradictingEvidenceIds: [],
          missingEvidenceNotes: 'Need physical dial test indicator runout measurement of fixture locating pins under clamp load.',
          aiRationale: 'Spindle vibration telemetry correlates with possible datum shift during high-torque cut.',
          status: 'active',
        },
        {
          id: 'hyp-tool',
          title: 'Tool Wear / Broken Insert Flank',
          confidence: 76,
          initialConfidence: 76,
          supportingEvidenceIds: ['EVD-102'],
          contradictingEvidenceIds: [],
          missingEvidenceNotes: 'Optical microscope inspection of cutter edges is needed to measure flank wear land.',
          aiRationale: 'Tool life tracking records indicate active cutter has exceeded manufacturer recommendation.',
          isPrimary: true,
          status: 'active',
        },
        {
          id: 'hyp-params',
          title: 'Incorrect Machining Parameters (Feed Rate Overload)',
          confidence: 34,
          initialConfidence: 34,
          supportingEvidenceIds: ['EVD-101'],
          contradictingEvidenceIds: [],
          missingEvidenceNotes: 'Real-time servo load log verification needed.',
          aiRationale: 'Cut feed rate variation observed in machine controller logs.',
          status: 'active',
        },
        {
          id: 'hyp-material',
          title: 'Material Inconsistency / Raw Stock Defects',
          confidence: 15,
          initialConfidence: 15,
          supportingEvidenceIds: [],
          contradictingEvidenceIds: ['EVD-103'],
          missingEvidenceNotes: 'Material mill certification shows chemistry within ASTM standards.',
          aiRationale: 'Raw billet mill certificate confirms standard aluminum composition.',
          status: 'downgraded',
        },
      ],
      recommendedCheck: INITIAL_DIAGNOSTIC_CHECKS[0],
      alternativeChecks: INITIAL_DIAGNOSTIC_CHECKS.slice(1, 4),
      correctiveActions: [
        {
          id: 'CAPA-NEW-01',
          description: 'Perform complete fixture datum tear-down and alignment recalibration.',
          owner: 'Sunil Kadam (CNC Maintenance)',
          priority: 'High',
          dueDate: '2026-11-12',
          status: 'Not Started',
          verificationMethod: 'Dial indicator runout < 0.008mm.',
        },
        {
          id: 'CAPA-NEW-02',
          description: 'Enforce automatic tool cycle lockout at 350 cycles on Fanuc CNC controller.',
          owner: 'Anil Deshmukh (Tooling)',
          priority: 'Medium',
          dueDate: '2026-11-11',
          status: 'Not Started',
          verificationMethod: 'Simulated counter overflow test.',
        },
        {
          id: 'CAPA-NEW-03',
          description: 'Execute post-action 3-batch continuous monitoring protocol.',
          owner: 'Rajesh Sharma (Lead QE)',
          priority: 'High',
          dueDate: '2026-11-15',
          status: 'Not Started',
          verificationMethod: '100% optical inspection on subsequent 450 units.',
        },
      ],
      correctiveActionPlanApproved: false,
      monitoringBatches: [
        {
          id: 'MB-N1',
          batchId: `${formData.batchId || 'B-205'}-M1`,
          date: '2026-11-09',
          totalInspected: 150,
          defectsFound: 0,
          defectRate: 0,
          status: 'Pending',
          notes: 'Awaiting completion of first post-action batch.',
          inspector: 'Vikas Patil',
        },
        {
          id: 'MB-N2',
          batchId: `${formData.batchId || 'B-205'}-M2`,
          date: '2026-11-10',
          totalInspected: 150,
          defectsFound: 0,
          defectRate: 0,
          status: 'Pending',
          notes: 'Second scheduled validation run.',
          inspector: 'Vikas Patil',
        },
        {
          id: 'MB-N3',
          batchId: `${formData.batchId || 'B-205'}-M3`,
          date: '2026-11-11',
          totalInspected: 150,
          defectsFound: 0,
          defectRate: 0,
          status: 'Pending',
          notes: 'Final batch before closure.',
          inspector: 'Vikas Patil',
        },
      ],
    };

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newId);
    setCurrentView('wizard');

    addAuditEvent(
      'Case Created',
      `New investigation case created for ${newCase.componentName} (Batch ${newCase.batchId}). Defect category: ${newCase.defectCategory}.`,
      newId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Completed'
    );

    notify('Investigation Case Created', `Case ${newId} initialized. Navigating to AI visual analysis.`, 'success');
    return newId;
  };

  const setCaseStep = (stepNumber: number) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === activeCaseId
          ? {
              ...c,
              currentStep: stepNumber,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );
  };

  const simulateAgentVisualAnalysis = (caseId: string, onComplete?: () => void) => {
    setIsAgentRunning(true);
    setAgentActivities([
      { id: '1', label: 'Loading high-resolution surface scan...', status: 'running' },
      { id: '2', label: 'Extracting GD&T optical edge contours...', status: 'pending' },
      { id: '3', label: 'Correlating defect pattern with industrial taxonomy...', status: 'pending' },
      { id: '4', label: 'Evaluating surface roughness Ra / severity classification...', status: 'pending' },
    ]);

    setTimeout(() => {
      setAgentActivities((prev) =>
        prev.map((a, i) =>
          i === 0 ? { ...a, status: 'completed' } : i === 1 ? { ...a, status: 'running' } : a
        )
      );
    }, 700);

    setTimeout(() => {
      setAgentActivities((prev) =>
        prev.map((a, i) =>
          i <= 1 ? { ...a, status: 'completed' } : i === 2 ? { ...a, status: 'running' } : a
        )
      );
    }, 1400);

    setTimeout(() => {
      setAgentActivities((prev) =>
        prev.map((a, i) =>
          i <= 2 ? { ...a, status: 'completed' } : i === 3 ? { ...a, status: 'running' } : a
        )
      );
    }, 2100);

    setTimeout(() => {
      setAgentActivities((prev) => prev.map((a) => ({ ...a, status: 'completed' })));
      setIsAgentRunning(false);
      addAuditEvent(
        'Visual Inspection Analyzed',
        'Visual inspection model classified defect features and generated bounding geometry.',
        caseId,
        'Quality Agent (AI)',
        'ai'
      );
      if (onComplete) onComplete();
    }, 2800);
  };

  const simulateEvidenceRetrieval = (caseId: string, onComplete?: () => void) => {
    setIsAgentRunning(true);
    setAgentActivities([
      { id: '1', label: 'Querying CNC Machine Telemetry & Spindle Accelerometer...', status: 'running' },
      { id: '2', label: 'Retrieving Tool Management & Cycle Wear History...', status: 'pending' },
      { id: '3', label: 'Analyzing Raw Billet Material Mill Test Reports (MTR)...', status: 'pending' },
      { id: '4', label: 'Cross-referencing Historical Defect Precedents & 8D Archives...', status: 'pending' },
      { id: '5', label: 'Consulting SOP-QC-408 Quality Inspection Protocols...', status: 'pending' },
      { id: '6', label: 'Synthesizing Multimodal Evidence Corpus...', status: 'pending' },
    ]);

    const stepDuration = 600;
    for (let step = 0; step < 6; step++) {
      setTimeout(() => {
        setAgentActivities((prev) =>
          prev.map((a, i) =>
            i < step
              ? { ...a, status: 'completed' }
              : i === step
              ? { ...a, status: 'running' }
              : a
          )
        );
      }, (step + 1) * stepDuration);
    }

    setTimeout(() => {
      setAgentActivities((prev) => prev.map((a) => ({ ...a, status: 'completed' })));
      setIsAgentRunning(false);
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                status: 'Evidence Retrieved',
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              }
            : c
        )
      );
      addAuditEvent(
        'Evidence Multi-Source Retrieval',
        'Queried 6 industrial data streams and correlated 7 active records for investigation context.',
        caseId,
        'Quality Agent (AI)',
        'ai'
      );
      notify('Evidence Retrieved', 'Simulated retrieval across 6 industrial data sources completed.', 'success');
      if (onComplete) onComplete();
    }, 7 * stepDuration);
  };

  const toggleEvidenceStatus = (caseId: string, evidenceId: string, status: EvidenceUserStatus) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const updatedEvidence = c.evidenceList.map((e) =>
          e.id === evidenceId ? { ...e, status } : e
        );
        return {
          ...c,
          evidenceList: updatedEvidence,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
      })
    );
    notify('Evidence Tag Updated', `Evidence ${evidenceId} marked as "${status}".`, 'info');
  };

  const approveDiagnosticCheck = (caseId: string, checkId: string) => {
    const targetCase = cases.find((c) => c.id === caseId);
    const check =
      targetCase?.recommendedCheck.id === checkId
        ? targetCase.recommendedCheck
        : targetCase?.alternativeChecks.find((x) => x.id === checkId) || targetCase?.recommendedCheck;

    if (!check) return;

    const newResult: DiagnosticCheckResult = {
      checkId,
      status: 'approved_awaiting_result',
      approvedBy: 'Rajesh Sharma (Lead QE)',
      approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Diagnostic Check Pending',
              activeCheckResult: newResult,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Diagnostic Check Approved',
      `Engineer approved execution of ${check.name} (${check.id}) under SOP ${check.standardOperatingProcedureRef}.`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Approved'
    );

    notify('Diagnostic Check Approved', `${check.name} approved. Awaiting physical measurement result.`, 'success');
  };

  const submitDiagnosticCheckResult = (caseId: string, result: DiagnosticCheckResult) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    // Identify which hypothesis is addressed
    const check =
      targetCase.recommendedCheck.id === result.checkId
        ? targetCase.recommendedCheck
        : targetCase.alternativeChecks.find((x) => x.id === result.checkId) || targetCase.recommendedCheck;

    const targetHypothesisId = check.relatedHypothesisIds[0] || 'hyp-tool';

    // Recalculate hypotheses using pure logic function
    const revisedHypotheses = recalculateHypothesesAfterCheckResult(
      targetCase.hypotheses,
      targetHypothesisId,
      result
    );

    const completedResult: DiagnosticCheckResult = {
      ...result,
      status: 'completed',
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    // Determine primary root cause title
    const primaryHypothesis = revisedHypotheses.find((h) => h.isPrimary) || revisedHypotheses[0];

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              hypotheses: revisedHypotheses,
              activeCheckResult: completedResult,
              previousCheckResults: [...(c.previousCheckResults || []), completedResult],
              status: 'Diagnostic Check Completed',
              currentStep: 6, // Advance to Step 6 updated diagnosis!
              primaryRootCause: primaryHypothesis ? primaryHypothesis.title : 'Fixture Misalignment / Swarf Contamination',
              aiConfidence: primaryHypothesis ? primaryHypothesis.confidence : 84,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Diagnostic Result Submitted',
      `Physical result logged: Outcome "${result.resultOutcome?.toUpperCase()}", Measured Value: ${result.measuredValue || 'N/A'}. Notes: ${result.engineerNotes || 'None'}.`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Completed'
    );

    addAuditEvent(
      'Hypotheses Revised',
      `AI revised diagnostic confidence after empirical measurement. Primary root cause candidate updated to: "${primaryHypothesis?.title}".`,
      caseId,
      'Quality Agent (AI)',
      'ai',
      'Completed'
    );

    notify(
      'Hypotheses Revised by AI',
      `New physical evidence processed. Primary root cause now: ${primaryHypothesis?.title}. Advancing to Step 6.`,
      'info'
    );
  };

  const approveDiagnosis = (caseId: string, notes?: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Diagnosis Approved',
              diagnosisStatus: 'Approved',
              diagnosisNotes: notes || 'Root cause verified by Quality Engineering through physical runout measurement.',
              currentStep: 7, // Advance to Step 7 Corrective Action!
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Diagnosis Approved',
      `Root cause formally approved by Quality Engineer: "${notes || 'Root cause mechanism confirmed via empirical check'}"`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Approved'
    );

    notify('Diagnosis Approved', 'Root cause approved. Corrective action plan drafted in Step 7.', 'success');
  };

  const rejectDiagnosis = (caseId: string, reason: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Diagnosis Rejected',
              diagnosisStatus: 'Rejected',
              diagnosisNotes: reason,
              currentStep: 4, // Return to Step 4 hypotheses for re-investigation
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Diagnosis Rejected',
      `Engineer rejected diagnosis. Reason: "${reason}". Returned case to investigation stage.`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Rejected'
    );

    notify('Diagnosis Rejected', 'Case returned to Step 4 for additional hypothesis formulation.', 'warning');
  };

  const escalateDiagnosis = (caseId: string, reason: string, targetEngineer: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Escalated',
              diagnosisStatus: 'Escalated',
              escalationReason: reason,
              seniorEngineerEscalatedTo: targetEngineer,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Investigation Escalated',
      `Case escalated to ${targetEngineer}. Reason: "${reason}". Human escalation logged.`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Escalated'
    );

    notify('Case Escalated', `Investigation escalated to ${targetEngineer}. Status marked as Escalated.`, 'error');
  };

  const updateCorrectiveActions = (caseId: string, actions: CorrectiveActionItem[]) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              correctiveActions: actions,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );
  };

  const approveCorrectiveActionPlan = (caseId: string, notes?: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Corrective Action Approved',
              correctiveActionPlanApproved: true,
              correctiveActionApprovalNotes: notes || 'Plan approved for line implementation and 3-batch monitoring.',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Corrective Action Plan Approved',
      `CAPA 8D plan approved by Quality Lead. Implementation and 3-batch monitoring authorized. Notes: ${notes || 'Standard protocol'}`,
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Approved'
    );

    notify('CAPA Plan Approved', 'Corrective action plan approved. Monitoring batches are now active.', 'success');
  };

  const updateMonitoringBatch = (
    caseId: string,
    batchId: string,
    patch: Partial<MonitoringBatchItem>
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const updatedBatches = c.monitoringBatches.map((b) => {
          if (b.id !== batchId && b.batchId !== batchId) return b;
          const merged = { ...b, ...patch };
          const defectRate = calculateBatchDefectRate(merged.defectsFound, merged.totalInspected);
          const status: 'Pass' | 'Fail' | 'Pending' =
            merged.status === 'Pending'
              ? 'Pending'
              : merged.defectsFound === 0
              ? 'Pass'
              : 'Fail';
          return {
            ...merged,
            defectRate,
            status,
          };
        });

        const effectiveness = evaluateMonitoringEffectiveness(updatedBatches);
        const allCompleted = updatedBatches.every((b) => b.status !== 'Pending');

        return {
          ...c,
          monitoringBatches: updatedBatches,
          monitoringEffectiveness: effectiveness,
          status: allCompleted && effectiveness === 'Effective' ? 'Verified & Closed' : c.status,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
      })
    );

    addAuditEvent(
      'Monitoring Batch Updated',
      `Inspection findings recorded for batch ${batchId}. Defect rate recalculation logged.`,
      caseId,
      'Vikas Patil (Inspector)',
      'human',
      'Completed'
    );

    notify('Monitoring Batch Updated', `Batch ${batchId} inspection results recorded.`, 'info');
  };

  const closeInvestigation = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Verified & Closed',
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            }
          : c
      )
    );

    addAuditEvent(
      'Investigation Verified & Closed',
      'Post-action verification confirmed zero defect recurrence across 3 monitoring batches. Case closed.',
      caseId,
      'Rajesh Sharma (Lead QE)',
      'human',
      'Closed'
    );

    notify('Investigation Closed', `Case ${caseId} is now verified and closed.`, 'success');
  };

  const loadScenario = (scenarioId: string) => {
    const sc = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;

    if (sc.targetCase.id) {
      const match = cases.find((c) => c.id === sc.targetCase.id);
      if (match) {
        setActiveCaseId(match.id);
        if (sc.targetCase.currentStep) {
          setCases((prev) =>
            prev.map((c) =>
              c.id === match.id
                ? { ...c, currentStep: sc.targetCase.currentStep! }
                : c
            )
          );
        }
      }
    }

    setCurrentView('wizard');
    setScenarioModalOpen(false);

    addAuditEvent(
      'Demo Scenario Loaded',
      `Loaded ${sc.title}: ${sc.description}`,
      sc.targetCase.id || 'DEMO',
      'Quality Engineer (User)',
      'human',
      'Completed'
    );

    notify('Scenario Loaded', `${sc.title} is now loaded.`, 'info');
  };

  const resetDemo = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AUDIT);
    setCases(INITIAL_SEEDED_CASES);
    setAuditTrail(INITIAL_AUDIT_TRAIL);
    setActiveCaseId('MQI-2026-0042');
    setCurrentView('overview');
    notify('Demo State Reset', 'Initial simulated manufacturing cases and logs restored.', 'info');
  };

  return (
    <InvestigationContext.Provider
      value={{
        cases,
        activeCaseId,
        activeCase,
        currentView,
        auditTrail,
        scenarioModalOpen,
        notifications,
        agentActivities,
        isAgentRunning,
        setCurrentView,
        setActiveCaseId,
        navigateToCase,
        openScenarioModal: setScenarioModalOpen,
        dismissNotification,
        notify,
        createNewCase,
        setCaseStep,
        simulateAgentVisualAnalysis,
        simulateEvidenceRetrieval,
        toggleEvidenceStatus,
        approveDiagnosticCheck,
        submitDiagnosticCheckResult,
        approveDiagnosis,
        rejectDiagnosis,
        escalateDiagnosis,
        updateCorrectiveActions,
        approveCorrectiveActionPlan,
        updateMonitoringBatch,
        closeInvestigation,
        loadScenario,
        resetDemo,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
