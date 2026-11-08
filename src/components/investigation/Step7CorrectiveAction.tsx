import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  Activity,
  Sparkles,
  Edit2,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CorrectiveActionItem } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const Step7CorrectiveAction: React.FC = () => {
  const {
    activeCase,
    updateCorrectiveActions,
    approveCorrectiveActionPlan,
    setCurrentView,
    notify,
  } = useInvestigation();

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState(
    'CAPA 8D plan approved for execution on CNC Line 3. Tool interlock and fixture air-blast upgrades scheduled.'
  );

  // New action modal or form state
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newOwner, setNewOwner] = useState('Sunil Kadam (CNC Maintenance)');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newDueDate, setNewDueDate] = useState('2026-11-12');
  const [newVerification, setNewVerification] = useState('First piece CMM inspection runout < 0.008mm.');

  if (!activeCase) return null;

  const { correctiveActions, correctiveActionPlanApproved, primaryRootCause } = activeCase;

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newItem: CorrectiveActionItem = {
      id: `CAPA-${Date.now().toString().slice(-4)}`,
      description: newDesc,
      owner: newOwner,
      priority: newPriority,
      dueDate: newDueDate,
      status: 'Not Started',
      verificationMethod: newVerification,
    };

    updateCorrectiveActions(activeCase.id, [...correctiveActions, newItem]);
    setIsAddingAction(false);
    setNewDesc('');
    notify('Corrective Action Added', 'New CAPA item appended to plan.', 'info');
  };

  const handleRemoveAction = (id: string) => {
    updateCorrectiveActions(
      activeCase.id,
      correctiveActions.filter((a) => a.id !== id)
    );
    notify('Action Removed', 'Item removed from plan.', 'info');
  };

  const handleStatusChange = (
    id: string,
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Verified'
  ) => {
    updateCorrectiveActions(
      activeCase.id,
      correctiveActions.map((a) => (a.id === id ? { ...a, status } : a))
    );
    notify('Status Updated', `Action status set to "${status}".`, 'info');
  };

  const handleApprovePlan = () => {
    approveCorrectiveActionPlan(activeCase.id, approvalNotes);
    setApprovalModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Step 7 — Corrective & Preventive Action (CAPA 8D)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Confirmed Root Cause: <span className="font-semibold text-slate-800">{primaryRootCause || 'Fixture Misalignment'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!correctiveActionPlanApproved ? (
              <button
                type="button"
                onClick={() => setApprovalModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Corrective Plan
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                CAPA Plan Approved & Active
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs text-slate-600">
          <span>
            Human Authorization: All process or machine parameter modifications require quality engineer review.
          </span>
          <button
            type="button"
            onClick={() => setIsAddingAction(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Action Item
          </button>
        </div>
      </div>

      {/* Add Action Drawer / Card */}
      {isAddingAction && (
        <form
          onSubmit={handleAddAction}
          className="bg-slate-50 rounded-xl border border-blue-200 p-5 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Draft New Corrective Action Item
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingAction(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Action Description *
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Realign 5-axis fixture nest and verify pneumatic torque..."
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Owner *</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Verification Method & Acceptance Criteria
              </label>
              <input
                type="text"
                value={newVerification}
                onChange={(e) => setNewVerification(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAction(false)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
              >
                Save Action Item
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Corrective Actions Table / Cards */}
      <div className="space-y-3">
        {correctiveActions.map((action, index) => (
          <div
            key={action.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ACTION #{index + 1} • {action.id}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    action.priority === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {action.priority} Priority
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Due: {action.dueDate}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{action.description}</h4>

              <div className="flex items-center gap-4 text-slate-500 text-[11px] flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Owner: <strong className="text-slate-700 font-semibold">{action.owner}</strong>
                </span>
                <span>•</span>
                <span>
                  Verification:{' '}
                  <span className="text-slate-700 font-medium">{action.verificationMethod}</span>
                </span>
              </div>
            </div>

            {/* Status Selector & Controls */}
            <div className="flex items-center gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">
                  Progress Status
                </span>
                <select
                  value={action.status}
                  onChange={(e) => handleStatusChange(action.id, e.target.value as any)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border cursor-pointer ${
                    action.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : action.status === 'Completed'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : action.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveAction(action.id)}
                className="p-2 text-slate-400 hover:text-red-600 rounded transition-colors"
                title="Remove action"
                aria-label="Remove action"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal for CAPA Approval */}
      <ConfirmationModal
        isOpen={approvalModalOpen}
        title="Approve Corrective Action Plan?"
        subtitle={`Case: ${activeCase.id} • ${correctiveActions.length} Actions Mandated`}
        message="Authorizing this plan dispatches maintenance orders and enables mandatory 3-batch continuous quality monitoring. Are all owners and verification methods verified?"
        confirmLabel="Authorize CAPA Execution"
        variant="success"
        onConfirm={handleApprovePlan}
        onCancel={() => setApprovalModalOpen(false)}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Quality Lead Authorization Notes
          </label>
          <textarea
            rows={2}
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
          />
        </div>
      </ConfirmationModal>

      {/* Bottom Nav Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView('cases')}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          View All Cases
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('monitoring')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Proceed to Quality Monitoring (3 Batches)
          <Activity className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
