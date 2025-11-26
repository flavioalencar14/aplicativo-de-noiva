import React from 'react';
import { WeddingProfile, Task } from '../types';

interface Props {
  profile: WeddingProfile;
  tasks: Task[];
  onViewTasks: () => void;
  onViewBudget: () => void;
}

export const Dashboard: React.FC<Props> = ({ profile, tasks, onViewTasks, onViewBudget }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length || 1; // avoid division by zero
  const progress = Math.round((completedTasks / totalTasks) * 100);
  
  const daysLeft = Math.ceil((new Date(profile.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const firstName = profile.names.split(' ')[0] || 'Noiva';

  // Mock data for UI fidelity as per prompt
  const upcomingEvents = [
    { title: 'Prova do vestido', date: '12/11', image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=200' },
    { title: 'Reunião cerimonial', date: '14/11', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200' },
    { title: 'Degustação', date: '20/11', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=200' },
  ];

  const weeklyTasks = tasks.filter(t => !t.completed).slice(0, 3);
  // Fallback if no tasks
  const displayTasks = weeklyTasks.length > 0 ? weeklyTasks : [
      { id: 'mock1', title: 'Escolher modelo de convite', completed: false },
      { id: 'mock2', title: 'Enviar briefing para decoradora', completed: false },
      { id: 'mock3', title: 'Confirmar orçamento do buffet', completed: false },
  ];

  return (
    <div className="bg-white min-h-screen pb-32 font-sans">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold tracking-widest text-stone-800">BRIDEFLOW</h1>
        <div className="flex items-center gap-3">
          <button className="text-stone-600 hover:text-rose-500 transition-colors" title="Convites Digitais">
             <span className="material-symbols-outlined">mail</span>
          </button>
          <div className="relative">
            <span className="material-symbols-outlined text-stone-600">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-200 border border-rose-100 flex items-center justify-center overflow-hidden">
             <span className="font-serif text-rose-800 font-bold text-xs">{firstName.charAt(0)}</span>
          </div>
        </div>
      </header>

      {/* 2. Greeting */}
      <section className="px-6 mt-6 mb-6">
        <h2 className="font-serif text-3xl text-stone-800 mb-1">Olá, {firstName}! 🌸</h2>
        <p className="text-stone-500 text-sm font-medium">
          Seu casamento está a <span className="text-rose-500 font-bold">{Math.max(0, daysLeft)} dias</span>.
        </p>
      </section>

      {/* 3. Progress Card */}
      <section className="px-6">
        <div className="bg-[#F9F4EF] rounded-[2rem] p-6 shadow-sm flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-200" />
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                strokeDasharray={226} 
                strokeDashoffset={226 - (226 * progress) / 100} 
                className="text-rose-400 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-stone-800">{progress}%</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">Progresso geral</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Você está indo muito bem! Continue seguindo as tarefas da semana.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Weekly Tasks */}
      <section className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl text-stone-800 flex items-center gap-2">
                ✨ Suas tarefas da semana
            </h3>
        </div>
        
        <div className="space-y-3">
          {displayTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-stone-100 flex items-center gap-3">
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-rose-400 border-rose-400' : 'border-stone-300'}`}>
                  {task.completed && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
               </div>
               <span className={`text-sm text-stone-700 font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</span>
            </div>
          ))}
        </div>
        
        <div className="text-right mt-3">
            <button onClick={onViewTasks} className="text-rose-500 text-sm font-bold hover:underline">
                Ver checklist completo →
            </button>
        </div>
      </section>

      {/* 5. Budget Card */}
      <section className="px-6 mt-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-stone-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[4rem] -z-0 opacity-50"></div>
             <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Orçamento Atual</h3>
             
             <div className="flex items-baseline gap-1 mb-1 relative z-10">
                <span className="font-serif text-2xl font-bold text-stone-800">R$ {Math.round(profile.budget * 0.73).toLocaleString()}</span>
                <span className="text-stone-400 text-sm">/ R$ {profile.budget.toLocaleString()}</span>
             </div>
             
             <p className="text-green-600 text-xs font-bold mb-4 relative z-10 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Você economizou R$ 2.800 este mês 🎉
             </p>

             <div className="w-full bg-stone-100 rounded-full h-2 mb-4 overflow-hidden relative z-10">
                <div className="bg-stone-800 h-2 rounded-full" style={{ width: '73%' }}></div>
             </div>

             <button onClick={onViewBudget} className="text-stone-800 text-sm font-bold flex items-center gap-1 hover:opacity-70 transition relative z-10">
                Abrir orçamento <span className="material-symbols-outlined text-sm">arrow_forward</span>
             </button>
        </div>
      </section>

      {/* 6. Next Events */}
      <section className="mt-8">
        <h3 className="px-6 font-serif text-xl text-stone-800 mb-4">Próximos eventos importantes</h3>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4 scrollbar-hide">
            {upcomingEvents.map((evt, i) => (
                <div key={i} className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
                    <div className="h-24 overflow-hidden">
                        <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <div className="p-3">
                        <span className="text-xs text-rose-500 font-bold block mb-1">{evt.date}</span>
                        <h4 className="text-xs text-stone-700 font-bold leading-tight">{evt.title}</h4>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 7. AI Suggestion */}
      <section className="px-6 mt-4">
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2rem] p-6 shadow-sm border border-rose-100">
            <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-400">auto_awesome</span>
                <h3 className="font-bold text-stone-800 text-sm">Sugestão inteligente</h3>
            </div>
            <p className="font-serif text-lg text-stone-700 leading-relaxed mb-4">
                Com base no seu estilo <span className="italic text-rose-600">{profile.style || 'Romântico'}</span>, selecionei 5 fornecedores perfeitos para você.
            </p>
            <button className="w-full bg-white text-stone-800 py-3 rounded-xl font-bold shadow-sm border border-stone-100 hover:bg-stone-50 transition">
                Ver recomendações →
            </button>
        </div>
      </section>
    </div>
  );
};