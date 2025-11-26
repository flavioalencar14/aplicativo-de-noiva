import React, { useState } from 'react';
import { generateMoodboardImage, generateWeddingVideo } from '../services/geminiService';
import { GoogleGenAI } from '@google/genai';

export const Moodboard: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [generatedItems, setGeneratedItems] = useState<{url: string, type: 'image'|'video'}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState<'image' | 'video'>('image');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);

    try {
        // Ensure user has selected a key for Paid Services (Veo/Imagen 3)
        // Using (window as any) to avoid TypeScript errors if interface is not globally defined
        if ((window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await (window as any).aistudio.openSelectKey();
            }
        }
        
        // The selected API key is available via process.env.API_KEY.
        const userClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

        if (activeType === 'image') {
            const url = await generateMoodboardImage(prompt, aspectRatio, userClient);
            if (url) setGeneratedItems([{ url, type: 'image' }, ...generatedItems]);
        } else {
             const url = await generateWeddingVideo(prompt, userClient);
             if (url) {
                // Video URL needs key appended
                const fetchUrl = `${url}&key=${process.env.API_KEY}`;
                setGeneratedItems([{ url: fetchUrl, type: 'video' }, ...generatedItems]);
             }
        }

    } catch (e: any) {
        console.error("Generation error", e);
        
        // Handle 403 Permission Denied or Not Found errors by prompting for key again
        const errorMessage = e.toString().toLowerCase();
        if (errorMessage.includes('403') || errorMessage.includes('permission_denied') || errorMessage.includes('not found')) {
             if ((window as any).aistudio) {
                 alert("Acesso negado ou modelo não habilitado para esta chave. Por favor, selecione uma chave de API válida (Projeto com faturamento ativado é necessário para modelos Pro/Video).");
                 try {
                     await (window as any).aistudio.openSelectKey();
                 } catch (k) {
                     console.error("Error reopening key dialog", k);
                 }
             } else {
                 alert("Erro de permissão (403). Verifique sua chave de API.");
             }
        } else {
             alert(`Erro ao gerar: ${e.message || "Tente novamente."}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="font-serif text-3xl text-stone-800 mb-6">Moodboard & IA</h1>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 mb-8">
        <div className="flex gap-2 mb-4">
             <button 
                onClick={() => setActiveType('image')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg border ${activeType === 'image' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-transparent text-stone-500'}`}
             >
                Gerar Imagem
             </button>
             <button 
                onClick={() => setActiveType('video')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg border ${activeType === 'video' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-transparent text-stone-500'}`}
             >
                Gerar Vídeo
             </button>
        </div>

        <textarea
            className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:border-rose-400 focus:ring-0 outline-none resize-none"
            rows={3}
            placeholder={activeType === 'image' ? "Descreva a decoração, o vestido, ou o bolo..." : "Descreva uma cena de vídeo para inspiração..."}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
        />
        
        {activeType === 'image' && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {['1:1', '3:4', '4:3', '9:16', '16:9'].map(ratio => (
                    <button 
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${aspectRatio === ratio ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'}`}
                    >
                        {ratio}
                    </button>
                ))}
            </div>
        )}

        <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="w-full mt-4 bg-stone-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-900 transition disabled:opacity-50"
        >
            {isLoading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">auto_awesome</span>}
            {isLoading ? "Criando..." : "Gerar"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {generatedItems.map((item, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden shadow-md bg-stone-200 aspect-[3/4]">
                {item.type === 'image' ? (
                    <img src={item.url} className="w-full h-full object-cover" alt="Generated" />
                ) : (
                    <video src={item.url} controls className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-full backdrop-blur-sm">
                    <span className="material-symbols-outlined text-xs text-stone-800">
                        {item.type === 'image' ? 'image' : 'videocam'}
                    </span>
                </div>
            </div>
        ))}
        {generatedItems.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-10 text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">image</span>
                <p>Suas inspirações aparecerão aqui.</p>
            </div>
        )}
      </div>
    </div>
  );
};