import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recalculateHypothesesAfterCheckResult,
  calculateBatchDefectRate,
  evaluateMonitoringEffectiveness,
  generateCaseId,
} from './investigationLogic';
import { Hypothesis, MonitoringBatchItem, DiagnosticCheckResult } from '../types';

test('calculateBatchDefectRate calculates percentage correctly', () => {
  assert.equal(calculateBatchDefectRate(3, 100), 3.0);
  assert.equal(calculateBatchDefectRate(0, 50), 0);
  assert.equal(calculateBatchDefectRate(2, 400), 0.5);
  assert.equal(calculateBatchDefectRate(5, 0), 0);
});

test('generateCaseId formats standard MQI sequence', () => {
  assert.equal(generateCaseId(41), 'MQI-2026-0042');
  assert.equal(generateCaseId(9), 'MQI-2026-0010');
});

test('recalculateHypothesesAfterCheckResult updates confidence on contradiction and supports', () => {
  const initialHypotheses: Hypothesis[] = [
    {
      id: 'hyp-1',
      title: 'Tool Wear',
      confidence: 78,
      initialConfidence: 78,
      supportingEvidenceIds: ['EVD-102'],
      contradictingEvidenceIds: [],
      missingEvidenceNotes: 'Need tool geometry',
      aiRationale: 'Tool replacement was overdue',
      status: 'active',
    },
    {
      id: 'hyp-2',
      title: 'Fixture Misalignment',
      confidence: 51,
      initialConfidence: 51,
      supportingEvidenceIds: ['EVD-101'],
      contradictingEvidenceIds: [],
      missingEvidenceNotes: 'Need dial indicator runout',
      aiRationale: 'Spindle vibration spikes',
      status: 'active',
    },
  ];

  // If Tool Wear is contradicted by normal tool geometry:
  const contradictResult: DiagnosticCheckResult = {
    checkId: 'check-1',
    status: 'completed',
    resultOutcome: 'contradicts',
    measuredValue: 'Flank wear 0.04mm (Limit 0.20mm)',
    engineerNotes: 'Tool insert within fresh manufacturing tolerance.',
  };

  const updated = recalculateHypothesesAfterCheckResult(initialHypotheses, 'hyp-1', contradictResult);
  const toolWear = updated.find((h) => h.id === 'hyp-1');
  const fixture = updated.find((h) => h.id === 'hyp-2');

  assert.ok(toolWear!.confidence < 40, 'Tool wear confidence should drop after contradiction');
  assert.equal(toolWear!.status, 'downgraded');
  assert.ok(fixture!.confidence > 55, 'Fixture misalignment should gain probability');
  assert.equal(fixture!.isPrimary, true, 'Fixture misalignment should become primary');
});

test('evaluateMonitoringEffectiveness detects status based on completed batches', () => {
  const pendingBatches: MonitoringBatchItem[] = [
    {
      id: 'b-1',
      batchId: 'B-205',
      date: '2026-11-05',
      totalInspected: 150,
      defectsFound: 0,
      defectRate: 0,
      status: 'Pass',
      notes: 'Zero defects',
      inspector: 'R. Sharma',
    },
    {
      id: 'b-2',
      batchId: 'B-206',
      date: '2026-11-06',
      totalInspected: 150,
      defectsFound: 0,
      defectRate: 0,
      status: 'Pending',
      notes: 'Awaiting shift',
      inspector: 'R. Sharma',
    },
  ];
  assert.equal(evaluateMonitoringEffectiveness(pendingBatches), 'Insufficient Data');

  const allPassedBatches: MonitoringBatchItem[] = [
    {
      id: 'b-1',
      batchId: 'B-205',
      date: '2026-11-05',
      totalInspected: 150,
      defectsFound: 0,
      defectRate: 0,
      status: 'Pass',
      notes: 'Clean run',
      inspector: 'R. Sharma',
    },
    {
      id: 'b-2',
      batchId: 'B-206',
      date: '2026-11-06',
      totalInspected: 150,
      defectsFound: 0,
      defectRate: 0,
      status: 'Pass',
      notes: 'No scratches observed',
      inspector: 'R. Sharma',
    },
    {
      id: 'b-3',
      batchId: 'B-207',
      date: '2026-11-07',
      totalInspected: 150,
      defectsFound: 0,
      defectRate: 0,
      status: 'Pass',
      notes: 'Flawless surface finish',
      inspector: 'R. Sharma',
    },
  ];
  assert.equal(evaluateMonitoringEffectiveness(allPassedBatches), 'Effective');
});
