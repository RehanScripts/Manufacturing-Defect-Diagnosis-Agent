import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Plus,
  Save,
  Check,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { MonitoringBatchItem } from '../../types';

// SPC statistical process control chart data (p-chart)
const SPC_DATA = [
  { batch: 'B-198', defectRate: 3.3, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-199', defectRate: 4.8, ucl: 4.5, lcl: 0.0, target: 1.0 }, // Out of control prior
  { batch: 'B-200', defectRate: 5.2, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-201', defectRate: 4.0, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-202', defectRate: 4.6, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-203', defectRate: 5.8, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-204', defectRate: 4.2, ucl: 4.5, lcl: 0.0, target: 1.0 }, // Defect identified
  { batch: 'B-205 (Post)', defectRate: 0.0, ucl: 4.5, lcl: 0.0, target: 1.0 }, // After CAPA
  { batch: 'B-206 (Post)', defectRate: 0.0, ucl: 4.5, lcl: 0.0, target: 1.0 },
  { batch: 'B-207 (Post)', defectRate: 0.0, ucl: 4.5, lcl: 0.0, target: 1.0 },
];

export const QualityMonitoringPage: React.FC = () => {
  const { cases, activeCase, updateMonitoringBatch, closeInvestigation, notify } = useInvestigation();

  const caseWithBatches =
    cases.find((c) => c.monitoringBatches && c.monitoringBatches.length > 0) || activeCase;

  const [activeCaseId, setActiveCaseId] = useState<string>(caseWithBatches?.id || 'MQI-2026-0042');
  const targetCase = cases.find((c) => c.id === activeCaseId) || activeCase;

  // Selected batch editing state
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState<number>(150);
  const [editDefects, setEditDefects] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'Pass' | 'Fail' | 'Pending'>('Pass');
  const [editNotes, setEditNotes] = useState('100% optical inspection completed. Zero surface scratches.');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!targetCase) return null;

  const batches = targetCase.monitoringBatches || [];
  const effectiveness = targetCase.monitoringEffectiveness || 'Insufficient Data';

  const handleStartEdit = (b: MonitoringBatchItem) => {
    setEditingBatchId(b.id);
    setEditTotal(b.totalInspected);
    setEditDefects(b.defectsFound);
    setEditStatus(b.status);
    setEditNotes(b.notes);
  };

  const handleSaveBatch = (batchId: string) => {
    updateMonitoringBatch(targetCase.id, batchId, {
      totalInspected: editTotal,
      defectsFound: editDefects,
      status: editStatus,
      notes: editNotes,
    });
    setEditingBatchId(null);
  };

  // Quick preset: Mark all 3 batches passed
  const handleMarkAllBatchesPassed = () => {
    batches.forEach((b) => {
      updateMonitoringBatch(targetCase.id, b.id, {
        totalInspected: 150,
        defectsFound: 0,
        status: 'Pass',
        notes: 'Full shift run completed. Zero scratches verified under 1,800 Lux optical raking light.',
      });
    });
    notify('Monitoring Completed', 'All 3 batches marked as Passed (0 defects). Effectiveness verified!', 'success');
  };

  const getEffectivenessBadge = (eff: string) => {
    switch (eff) {
      case 'Effective':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Partially Effective':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Ineffective':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // SVG SPC Chart Coordinates
  const chartW = 750;
  const chartH = 220;
  const padX = 45;
  const padY = 30;
  const maxRate = 7.0; // 0 to 7% defect rate scale

  const spcPoints = SPC_DATA.map((d, i) => {
    const x = padX + (i / (SPC_DATA.length - 1)) * (chartW - padX * 2);
    const y = chartH - padY - (d.defectRate / maxRate) * (chartH - padY * 2);
    return { ...d, x, y };
  });

  const polylineStr = spcPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const uclY = chartH - padY - (4.5 / maxRate) * (chartH - padY * 2);
  const targetY = chartH - padY - (1.0 / maxRate) * (chartH - padY * 2);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Post-Action Quality Monitoring & SPC
            </h1>
            <span className="text-xs font-mono font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Live Closed-Loop Tracking
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track post-corrective action production lots to empirically verify zero defect recurrence before closing cases.
          </p>
        </div>

        {/* Case selector dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Active Case:</label>
          <select
            value={activeCaseId}
            onChange={(e) => setActiveCaseId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.defectCategory} ({c.batchId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistical Process Control (SPC) Chart (Pure SVG) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Defect Rate Statistical Control Chart (p-Chart)
            </h3>
            <p className="text-xs text-slate-500">
              Pre vs Post Corrective Action Run (Upper Control Limit UCL = 4.5% Defect Rate)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Batch Defect Rate (%)
            </span>
            <span className="flex items-center gap-1.5 text-red-500">
              <span className="w-2.5 h-0.5 bg-red-500"></span>
              UCL (4.5%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-0.5 bg-emerald-500"></span>
              Target (1.0%)
            </span>
          </div>
        </div>

        <div className="w-full h-64 flex items-center justify-center">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full select-none overflow-visible">
            {/* Horizontal Grid lines */}
            {[0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0].map((v) => {
              const y = chartH - padY - (v / maxRate) * (chartH - padY * 2);
              return (
                <g key={v}>
                  <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                  <text x={padX - 8} y={y + 3} fill="#94a3b8" fontSize={9} textAnchor="end" fontFamily="monospace">
                    {v.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Target line (1.0%) */}
            <line x1={padX} y1={targetY} x2={chartW - padX} y2={targetY} stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={chartW - padX - 5} y={targetY - 4} fill="#10b981" fontSize={9} textAnchor="end" fontFamily="monospace" fontWeight="bold">
              Target: 1.0%
            </text>

            {/* UCL line (4.5%) */}
            <line x1={padX} y1={uclY} x2={chartW - padX} y2={uclY} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={chartW - padX - 5} y={uclY - 4} fill="#ef4444" fontSize={9} textAnchor="end" fontFamily="monospace" fontWeight="bold">
              UCL: 4.5%
            </text>

            {/* Shaded Area */}
            <polygon
              points={`${padX},${chartH - padY} ${polylineStr} ${chartW - padX},${chartH - padY}`}
              fill="rgba(37, 99, 235, 0.08)"
            />

            {/* Trend Polyline */}
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr}
            />

            {/* Data Points */}
            {spcPoints.map((p, i) => (
              <g
                key={p.batch}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === i ? 6 : p.defectRate > 4.5 ? 5 : 4}
                  fill={p.defectRate > 4.5 ? '#ef4444' : '#2563eb'}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={chartH - 10}
                  fill="#64748b"
                  fontSize={9}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {p.batch}
                </text>

                {hoveredIdx === i && (
                  <g>
                    <rect x={p.x - 35} y={p.y - 28} width={70} height={20} rx={4} fill="#0f172a" />
                    <text x={p.x} y={p.y - 14} fill="#fff" fontSize={10} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      {p.defectRate}% Rate
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Corrective Action Effectiveness Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Verification Protocol (AS9100 Mandate)
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Monitoring Case: 3 Post-Action Production Batches for {targetCase.id}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            "Do not automatically claim the corrective action was effective without empirical monitoring evidence."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Effectiveness Assessment
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono border mt-0.5 ${getEffectivenessBadge(
                effectiveness
              )}`}
            >
              {effectiveness}
            </span>
          </div>

          {effectiveness === 'Effective' && targetCase.status !== 'Verified & Closed' && (
            <button
              type="button"
              onClick={() => closeInvestigation(targetCase.id)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Close Investigation Case
            </button>
          )}

          {effectiveness !== 'Effective' && (
            <button
              type="button"
              onClick={handleMarkAllBatchesPassed}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              Simulate All Passed (0 Defects)
            </button>
          )}
        </div>
      </div>

      {/* 3 Monitoring Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Consecutive Validation Batches (Target: 3 Clean Shifts)
          </h4>
          <span className="text-xs text-slate-500 font-mono">Lot Size: 150 units / batch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-mono">Batch ID</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4">Inspected</th>
                <th className="py-3 px-4">Defects Found</th>
                <th className="py-3 px-4">Defect Rate</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Notes & Observations</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => {
                const isEditing = editingBatchId === b.id;

                if (isEditing) {
                  return (
                    <tr key={b.id} className="bg-blue-50/40">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{b.batchId}</td>
                      <td className="py-3 px-4 text-slate-600">{b.date}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editTotal}
                          onChange={(e) => setEditTotal(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editDefects}
                          onChange={(e) => setEditDefects(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {((editDefects / (editTotal || 1)) * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                        >
                          <option value="Pass">Pass</option>
                          <option value="Fail">Fail</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{b.inspector}</td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveBatch(b.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{b.batchId}</td>
                    <td className="py-3 px-4 text-slate-600">{b.date}</td>
                    <td className="py-3 px-4 font-mono">{b.totalInspected} pcs</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.defectsFound}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {b.defectRate}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono border ${
                          b.status === 'Pass'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'Fail'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{b.inspector}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{b.notes}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(b)}
                        className="px-2.5 py-1 text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                      >
                        Edit Results
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
