import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNavBar } from './components/BottomNavBar';
import { RazorpayModal } from './components/RazorpayModal';
import { AuthModal } from './components/AuthModal';
import { NotesModal } from './components/NotesModal';
import { StudyReminderModal } from './components/StudyReminderModal';
import { CertificateModal } from './components/CertificateModal';
import { ShareModal } from './components/ShareModal';
import { SocialSidePanel } from './components/SocialSidePanel';

// Views
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { FreeMockTestView } from './views/FreeMockTestView';
import { TestDetailView } from './views/TestDetailView';
import { CbtExamView } from './views/CbtExamView';
import { ResultAnalyticsView } from './views/ResultAnalyticsView';
import { LeaderboardView } from './views/LeaderboardView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainAppContent: React.FC = () => {
  const { activeView, toastMessage } = useApp();

  // If in CBT exam mode, render the full-screen distraction-free CBT console
  if (activeView === 'cbtExam') {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
        <CbtExamView />
        <CertificateModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
      
      {/* 1. Breaking Vacancy Ticker */}
      <AnnouncementBar />

      {/* 2. Cultural Header & Navigation */}
      <Header />

      {/* 3. Main Views Router */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeView === 'home' && <HomeView />}
        {activeView === 'freeMockTest' && <FreeMockTestView />}
        {activeView === 'catalog' && <CatalogView />}
        {activeView === 'testDetail' && <TestDetailView />}
        {activeView === 'resultAnalytics' && <ResultAnalyticsView />}
        {activeView === 'leaderboard' && <LeaderboardView />}
        {activeView === 'notes' && <CatalogView />}
        {(activeView === 'dashboard' || activeView === 'studentDashboard') && <StudentDashboardView />}
        {activeView === 'admin' && <AdminDashboardView />}
      </main>

      {/* 4. Global Modals & Live Social Side Panel */}
      <RazorpayModal />
      <AuthModal />
      <NotesModal />
      <StudyReminderModal />
      <CertificateModal />
      <ShareModal />
      <SocialSidePanel />

      {/* 5. Mobile Dynamic Bottom App Bar */}
      <BottomNavBar />

      {/* 6. Global Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-stone-900 text-stone-100 border border-amber-500/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-xs font-bold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* 6. Cultural Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
