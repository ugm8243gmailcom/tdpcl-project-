import { useState } from 'react';
import { TopBar } from './components/Navigation/TopBar';
import { Sidebar } from './components/Navigation/Sidebar';
import { ConsumerModal } from './components/Common/ConsumerModal';
import { DisclaimerBanner } from './components/Common/DisclaimerBanner';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { ConsumerAnalysisPage } from './pages/ConsumerAnalysisPage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { AreaIntelligencePage } from './pages/AreaIntelligencePage';
import { ConsumptionAnalyticsPage } from './pages/ConsumptionAnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';

import { ALL_CONSUMERS, MOCK_AREAS } from './data/mockData';
import type { Consumer, AreaSummary } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLandingView, setIsLandingView] = useState<boolean>(false);

  // Selected state for dedicated deep-dive pages
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer>(
    ALL_CONSUMERS.find((c) => c.id === 'C-10482') || ALL_CONSUMERS[0]
  );
  const [selectedArea, setSelectedArea] = useState<AreaSummary>(MOCK_AREAS[0]);

  // Consumer modal state for quick popup inspection from any page
  const [modalConsumer, setModalConsumer] = useState<Consumer | null>(null);

  const highRiskCount = ALL_CONSUMERS.filter((c) => c.riskLevel === 'HIGH').length;

  const handleSelectConsumer = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
    setModalConsumer(consumer);
  };

  const handleSelectArea = (area: AreaSummary) => {
    setSelectedArea(area);
    setIsLandingView(false);
    setActiveTab('area-intelligence');
  };

  const handleNavigateToFullConsumerPage = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
    setIsLandingView(false);
    setActiveTab('consumer-analysis');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Bar Navigation */}
      <TopBar
        setActiveTab={setActiveTab}
        onSelectConsumer={handleSelectConsumer}
        isLandingView={isLandingView}
        setIsLandingView={setIsLandingView}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLandingView={isLandingView}
          setIsLandingView={setIsLandingView}
          highRiskCount={highRiskCount}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {isLandingView ? (
            <LandingPage
              onLaunchDemo={() => {
                setIsLandingView(false);
                setActiveTab('overview');
              }}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewPage
                  onSelectConsumer={handleSelectConsumer}
                  onSelectArea={handleSelectArea}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'consumer-analysis' && (
                <ConsumerAnalysisPage
                  selectedConsumer={selectedConsumer}
                  onSelectConsumer={(c) => setSelectedConsumer(c)}
                />
              )}

              {activeTab === 'anomaly-detection' && (
                <AnomalyDetectionPage onSelectConsumer={handleSelectConsumer} />
              )}

              {activeTab === 'area-intelligence' && (
                <AreaIntelligencePage
                  selectedArea={selectedArea}
                  onSelectArea={setSelectedArea}
                  onSelectConsumer={handleSelectConsumer}
                />
              )}

              {activeTab === 'consumption-analytics' && <ConsumptionAnalyticsPage />}

              {activeTab === 'alerts' && (
                <AlertsPage onSelectConsumer={handleSelectConsumer} />
              )}

              {activeTab === 'model-insights' && <ModelInsightsPage />}
            </>
          )}

          {/* Academic Footer Disclaimer */}
          <DisclaimerBanner variant="footer" />
        </main>
      </div>

      {/* Quick Consumer Investigation Popup Modal */}
      <ConsumerModal
        consumer={modalConsumer}
        onClose={() => setModalConsumer(null)}
        onNavigateToFullPage={handleNavigateToFullConsumerPage}
      />

    </div>
  );
}

export default App;
