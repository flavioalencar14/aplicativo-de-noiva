import React, { useState } from 'react';
import { Guest, Table } from '../types';
import { organizeTables } from '../services/geminiService';

export const Guests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'tables'>('list');
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Tia Cotinha', category: 'family', confirmed: true, conflictPotential: ['Tio Barnabé'] },
    { id: '2', name: 'Tio Barnabé', category: 'family', confirmed: true, conflictPotential: ['Tia Cotinha'] },
    { id: '3', name: 'Juliana (Ex do Noivo)', category: 'friend', confirmed: true, conflictPotential: ['Noiva'] },
    { id: '4', name: 'Marcos (Chefe)', category: 'work', confirmed: false, conflictPotential: [] },
    { id: '5', name: 'Ana', category: 'friend', confirmed: true, conflictPotential: [] },
    { id: '6', name: 'Beto', category: 'friend', confirmed: true, conflictPotential: [] },
    { id: '7', name: 'Carlos', category: 'work', confirmed: true, conflictPotential: [] },
    { id: '8', name: 'Diana', category: 'work', confirmed: true, conflictPotential: [] },
  ]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isOrganizing, setIsOrganizing] = useState(false);

  const handleOrganize = async () => {
    setIsOrganizing(true);
    const result = await organizeTables(guests);
    setTables(result);
    setIsOrganizing(false);
    setActiveTab('tables');
  };

  const addGuest = () => {
    const name = prompt("Nome do convidado:");
    if (!name) return;
    const newGuest: Guest = {
        id: Date.now().toString(),
        name,
        category: 'friend',
        confirmed: false,
        conflictPotential: []
    };
    setGuests([...guests, newGuest]);
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl text-stone-800">Convidados</h1>
        <button onClick={addGuest} className="bg-stone-800 text-white w-10 h-10 rounded-full flex items-center justify-center">
             <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className="flex gap-2 mb-6 bg-stone-100 p-1 rounded-xl">
        <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'list' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
        >
            Lista ({guests.length})
        </button>
        <button 
             onClick={() => setActiveTab('tables')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'tables' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
        >
            Mesas
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-2">
            {guests.map(g => (
                <div key={g.id} className="bg-white p-4 rounded-xl border border-stone-100 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-stone-800">{g.name}</p>
                        <div className="flex gap-2 mt-1">
                             <span className="text-[10px] bg-stone-100 px-2 rounded text-stone-500 uppercase">{g.category}</span>
                             {g.conflictPotential.length > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 rounded flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">warning</span> Treta
                                </span>
                             )}
                        </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${g.confirmed ? 'bg-green-400' : 'bg-stone-300'}`}></div>
                </div>
            ))}
            
            <button 
                onClick={handleOrganize}
                disabled={isOrganizing}
                className="w-full mt-6 bg-gradient-to-r from-rose-400 to-rose-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
            >
                {isOrganizing ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                    <span className="material-symbols-outlined">table_restaurant</span>
                )}
                {isOrganizing ? "Organizando com IA..." : "IA Anti-Treta: Organizar Mesas"}
            </button>
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="space-y-6">
            {tables.length === 0 && !isOrganizing && (
                <div className="text-center py-10 text-stone-400">
                    <p>Nenhuma mesa organizada ainda.</p>
                    <button onClick={handleOrganize} className="text-rose-500 font-bold underline mt-2">Rodar IA agora</button>
                </div>
            )}
            
            {tables.map(table => (
                <div key={table.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                    <div className="flex justify-between items-center mb-3 border-b border-stone-100 pb-2">
                        <h3 className="font-serif text-lg font-bold text-stone-800">Mesa {table.id}: {table.name}</h3>
                        <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded">{table.guests.length} Lugares</span>
                    </div>
                    <p className="text-xs text-stone-500 italic mb-3 bg-stone-50 p-2 rounded">🤖 {table.reasoning}</p>
                    <div className="space-y-1">
                        {table.guests.map(g => (
                            <div key={g.id} className="flex items-center gap-2 text-sm text-stone-700">
                                <span className="material-symbols-outlined text-xs text-stone-400">person</span>
                                {g.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
