import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  MessageCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  Heart,
  Languages
} from 'lucide-react';
import Markdown from 'react-markdown';
import { getAiGuidance } from './services/geminiService';
import { cn } from './lib/utils';
import { translations, Language } from './translations';

type Step = 'intro' | 'miracle' | 'scaling' | 'signs' | 'action' | 'summary';

interface AppState {
  miracleDescription: string;
  currentScore: number;
  signsOfChange: string;
  fivePercentAction: string;
  aiFeedback: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [step, setStep] = useState<Step>('intro');
  const [state, setState] = useState<AppState>({
    miracleDescription: '',
    currentScore: 5,
    signsOfChange: '',
    fivePercentAction: '',
    aiFeedback: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang];

  const nextStep = (next: Step) => setStep(next);
  const prevStep = (prev: Step) => setStep(prev);

  const handleAiReflect = async (prompt: string) => {
    setIsLoading(true);
    try {
      const feedback = await getAiGuidance(prompt, state, lang);
      setState(prev => ({ ...prev, aiFeedback: feedback }));
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('intro');
    setState({
      miracleDescription: '',
      currentScore: 5,
      signsOfChange: '',
      fivePercentAction: '',
      aiFeedback: '',
    });
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 selection:bg-accent/30">
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          <h1 className="serif text-xl font-semibold tracking-tight text-primary">{t.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLang}
            className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-full"
          >
            <Languages size={16} />
            <span>{lang === 'en' ? '中文' : 'English'}</span>
          </button>
          {step !== 'intro' && (
            <button 
              onClick={reset}
              className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <RotateCcw size={16} />
              <span>{t.reset}</span>
            </button>
          )}
        </div>
      </header>

      <main className="w-full max-w-2xl mt-16 mb-24">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="serif text-4xl md:text-6xl font-light leading-tight">
                  {t.intro.title}
                </h2>
                <p className="text-foreground/70 text-lg max-w-md mx-auto leading-relaxed">
                  {t.intro.description}
                </p>
              </div>
              <button 
                onClick={() => nextStep('miracle')}
                className="btn-primary group flex items-center gap-2 mx-auto"
              >
                {t.intro.button}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </motion.div>
          )}

          {step === 'miracle' && (
            <motion.div
              key="miracle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.miracle.step}</span>
                <h2 className="serif text-3xl font-medium">{t.miracle.title}</h2>
                <p className="text-foreground/60">
                  {t.miracle.description}
                </p>
              </div>
              
              <textarea
                value={state.miracleDescription}
                onChange={(e) => setState({ ...state, miracleDescription: e.target.value })}
                placeholder={t.miracle.placeholder}
                className="w-full h-48 p-6 rounded-3xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-0 transition-all resize-none text-lg leading-relaxed shadow-sm"
              />

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('intro')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.miracle.back}
                </button>
                <button 
                  disabled={!state.miracleDescription.trim()}
                  onClick={() => nextStep('scaling')}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t.miracle.next} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'scaling' && (
            <motion.div
              key="scaling"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2 text-center">
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.scaling.step}</span>
                <h2 className="serif text-3xl font-medium">{t.scaling.title}</h2>
                <p className="text-foreground/60">
                  {t.scaling.description}
                </p>
              </div>

              <div className="space-y-8">
                <div className="relative pt-10 pb-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={state.currentScore}
                    onChange={(e) => setState({ ...state, currentScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-4 text-sm font-medium text-primary/40">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                      <span key={n} className={cn(state.currentScore === n && "text-primary scale-125 transition-transform")}>
                        {n}
                      </span>
                    ))}
                  </div>
                  <div 
                    className="absolute top-0 flex flex-col items-center transition-all duration-300 ease-out"
                    style={{ left: `${state.currentScore * 10}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-lg font-bold shadow-lg mb-2">
                      {state.currentScore}
                    </div>
                    <div className="w-0.5 h-4 bg-primary/20" />
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-3xl border border-primary/5 italic text-center">
                  {t.scaling.encouragement.replace('{score}', state.currentScore.toString())}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('miracle')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.scaling.back}
                </button>
                <button 
                  onClick={() => nextStep('signs')}
                  className="btn-primary flex items-center gap-2"
                >
                  {t.scaling.next} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'signs' && (
            <motion.div
              key="signs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.signs.step}</span>
                <h2 className="serif text-3xl font-medium">{t.signs.title}</h2>
                <p className="text-foreground/60">
                  {t.signs.description.replace('{score}', state.currentScore.toString()).replace('{nextScore}', (state.currentScore + 1).toString())}
                </p>
              </div>
              
              <textarea
                value={state.signsOfChange}
                onChange={(e) => setState({ ...state, signsOfChange: e.target.value })}
                placeholder={t.signs.placeholder}
                className="w-full h-40 p-6 rounded-3xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-0 transition-all resize-none text-lg leading-relaxed shadow-sm"
              />

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('scaling')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.signs.back}
                </button>
                <button 
                  disabled={!state.signsOfChange.trim()}
                  onClick={() => {
                    nextStep('action');
                    const aiPrompt = lang === 'zh' 
                      ? "基于我的奇迹描述和现状，请帮我分析一下，并引导我思考一个5%的微小改变。"
                      : "Based on my miracle description and current situation, please analyze it and guide me to think of a 5% tiny change.";
                    handleAiReflect(aiPrompt);
                  }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t.signs.button} <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'action' && (
            <motion.div
              key="action"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.action.step}</span>
                <h2 className="serif text-3xl font-medium">{t.action.title}</h2>
                <p className="text-foreground/60">
                  {t.action.description}
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-primary/60 font-medium animate-pulse">{t.action.aiLoading}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.aiFeedback && (
                    <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-accent/10 p-2 rounded-xl">
                          <Lightbulb className="text-accent w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-primary">{t.action.aiTitle}</h3>
                      </div>
                      <div className="markdown-body text-foreground/80 leading-relaxed">
                        <Markdown>{state.aiFeedback}</Markdown>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-primary uppercase tracking-wider">{t.action.label}</label>
                    <input
                      type="text"
                      value={state.fivePercentAction}
                      onChange={(e) => setState({ ...state, fivePercentAction: e.target.value })}
                      placeholder={t.action.placeholder}
                      className="w-full p-6 rounded-2xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-0 transition-all text-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('signs')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.action.back}
                </button>
                <button 
                  disabled={!state.fivePercentAction.trim() || isLoading}
                  onClick={() => nextStep('summary')}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t.action.button} <CheckCircle2 size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Heart className="text-primary w-10 h-10" fill="currentColor" />
                </div>
                <h2 className="serif text-4xl font-medium italic">{t.summary.title}</h2>
                <p className="text-foreground/60 max-w-md mx-auto">
                  {t.summary.description}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-primary/10 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles size={120} />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.summary.vision}</h4>
                    <p className="text-lg text-primary/80 leading-relaxed italic">"{state.miracleDescription}"</p>
                  </div>

                  <div className="h-px bg-primary/5" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.summary.state}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">{state.currentScore}</span>
                        <span className="text-primary/40 text-sm">/ 10</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.summary.action}</h4>
                      <p className="font-medium text-primary">{state.fivePercentAction}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => window.print()}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {t.summary.save}
                </button>
                <button 
                  onClick={reset}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {t.summary.new}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 text-center text-primary/30 text-xs font-medium tracking-widest uppercase">
        {t.footer}
      </footer>
    </div>
  );
}
