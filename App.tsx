import React, { useState, useEffect } from 'react';
import { WeddingProfile, AppView, Task } from './types';
import { Onboarding } from './features/Onboarding';
import { Dashboard } from './features/Dashboard';
import { Planner } from './features/Planner';
import { Guests } from './features/Guests';
import { Moodboard } from './features/Moodboard';
import { Sos } from './features/Sos';
import { Navigation } from './components/Navigation';
import { generateWeddingPlan } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [profile, setProfile] = useState<WeddingProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // Check if profile exists in local storage (simulated)
  useEffect(() => {
    // In a real app, load from localStorage or DB
  }, []);

  const handleOnboardingComplete = async (newProfile: WeddingProfile) => {
    setProfile(newProfile);
    setCurrentView(AppView.DASHBOARD);
    
    // Trigger AI Plan generation in background
    setIsLoadingPlan(true);
    const generatedTasks = await generateWeddingPlan(newProfile);
    setTasks(generatedTasks);
    setIsLoadingPlan(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Main Render Switch
  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return profile && (
          <Dashboard 
            profile={profile} 
            tasks={tasks} 
            onViewTasks={() => setCurrentView(AppView.PLANNER)} 
            onViewBudget={() => setCurrentView(AppView.BUDGET)}
          />
        );
      case AppView.PLANNER:
        return <Planner tasks={tasks} toggleTask={toggleTask} isLoading={isLoadingPlan} />;
      case AppView.GUESTS:
        return <Guests />;
      case AppView.BUDGET:
        return <div className="p-6 text-center text-stone-500 mt-20 font-serif text-xl">Módulo Financeiro em Breve</div>;
      case AppView.MOODBOARD:
        return <Moodboard />;
      case AppView.SOS:
        return <Sos />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 bg-stone-50">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      
      {currentView === AppView.ONBOARDING ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl shadow-stone-200 overflow-hidden relative pb-20">
             {/* Simple Header for non-dashboard pages */}
             {currentView !== AppView.DASHBOARD && currentView !== AppView.SOS && (
                <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur z-40 sticky top-0 border-b border-stone-100">
                    <span className="font-serif font-bold text-rose-500 text-lg">BrideFlow</span>
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-xs font-bold text-rose-600">
                        {profile?.names.charAt(0)}
                    </div>
                </div>
             )}
             
             {renderView()}
          </main>
          <div className="max-w-md mx-auto">
             <Navigation currentView={currentView} setView={setCurrentView} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;