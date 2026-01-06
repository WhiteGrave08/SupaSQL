
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { generateSchemaFromPrompt, getAISuggestions } from '../../lib/gemini';
import { useStore } from '../../store';
import { AISuggestion } from '../../types';

export const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const { currentSchema, setSchema, toggleAIPanel } = useStore();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const newSchema = await generateSchemaFromPrompt(prompt);
      setSchema(newSchema);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await getAISuggestions(JSON.stringify(currentSchema));
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 h-full border-l border-neutral-800 bg-[#0a0a0a] flex flex-col">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h2 className="font-semibold text-sm">AI Assistant</h2>
        </div>
        <button onClick={toggleAIPanel} className="text-neutral-500 hover:text-neutral-200">×</button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Generate Schema</label>
          <textarea 
            className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-600 resize-none"
            placeholder="e.g. 'Build a high-performance e-commerce database with products, users, and multi-tenant inventory tracking...'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            disabled={isLoading || !prompt}
            onClick={handleGenerate}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Suggest Schema</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-800/50">
          <div className="flex items-center justify-between mb-3">
             <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Optimizations</label>
             <button onClick={loadSuggestions} className="text-[10px] text-blue-500 hover:underline">Refresh</button>
          </div>

          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.impact === 'high' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'}`} />
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">{s.title}</h4>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">{s.description}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] text-neutral-400 font-medium">
                        <Zap className="w-3 h-3 text-orange-400" />
                        <span>Impact: {s.impact}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-neutral-600 ml-auto" />
                </div>
              </div>
            ))}
            
            {suggestions.length === 0 && !isLoading && (
               <div className="py-8 text-center px-4">
                  <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-5 h-5 text-neutral-600" />
                  </div>
                  <p className="text-xs text-neutral-500">Your schema looks solid. No immediate optimizations detected.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
