import React, { useState, useRef, useEffect } from 'react';
import {
  Factory,
  Search,
  Bell,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const Topbar: React.FC = () => {
  const {
    openScenarioModal,
    resetDemo,
    cases,
    navigateToCase,
    auditTrail,
    setCurrentView,
  } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [facility, setFacility] = useState('Pune Manufacturing Lab — Plant 2');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCases = searchQuery.trim()
    ? cases.filter(
        (c) =>
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.defectCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.machineId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const recentNotifications = auditTrail.slice(0, 5);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 z-10 select-none">
      {/* Left: Facility Indicator & Breadcrumb/Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium whitespace-nowrap">
          <Factory className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900">{facility}</span>
          <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            CNC Cell 03 Active
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Case ID, Batch, Part (e.g. B-204, MQI-2026)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Investigation Cases ({filteredCases.length})
              </div>
              {filteredCases.length === 0 ? (
                <div className="px-3 py-3 text-xs text-slate-500 text-center">
                  No matching cases found for "{searchQuery}"
                </div>
              ) : (
                filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      navigateToCase(c.id);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">{c.id}</span>
                        <span className="text-xs font-medium text-slate-800">{c.componentName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Batch: <span className="font-mono text-slate-700">{c.batchId}</span> •{' '}
                        {c.defectCategory} • {c.severity} Severity
                      </p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {c.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Demo Badges & User Profile */}
      <div className="flex items-center gap-3">
        {/* Prominent Demo Mode Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          DEMO MODE
          <span className="text-[10px] text-amber-700 font-normal hidden sm:inline">
            (Simulated AI Reasoning)
          </span>
        </div>

        {/* Load Demo Scenario Button */}
        <button
          type="button"
          onClick={() => openScenarioModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Load Demo Scenario
        </button>

        {/* Reset Demo Button */}
        <button
          type="button"
          onClick={resetDemo}
          title="Reset to default initial cases & logs"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          aria-label="Reset Demo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {recentNotifications.length}
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Investigation Activity</span>
                <button
                  onClick={() => {
                    setCurrentView('audit');
                    setNotifOpen(false);
                  }}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  Full Audit Trail <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {recentNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors text-left">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{notif.action}</span>
                      <span className="font-mono text-slate-400 text-[10px]">
                        {notif.timestamp.slice(11)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {notif.caseId}
                      </span>
                      <span className="text-[10px] text-slate-400">{notif.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="pl-2 border-l border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            RS
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Rajesh Sharma</div>
            <div className="text-[10px] text-slate-500 font-medium">Quality Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
