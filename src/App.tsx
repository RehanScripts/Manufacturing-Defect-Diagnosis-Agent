import React from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { InvestigationWizard } from './components/investigation/InvestigationWizard';
import { CasesPage } from './components/cases/CasesPage';
import { EvidenceRepository } from './components/evidence/EvidenceRepository';
import { QualityMonitoringPage } from './components/monitoring/QualityMonitoringPage';
import { KnowledgeBasePage } from './components/knowledge/KnowledgeBasePage';
import { AuditTrailPage } from './components/audit/AuditTrailPage';
import { ScenarioModal } from './components/common/ScenarioModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { currentView } = useInvestigation();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'cases':
        return <CasesPage />;
      case 'wizard':
        return <InvestigationWizard />;
      case 'evidence':
        return <EvidenceRepository />;
      case 'capa':
        // Direct jump to wizard at Step 7 for corrective actions
        return <InvestigationWizard />;
      case 'monitoring':
        return <QualityMonitoringPage />;
      case 'knowledge':
        return <KnowledgeBasePage />;
      case 'audit':
        return <AuditTrailPage />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <Topbar />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ScenarioModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <InvestigationProvider>
      <AppContent />
    </InvestigationProvider>
  );
}
