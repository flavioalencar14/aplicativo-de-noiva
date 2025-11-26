import React from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  toggleTask: (id: string) => void;
  isLoading: boolean;
}

export const Planner: React.FC<Props> = ({ tasks, toggleTask, isLoading }) => {
  return (
    <div className="p-6 pb-24">
      <h1 className="font-serif text-3xl text-stone-800 mb-6">Agenda & Checklist</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
           <span className="material-symbols-outlined text-4xl animate-spin mb-2">refresh</span>
           <p>A IA está organizando seu casamento...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer ${
                task.completed 
                ? 'bg-stone-50 border-stone-100 opacity-60' 
                : 'bg-white border-stone-200 shadow-sm hover:border-rose-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                task.completed ? 'bg-rose-500 border-rose-500' : 'border-stone-300'
              }`}>
                {task.completed && <span className="material-symbols-outlined text-white text-sm">check</span>}
              </div>
              <div>
                <h3 className={`font-bold text-stone-800 ${task.completed ? 'line-through text-stone-400' : ''}`}>
                    {task.title}
                </h3>
                <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md uppercase font-bold tracking-wider">{task.month}</span>
                    <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-md uppercase font-bold tracking-wider">{task.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
