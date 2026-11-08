import { Hypothesis, MonitoringBatchItem, DiagnosticCheckResult } from '../types';

/**
 * Recalculates hypothesis confidence and primary root cause candidate
 * when an engineer submits diagnostic check findings.
 */
export function recalculateHypothesesAfterCheckResult(
  hypotheses: Hypothesis[],
  targetHypothesisId: string,
  result: DiagnosticCheckResult
): Hypothesis[] {
  if (!result.resultOutcome) {
    return hypotheses;
  }

  return hypotheses.map((h) => {
    let newConfidence = h.confidence;
    let newStatus = h.status;

    if (h.id === targetHypothesisId) {
      if (result.resultOutcome === 'supports') {
        // Boost target hypothesis
        newConfidence = Math.min(96, Math.max(75, h.confidence + 26));
        newStatus = 'active';
      } else if (result.resultOutcome === 'contradicts') {
        // Significantly downgrade target hypothesis
        newConfidence = Math.max(8, h.confidence - 45);
        newStatus = 'downgraded';
      } else {
        // Inconclusive slightly dampens confidence
        newConfidence = Math.max(15, h.confidence - 8);
      }
    } else {
      // Competing hypotheses adjustments
      if (result.resultOutcome === 'contradicts') {
        // Plausibility redistributes to alternative hypotheses
        newConfidence = Math.min(92, Math.round(h.confidence * 1.35 + 10));
      } else if (result.resultOutcome === 'supports') {
        // Competing hypotheses lose ground
        newConfidence = Math.max(5, Math.round(h.confidence * 0.55));
      }
    }

    return {
      ...h,
      confidence: newConfidence,
      status: newStatus,
    };
  }).map((h, _, arr) => {
    // Determine highest confidence active hypothesis as primary candidate
    const maxConf = Math.max(...arr.map((x) => x.confidence));
    return {
      ...h,
      isPrimary: h.confidence === maxConf && h.status !== 'ruled_out',
    };
  });
}

/**
 * Computes defect rate percentage safely
 */
export function calculateBatchDefectRate(defectsFound: number, totalInspected: number): number {
  if (!totalInspected || totalInspected <= 0) return 0;
  const rate = (defectsFound / totalInspected) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Evaluates whether a corrective action plan is Effective, Partially Effective, Ineffective, or Insufficient Data
 * based on post-action monitoring batches.
 */
export function evaluateMonitoringEffectiveness(
  batches: MonitoringBatchItem[]
): 'Effective' | 'Partially Effective' | 'Ineffective' | 'Insufficient Data' {
  if (!batches || batches.length === 0) return 'Insufficient Data';

  const completedBatches = batches.filter((b) => b.status !== 'Pending');
  if (completedBatches.length < batches.length) {
    return 'Insufficient Data';
  }

  const failedBatches = completedBatches.filter((b) => b.status === 'Fail' || b.defectsFound > 0);
  const totalDefects = completedBatches.reduce((acc, b) => acc + b.defectsFound, 0);
  const totalInspected = completedBatches.reduce((acc, b) => acc + b.totalInspected, 0);
  const overallRate = totalInspected > 0 ? (totalDefects / totalInspected) * 100 : 0;

  if (failedBatches.length === 0 && totalDefects === 0) {
    return 'Effective';
  }

  if (failedBatches.length === 1 && overallRate <= 0.8) {
    return 'Partially Effective';
  }

  return 'Ineffective';
}

/**
 * Generates an industrial case ID formatted e.g. MQI-2026-0043
 */
export function generateCaseId(existingCount: number): string {
  const year = 2026;
  const sequence = String(existingCount + 1).padStart(4, '0');
  return `MQI-${year}-${sequence}`;
}
