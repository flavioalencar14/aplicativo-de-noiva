import React, { useState } from 'react';
import { getEmergencyAdvice } from '../services/geminiService';

export const Sos: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    if (!problem) return;
    setLoading(true);
    const advice = await getEmergencyAdvice(problem);
    setSolution(advice);
    setLoading(false);
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-rose-500">
      <div className="text-center text-white mb-8 pt-8">
        <span className="material-symbols-outlined text-6xl mb-2">local_hospital</span>
        <h1 className="font-serif text-3xl font-bold">SOS Bride</h1>
        <p className="opacity-90">Assistente de Emergência</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-2xl">
        <label className="font-bold text-stone-700 block mb-2">Qual é a emergência?</label>
        <textarea
            className="w-full p-4 bg-rose-50 rounded-xl border border-rose-100 focus:border-rose-400 outline-none text-stone-800"
            rows={3}
            placeholder="Ex: O bolo caiu! O DJ cancelou! Vai chover!"
            value={problem}
            onChange={e => setProblem(e.target.value)}
        />
        
        <button 
            onClick={handleSOS}
            disabled={loading || !problem}
            className="w-full mt-4 bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-200 disabled:opacity-50"
        >
            {loading ? "Pensando numa solução..." : "SOCORRO!"}
        </button>

        {solution && (
            <div className="mt-8 animate-fade-in bg-stone-50 p-6 rounded-2xl border-l-4 border-rose-500">
                <h3 className="font-serif text-xl text-stone-800 mb-2 font-bold">Plano B:</h3>
                <div className="prose prose-stone text-stone-600 leading-relaxed whitespace-pre-line">
                    {solution}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
