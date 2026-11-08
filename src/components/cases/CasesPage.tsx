import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { DefectCategory, DefectSeverity, CaseStatus } from '../../types';

export const CasesPage: React.FC = () => {
  const { cases, navigateToCase, setCurrentView, openScenarioModal } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'date' | 'confidence'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredCases = cases
    .filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedEngineer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = filterCategory === 'all' || c.defectCategory === filterCategory;
      const matchesSev = filterSeverity === 'all' || c.severity === filterSeverity;
      const matchesStat = filterStatus === 'all' || c.status === filterStatus;

      return matchesSearch && matchesCat && matchesSev && matchesStat;
    })
    .sort((a, b) => {
      if (sortBy === 'id') {
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      if (sortBy === 'confidence') {
        return sortAsc ? a.aiConfidence - b.aiConfidence : b.aiConfidence - a.aiConfidence;
      }
      return sortAsc
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt);
    });

  const getSeverityBadge = (sev: DefectSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Investigation Cases Directory
            </h1>
            <span className="text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {cases.length} Total Cases
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Searchable log of active, approved, escalated, and closed manufacturing quality investigations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openScenarioModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Load Preset Scenario
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID, component, batch, engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Defect Classes</option>
              <option value="Surface Scratches">Surface Scratches</option>
              <option value="Dimensional Deviation">Dimensional Deviation</option>
              <option value="Burr Formation">Burr Formation</option>
              <option value="Surface Cracks">Surface Cracks</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Diagnostic Check Pending">Diagnostic Check Pending</option>
              <option value="Diagnosis Approved">Diagnosis Approved</option>
              <option value="Corrective Action In Progress">CAPA In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Verified & Closed">Verified & Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredCases.length}</strong> matching cases
          </span>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Sort by:</span>
            <button
              type="button"
              onClick={() => {
                setSortBy('date');
                setSortAsc(!sortAsc);
              }}
              className={`hover:text-blue-600 font-medium ${
                sortBy === 'date' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Date {sortBy === 'date' ? (sortAsc ? '↑' : '↓') : ''}
            </button>
            <button
              type="button"
              onClick={() => {
                setSortBy('confidence');
                setSortAsc(!sortAsc);
              }}
              className={`hover:text-blue-600 font-medium ${
                sortBy === 'confidence' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              AI Conf {sortBy === 'confidence' ? (sortAsc ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Cases Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-mono">Case ID</th>
                <th className="py-3 px-4">Component & Part ID</th>
                <th className="py-3 px-4">Defect Category</th>
                <th className="py-3 px-4 font-mono">Batch</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Suspected Root Cause</th>
                <th className="py-3 px-4">AI Conf</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Engineer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {c.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{c.componentName}</div>
                    <div className="font-mono text-[11px] text-slate-400">{c.componentId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{c.defectCategory}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{c.batchId}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityBadge(
                        c.severity
                      )}`}
                    >
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[180px] truncate text-slate-600">
                    {c.primaryRootCause || 'Under Diagnostic Triage'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {c.aiConfidence}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{c.assignedEngineer.split(' ')[0]}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigateToCase(c.id, c.currentStep)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                    >
                      Open Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
