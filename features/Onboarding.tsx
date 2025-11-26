import React, { useState } from 'react';
import { WeddingProfile } from '../types';

interface Props {
  onComplete: (profile: WeddingProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<WeddingProfile>({
    names: '',
    date: '',
    budget: 50000,
    style: '',
    guestCount: 100,
    location: '',
  });

  const nextStep = () => setStep(s => s + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-rose-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-3xl text-rose-500">diamond</span>
          </div>
          <h1 className="font-serif text-3xl text-stone-800 mb-2">BrideFlow</h1>
          <p className="text-stone-500 font-sans">Vamos criar o casamento dos seus sonhos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-stone-700 mb-2">Qual o nome do casal?</label>
              <input 
                required
                type="text" 
                className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 focus:border-rose-400 focus:ring-0 outline-none"
                placeholder="Ex: Ana & Carlos"
                value={profile.names}
                onChange={e => setProfile({...profile, names: e.target.value})}
              />
              <button type="button" onClick={nextStep} className="mt-6 w-full bg-stone-800 text-white p-4 rounded-xl font-bold hover:bg-stone-900 transition">Próximo</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
               <label className="block text-sm font-bold text-stone-700 mb-2">Quando será o grande dia?</label>
              <input 
                required
                type="date" 
                className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 focus:border-rose-400 focus:ring-0 outline-none mb-4"
                value={profile.date}
                onChange={e => setProfile({...profile, date: e.target.value})}
              />
              
              <label className="block text-sm font-bold text-stone-700 mb-2">Qual o orçamento estimado (R$)?</label>
              <input 
                type="number" 
                className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 focus:border-rose-400 focus:ring-0 outline-none"
                value={profile.budget}
                onChange={e => setProfile({...profile, budget: Number(e.target.value)})}
              />
              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-stone-100 text-stone-600 p-4 rounded-xl font-bold">Voltar</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-stone-800 text-white p-4 rounded-xl font-bold hover:bg-stone-900 transition">Próximo</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
               <label className="block text-sm font-bold text-stone-700 mb-2">Qual o estilo do casamento?</label>
               <select 
                  className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 focus:border-rose-400 focus:ring-0 outline-none mb-4"
                  value={profile.style}
                  onChange={e => setProfile({...profile, style: e.target.value})}
               >
                 <option value="Clássico">Clássico / Tradicional</option>
                 <option value="Praia">Praia / Tropical</option>
                 <option value="Campo">Rústico / Campo</option>
                 <option value="Moderno">Moderno / Minimalista</option>
                 <option value="Luxo">Luxo / Glamour</option>
               </select>

               <label className="block text-sm font-bold text-stone-700 mb-2">Local (Cidade/Estado)</label>
              <input 
                required
                type="text" 
                className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 focus:border-rose-400 focus:ring-0 outline-none"
                placeholder="Ex: Rio de Janeiro, RJ"
                value={profile.location}
                onChange={e => setProfile({...profile, location: e.target.value})}
              />

              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-stone-100 text-stone-600 p-4 rounded-xl font-bold">Voltar</button>
                <button type="submit" className="flex-1 bg-rose-500 text-white p-4 rounded-xl font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-200">
                   Criar Planejamento
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
