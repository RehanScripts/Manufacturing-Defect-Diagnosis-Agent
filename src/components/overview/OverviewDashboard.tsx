import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FileSearch,
  Filter,
  Plus,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DefectSeverity, CaseStatus } from '../../types';

// Mock chart data for trends & breakdowns
const DEFECT_TREND_DATA = [
  { day: 'Nov 02', inspections: 180, defects: 14, targetLimit: 12 },
  { day: 'Nov 03', inspections: 210, defects: 16, targetLimit: 12 },
  { day: 'Nov 04', inspections: 195, defects: 11, targetLimit: 12 },
  { day: 'Nov 05', inspections: 220, defects: 18, targetLimit: 12 },
  { day: 'Nov 06', inspections: 205, defects: 15, targetLimit: 12 },
  { day: 'Nov 07', inspections: 230, defects: 8, targetLimit: 12 },
  { day: 'Nov 08', inspections: 160, defects: 4, targetLimit: 12 },
];

const DEFECT_CATEGORY_DATA = [
  { name: 'Surface Scratches', value: 38, pct: '44%', color: '#3b82f6' },
  { name: 'Dimensional Dev', value: 24, pct: '28%', color: '#f59e0b' },
  { name: 'Burr Formation', value: 16, pct: '19%', color: '#8b5cf6' },
  { name: 'Surface Cracks', value: 8, pct: '9%', color: '#ef4444' },
];

const DEFECT_BATCH_DATA = [
  { batch: 'B-198', defects: 5, passed: 145 },
  { batch: 'B-199', defects: 9, passed: 141 },
  { batch: 'B-200', defects: 14, passed: 136 },
  { batch: 'B-201', defects: 12, passed: 138 },
  { batch: 'B-202', defects: 16, passed: 134 },
  { batch: 'B-203', defects: 18, passed: 132 },
  { batch: 'B-204', defects: 12, passed: 138 },
];

const ROOT_CAUSE_DATA = [
  { cause: 'Fixture Misalignment / Swarf', count: 14 },
  { cause: 'Tool Wear Land Exceeded', count: 11 },
  { cause: 'Feed Rate Chatter Overload', count: 7 },
  { cause: 'Material Hardness Inclusion', count: 4 },
  { cause: 'Coolant Emulsion Flow Drop', count: 2 },
];

