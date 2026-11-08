import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  FileArchive,
  CheckSquare,
  Activity,
  BookOpen,
  History,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, cases, auditTrail } = useInvestigation();

  const activeCasesCount = cases.filter(
    (c) => c.status !== 'Verified & Closed' && c.status !== 'Diagnosis Rejected'
  ).length;

  const pendingApprovalsCount = cases.filter(
    (c) =>
      c.status === 'Diagnostic Check Pending' ||
      (c.currentStep === 6 && c.diagnosisStatus === undefined) ||
      !c.correctiveActionPlanApproved
  ).length;

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'cases',
      label: 'Investigation Cases',
      icon: FolderGit2,
      badge: activeCasesCount > 0 ? `${activeCasesCount}` : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'wizard',
      label: 'New Investigation',
      icon: PlusCircle,
      badge: 'Step 1-7',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'evidence',
      label: 'Evidence Repository',
      icon: FileArchive,
      badge: '7 Docs',
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'capa',
      label: 'Corrective Actions',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Action` : null,
      badgeColor: 'bg-amber-500 text-slate-900 font-bold',
    },
    {
      id: 'monitoring',
      label: 'Quality Monitoring',
      icon: Activity,
      badge: 'Live SPC',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: BookOpen,
      badge: 'Expert ISO',
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: History,
      badge: `${auditTrail.length}`,
      badgeColor: 'bg-slate-700 text-slate-300',
    },
  ];

  return (
    <aside
      className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 text-slate-200 select-none z-20"
      aria-label="Main Navigation"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Manufacturing Quality AI
              </h1>
              <p className="text-[11px] text-blue-400 font-medium">
                Intelligent Defect Investigation
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operations & Investigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Industrial Plant Telemetry Status Widget */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Plant Telemetry
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CONNECTED
          </span>
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Line 3 CNC 5-Axis:</span>
            <span className="text-slate-300">Live (6.2k RPM)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Zeiss CMM Laser:</span>
            <span className="text-slate-300">Calibrated (0.8µm)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Inspection Standard:</span>
            <span className="text-slate-300">AS9100 / ISO 9001</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Autonomous Lock: Active</span>
        </div>
      </div>
    </aside>
  );
};
