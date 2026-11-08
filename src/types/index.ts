export type DefectCategory =
  | 'Surface Scratches'
  | 'Dimensional Deviation'
  | 'Burr Formation'
  | 'Surface Cracks';

export type DefectSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type CaseStatus =
  | 'Under Investigation'
  | 'Evidence Retrieved'
  | 'Diagnostic Check Pending'
  | 'Diagnostic Check Completed'
  | 'Diagnosis Approved'
  | 'Diagnosis Rejected'
  | 'Escalated'
  | 'Corrective Action In Progress'
  | 'Corrective Action Approved'
  | 'Monitoring'
  | 'Verified & Closed';

export interface DefectBBox {
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface DefectImageDetails {
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  timestamp: string;
  resolution: string;
  lightingCondition: string;
  detectedBBoxes: DefectBBox[];
  simulatedVisualConfidence: number;
  visualObservations: string[];
}

export type EvidenceSourceType =
  | 'CNC Machine Log'
  | 'Maintenance Record'
  | 'Material Inspection Report'
  | 'Historical Quality Case'
  | 'Quality Procedure'
  | 'CMM Telemetry';

export type EvidenceUserStatus = 'unreviewed' | 'relevant' | 'inconclusive' | 'dismissed';

export interface EvidenceItem {
  id: string; // e.g. EVD-101
  sourceType: EvidenceSourceType;
  title: string;
  documentName: string;
  batchOrMachineRef: string;
  finding: string;
  fullContent?: string;
  timestamp: string;
  relevanceScore: number; // percentage 0-100
  status: EvidenceUserStatus;
  isConflicting?: boolean;
  metadata?: Record<string, string | number>;
}

export interface Hypothesis {
  id: string;
  title: string;
  confidence: number; // percentage 0-100
  initialConfidence: number;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  missingEvidenceNotes: string;
  aiRationale: string;
  isPrimary?: boolean;
  status: 'active' | 'downgraded' | 'confirmed' | 'ruled_out';
}

export interface DiagnosticCheckOption {
  id: string;
  name: string;
  purpose: string;
  relatedHypothesisIds: string[];
  expectedInformation: string;
  requiredEquipment: string;
  responsibleEngineer: string;
  estimatedDuration: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  priority: 'Immediate' | 'High' | 'Normal';
  standardOperatingProcedureRef: string;
}

export interface DiagnosticCheckResult {
  checkId: string;
  status: 'pending' | 'approved_awaiting_result' | 'completed' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  resultOutcome?: 'supports' | 'contradicts' | 'inconclusive';
  measuredValue?: string;
  toleranceLimit?: string;
  engineerNotes?: string;
  completedAt?: string;
}

export interface CorrectiveActionItem {
  id: string;
  description: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Verified';
  verificationMethod: string;
  notes?: string;
}

export interface MonitoringBatchItem {
  id: string;
  batchId: string;
  date: string;
  totalInspected: number;
  defectsFound: number;
  defectRate: number; // percentage
  status: 'Pass' | 'Fail' | 'Pending';
  notes: string;
  inspector: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string; // e.g., 'Quality Agent (AI)' or 'Rajesh Sharma (Lead QE)'
  actorType: 'ai' | 'human' | 'system';
  caseId: string;
  description: string;
  status?: string;
}

export interface InvestigationCase {
  id: string; // e.g. MQI-2026-0042
  title: string;
  componentName: string;
  componentId: string;
  batchId: string;
  manufacturingLine: string;
  machineId: string;
  inspectionDate: string;
  defectCategory: DefectCategory;
  severity: DefectSeverity;
  description: string;
  inspectorName: string;
  assignedEngineer: string;
  status: CaseStatus;
  currentStep: number; // 1 to 7
  aiConfidence: number;
  createdAt: string;
  updatedAt: string;
  
  // Investigation deep data
  imageDetails: DefectImageDetails;
  evidenceList: EvidenceItem[];
  hypotheses: Hypothesis[];
  recommendedCheck: DiagnosticCheckOption;
  alternativeChecks: DiagnosticCheckOption[];
  activeCheckResult?: DiagnosticCheckResult;
  previousCheckResults?: DiagnosticCheckResult[];
  
  // Diagnosis
  primaryRootCause?: string;
  diagnosisStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  diagnosisNotes?: string;
  escalationReason?: string;
  seniorEngineerEscalatedTo?: string;
  
  // Corrective action
  correctiveActions: CorrectiveActionItem[];
  correctiveActionPlanApproved: boolean;
  correctiveActionApprovalNotes?: string;
  
  // Monitoring
  monitoringBatches: MonitoringBatchItem[];
  monitoringEffectiveness?: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Insufficient Data';
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetCase: Partial<InvestigationCase>;
}