export const OverviewDashboard: React.FC = () => {
  const { cases, navigateToCase, setCurrentView, auditTrail, openScenarioModal } = useInvestigation();
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);

  const getSeverityBadge = (sev: DefectSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'Verified & Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Corrective Action Approved':
      case 'Corrective Action In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Diagnosis Approved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Escalated':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Diagnostic Check Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // SVG Trend Chart Dimensions
  const trendW = 540;
  const trendH = 220;
  const padX = 40;
  const padY = 30;
  const maxDefects = 20;

  const points = DEFECT_TREND_DATA.map((d, i) => {
    const x = padX + (i / (DEFECT_TREND_DATA.length - 1)) * (trendW - padX * 2);
    const y = trendH - padY - (d.defects / maxDefects) * (trendH - padY * 2);
    return { ...d, x, y };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const limitY = trendH - padY - (12 / maxDefects) * (trendH - padY * 2);

  // SVG Bar Chart Dimensions
  const barW = 500;
  const barH = 200;
  const barPad = 35;
  const maxBatchDefects = 20;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Manufacturing Quality Overview
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
              AS9100 / ISO 9001
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor defects, investigations, evidence, and corrective actions across production.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openScenarioModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Scenarios
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('wizard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Investigation
          </button>
        </div>
      </div>

      {/* 6 Key KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Inspections</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">1,248</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Defects Detected</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">86</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>6.8% defect rate</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Cases</span>
            <FileSearch className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2 font-mono">12</div>
          <div className="text-[11px] text-slate-500 mt-1">4 in diagnostic check</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">4</div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Requires QE sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Root Causes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">38</div>
          <div className="text-[11px] text-emerald-600 mt-1">100% human verified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Avg Investigation</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">3.2h</div>
          <div className="text-[11px] text-emerald-600 mt-1">-58% with AI Agent</div>
        </div>
      </div>

      {/* Industrial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Defect Trends Over Time (SVG Vector Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Defect Frequency & Inspection Throughput
              </h3>
              <p className="text-xs text-slate-500">
                Daily defects detected vs quality alert threshold (Max 12 defects/shift)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Defects Found
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-0.5 bg-red-500"></span>
                Threshold (12)
              </span>
            </div>
          </div>

          <div className="relative w-full h-64 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${trendW} ${trendH}`}
              className="w-full h-full overflow-visible select-none"
            >
              {/* Horizontal gridlines */}
              {[0, 5, 10, 15, 20].map((val) => {
                const y = trendH - padY - (val / maxDefects) * (trendH - padY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={trendW - padX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth={1}
                    />
                    <text
                      x={padX - 8}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize={10}
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Threshold line at 12 defects */}
              <line
                x1={padX}
                y1={limitY}
                x2={trendW - padX}
                y2={limitY}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={trendW - padX - 5}
                y={limitY - 4}
                fill="#ef4444"
                fontSize={9}
                textAnchor="end"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                UCL Alert: 12
              </text>

              {/* Area gradient under line */}
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`${padX},${trendH - padY} ${polylineStr} ${trendW - padX},${trendH - padY}`}
                fill="url(#trendGradient)"
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

              {/* Interactive Data points */}
              {points.map((p, i) => (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredTrendIdx(i)}
                  onMouseLeave={() => setHoveredTrendIdx(null)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredTrendIdx === i ? 6 : 4}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  {/* X-axis labels */}
                  <text
                    x={p.x}
                    y={trendH - 10}
                    fill="#64748b"
                    fontSize={10}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {p.day}
                  </text>

                  {/* Value tag on hover */}
                  {hoveredTrendIdx === i && (
                    <g>
                      <rect
                        x={p.x - 30}
                        y={p.y - 30}
                        width={60}
                        height={20}
                        rx={4}
                        fill="#0f172a"
                      />
                      <text
                        x={p.x}
                        y={p.y - 16}
                        fill="#ffffff"
                        fontSize={10}
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {p.defects} defects
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Defect Distribution by Category (Crisp Donut Graphic) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Defects by Category</h3>
            <p className="text-xs text-slate-500">Breakdown of 86 detected anomalies</p>
          </div>

          <div className="flex items-center justify-center my-auto py-2">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* 4 segments: 44%, 28%, 19%, 9% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="105 134"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray="67 172"
                  strokeDashoffset="-105"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="14"
                  strokeDasharray="45 194"
                  strokeDashoffset="-172"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="14"
                  strokeDasharray="22 217"
                  strokeDashoffset="-217"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-slate-900 leading-none">86</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Defects</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {DEFECT_CATEGORY_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-semibold text-slate-900 ml-auto font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Defects by Batch & Root Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Defects by Production Batch (SVG Bar Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Defects by Production Batch</h3>
              <p className="text-xs text-slate-500">Recent 150-piece production lots (B-198 to B-204)</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">CNC Line 3</span>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            <svg viewBox={`0 0 ${barW} ${barH}`} className="w-full h-full select-none">
              {/* Horizontal guide lines */}
              {[0, 5, 10, 15, 20].map((v) => {
                const y = barH - barPad - (v / maxBatchDefects) * (barH - barPad * 2);
                return (
                  <g key={v}>
                    <line x1={barPad} y1={y} x2={barW - 15} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                    <text x={barPad - 6} y={y + 3} fill="#94a3b8" fontSize={9} textAnchor="end" fontFamily="monospace">
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {DEFECT_BATCH_DATA.map((b, i) => {
                const colWidth = (barW - barPad * 2) / DEFECT_BATCH_DATA.length;
                const bw = 28;
                const bx = barPad + i * colWidth + (colWidth - bw) / 2;
                const bh = (b.defects / maxBatchDefects) * (barH - barPad * 2);
                const by = barH - barPad - bh;

                return (
                  <g key={b.batch}>
                    <rect
                      x={bx}
                      y={by}
                      width={bw}
                      height={bh}
                      rx={3}
                      fill="#3b82f6"
                      className="hover:fill-blue-700 transition-colors cursor-pointer"
                    />
                    <text
                      x={bx + bw / 2}
                      y={by - 4}
                      fill="#1e293b"
                      fontSize={9}
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {b.defects}
                    </text>
                    <text
                      x={bx + bw / 2}
                      y={barH - 12}
                      fill="#64748b"
                      fontSize={10}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {b.batch}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Verified Root Cause Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Root Cause Distribution</h3>
              <p className="text-xs text-slate-500">Historical verified mechanisms across 38 closed cases</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              38 Verified
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {ROOT_CAUSE_DATA.map((rc) => {
              const pct = Math.round((rc.count / 38) * 100);
              return (
                <div key={rc.cause} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{rc.cause}</span>
                    <span className="text-slate-500 font-mono">
                      {rc.count} cases ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-100">
            Source: AS9100 Verified Historical 8D Database (Pune Plant 2)
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Investigations Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Investigations Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Quality Investigations</h3>
              <p className="text-xs text-slate-500">Click any case to enter the 7-step investigation workspace</p>
            </div>
            <button
              onClick={() => setCurrentView('cases')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All Cases <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-mono">Case ID</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3">Defect Category</th>
                  <th className="py-2.5 px-3 font-mono">Batch</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">AI Conf</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {c.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 max-w-[140px] truncate">
                      {c.componentName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{c.defectCategory}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{c.batchId}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityBadge(
                          c.severity
                        )}`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {c.aiConfidence}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigateToCase(c.id, c.currentStep)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                      >
                        View Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Panel (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Quality Activity</h3>
            <button
              onClick={() => setCurrentView('audit')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Audit Trail
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[380px] divide-y divide-slate-100 space-y-3">
            {auditTrail.slice(0, 6).map((event) => (
              <div key={event.id} className="pt-3 first:pt-0 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{event.action}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {event.timestamp.slice(11, 16)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{event.description}</p>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span className="font-mono text-blue-600">{event.caseId}</span>
                  <span>{event.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
