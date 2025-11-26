import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const NavItem = ({ view, label, icon, current, onClick }: { view: AppView, label: string, icon: string, current: AppView, onClick: (v: AppView) => void }) => {
  const isActive = current === view;
  return (
    <button
      onClick={() => onClick(view)}
      className="flex flex-col items-center justify-center flex-1 py-2 group"
    >
      <div className={`mb-1 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
        <span className={`material-symbols-outlined text-[26px] ${isActive ? 'text-stone-800 fill-current' : 'text-stone-400 group-hover:text-stone-600'}`}>
            {icon}
        </span>
      </div>
      <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-stone-800 font-bold' : 'text-stone-400'}`}>
        {label}
      </span>
      {isActive && <div className="w-1 h-1 rounded-full bg-stone-800 mt-1 absolute bottom-1"></div>}
    </button>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Mapping existing views to the requested UI structure where possible
  // Home (Dashboard), Cronograma (Planner), Fornecedores (Using Guests as proxy/placeholder), Checklist (Planner Alt), Perfil (SOS/Settings)
  // To maintain functionality, we will map:
  // Home -> Dashboard
  // Agenda -> Planner
  // Convidados -> Guests
  // Inspira -> Moodboard
  // SOS -> SOS
  
  return (
    <nav className="fixed bottom-0 max-w-md w-full bg-white border-t border-stone-100 px-2 py-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50 flex justify-between items-end">
        <NavItem view={AppView.DASHBOARD} label="Home" icon="home" current={currentView} onClick={setView} />
        <NavItem view={AppView.PLANNER} label="Cronograma" icon="calendar_month" current={currentView} onClick={setView} />
        <NavItem view={AppView.GUESTS} label="Convidados" icon="groups" current={currentView} onClick={setView} />
        <NavItem view={AppView.MOODBOARD} label="Inspira" icon="stylus" current={currentView} onClick={setView} />
        <NavItem view={AppView.SOS} label="SOS" icon="emergency" current={currentView} onClick={setView} />
    </nav>
  );
};