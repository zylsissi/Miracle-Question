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
  LogIn,
  LogOut,
  User as UserIcon,
  Loader2,
  Book,
  Calendar,
  Trash2,
  Plus,
  Languages
} from 'lucide-react';
import Markdown from 'react-markdown';
import { getAiGuidance } from './services/geminiService';
import { cn } from './lib/utils';
import { useLanguage } from './i18n';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  Timestamp,
  User
} from './firebase';

type Step = 'intro' | 'miracle' | 'scaling' | 'signs' | 'action' | 'summary' | 'journal';

interface JournalEntry {
  id: string;
  title: string;
  miracleDescription: string;
  currentScore: number;
  signsOfChange: string;
  fivePercentAction: string;
  content: string;
  createdAt: any;
}

interface AppState {
  miracleDescription: string;
  currentScore: number;
  signsOfChange: string;
  fivePercentAction: string;
  aiFeedback: string;
}

export default function App() {
  const { lang, t, toggleLang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [step, setStep] = useState<Step>('intro');
  const [state, setState] = useState<AppState>({
    miracleDescription: '',
    currentScore: 5,
    signsOfChange: '',
    fivePercentAction: '',
    aiFeedback: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalLoading, setIsJournalLoading] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) {
      setHasExistingData(false);
      setJournalEntries([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setState(prev => ({
          ...prev,
          miracleDescription: data.miracleDescription || '',
          currentScore: data.currentScore ?? 5,
          signsOfChange: data.signsOfChange || '',
          fivePercentAction: data.fivePercentAction || '',
        }));
        setHasExistingData(true);
      } else {
        setHasExistingData(false);
      }
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    // Journal entries listener
    const journalQuery = query(collection(db, 'users', user.uid, 'journal'), orderBy('createdAt', 'desc'));
    const unsubscribeJournal = onSnapshot(journalQuery, (snapshot) => {
      const entries: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setJournalEntries(entries);
    });

    return () => {
      unsubscribe();
      unsubscribeJournal();
    };
  }, [user]);

  const saveToJournal = async () => {
    if (!user) return;
    setIsJournalLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'journal'), {
        title: t.journalEntryTitle(new Date().toLocaleDateString()),
        miracleDescription: state.miracleDescription,
        currentScore: state.currentScore,
        signsOfChange: state.signsOfChange,
        fivePercentAction: state.fivePercentAction,
        content: '',
        createdAt: serverTimestamp(),
      });
      alert(t.savedToJournalAlert);
    } catch (error) {
      console.error("Error saving to journal:", error);
      alert(t.saveFailedAlert);
    } finally {
      setIsJournalLoading(false);
    }
  };

  const deleteJournalEntry = async (entryId: string) => {
    if (!user) return;
    if (!confirm(t.confirmDeleteEntry)) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'journal', entryId));
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  const saveToFirestore = async (updates: Partial<AppState>) => {
    if (!user) return;
    try {
      const newState = { ...state, ...updates };
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        miracleDescription: newState.miracleDescription,
        currentScore: newState.currentScore,
        signsOfChange: newState.signsOfChange,
        fivePercentAction: newState.fivePercentAction,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      reset();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const nextStep = (next: Step) => setStep(next);
  const prevStep = (prev: Step) => setStep(prev);

  const handleAiReflect = async (prompt: string) => {
    setIsLoading(true);
    setAiError(null);
    try {
      const feedback = await getAiGuidance(prompt, state, lang);
      setState(prev => ({ ...prev, aiFeedback: feedback || '' }));
    } catch (error: any) {
      console.error('AI Error:', error);
      setAiError(error.message || t.aiUnavailableError);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('intro');
    setAiError(null);
    setState({
      miracleDescription: '',
      currentScore: 5,
      signsOfChange: '',
      fivePercentAction: '',
      aiFeedback: '',
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 selection:bg-accent/30">
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          <h1 className="serif text-xl font-semibold tracking-tight text-primary">{t.appTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="p-2 rounded-full hover:bg-muted transition-colors text-primary/60 hover:text-primary flex items-center gap-1"
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Languages size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">{t.welcomeBack}</p>
                <p className="text-sm font-medium text-primary">{user.displayName}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-muted transition-colors text-primary/60 hover:text-primary"
                title={t.logoutTitle}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
            >
              <LogIn size={16} />
              {t.loginToSave}
            </button>
          )}

          {user && (
            <button 
              onClick={() => setStep('journal')}
              className={cn(
                "p-2 rounded-full hover:bg-muted transition-colors text-primary/60 hover:text-primary",
                step === 'journal' && "text-primary bg-primary/10"
              )}
              title={t.myJournalTitle}
            >
              <Book size={20} />
            </button>
          )}
          
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
                  {t.introHeading}
                </h2>
                <p className="text-foreground/70 text-lg max-w-md mx-auto leading-relaxed">
                  {t.introSubtitle}
                </p>
              </div>

              {hasExistingData && user && (
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-primary/10 shadow-sm max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest">{t.existingDataDetected}</span>
                  </div>
                  <p className="text-sm text-foreground/60 italic">
                    "{state.miracleDescription.slice(0, 60)}..."
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-tighter text-primary/40 font-bold">{t.currentScoreLabel}</p>
                      <p className="text-xl font-bold text-primary">{state.currentScore}</p>
                    </div>
                    <div className="w-px h-8 bg-primary/10" />
                    <button 
                      onClick={() => nextStep('scaling')}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {t.rescoreBtn}
                    </button>
                    <button 
                      onClick={() => nextStep('miracle')}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {t.adjustVisionBtn}
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => nextStep('miracle')}
                className="btn-primary group flex items-center gap-2 mx-auto"
              >
                {hasExistingData ? t.continueExploring : t.startJourney}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              {user && journalEntries.length > 0 && (
                <div className="pt-8">
                   <button 
                    onClick={() => setStep('journal')}
                    className="text-sm font-bold text-accent hover:underline flex items-center gap-1 mx-auto"
                  >
                     {t.viewMyJournal(journalEntries.length)} <ChevronRight size={14} />
                  </button>
                </div>
              )}
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
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.step1Label}</span>
                <h2 className="serif text-3xl font-medium">{t.miracleHeading}</h2>
                <p className="text-foreground/60">
                  {t.miracleDesc}
                </p>
              </div>
              
              <textarea
                value={state.miracleDescription}
                onChange={(e) => setState({ ...state, miracleDescription: e.target.value })}
                placeholder={t.miraclePlaceholder}
                className="w-full h-48 p-6 rounded-3xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-0 transition-all resize-none text-lg leading-relaxed shadow-sm"
              />

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('intro')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.back}
                </button>
                <button 
                  disabled={!state.miracleDescription.trim()}
                  onClick={() => {
                    saveToFirestore({ miracleDescription: state.miracleDescription });
                    nextStep('scaling');
                  }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t.next} <ChevronRight size={20} />
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
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.step2Label}</span>
                <h2 className="serif text-3xl font-medium">{t.scalingHeading}</h2>
                <p className="text-foreground/60">
                  {t.scalingDesc}
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
                    onChange={(e) => {
                      const score = parseInt(e.target.value);
                      setState({ ...state, currentScore: score });
                      saveToFirestore({ currentScore: score });
                    }}
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
                  {t.scalingQuote(state.currentScore)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('miracle')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.back}
                </button>
                <button 
                  onClick={() => nextStep('signs')}
                  className="btn-primary flex items-center gap-2"
                >
                  {t.next} <ChevronRight size={20} />
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
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.step3Label}</span>
                <h2 className="serif text-3xl font-medium">{t.signsHeading}</h2>
                <p className="text-foreground/60">
                  {t.signsDesc(state.currentScore)}
                </p>
              </div>
              
              <textarea
                value={state.signsOfChange}
                onChange={(e) => setState({ ...state, signsOfChange: e.target.value })}
                placeholder={t.signsPlaceholder}
                className="w-full h-40 p-6 rounded-3xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-0 transition-all resize-none text-lg leading-relaxed shadow-sm"
              />

              <div className="flex justify-between items-center">
                <button onClick={() => prevStep('scaling')} className="text-primary/60 hover:text-primary flex items-center gap-1">
                  <ChevronLeft size={20} /> {t.back}
                </button>
                <button 
                  disabled={!state.signsOfChange.trim()}
                  onClick={() => {
                    saveToFirestore({ signsOfChange: state.signsOfChange });
                    nextStep('action');
                    handleAiReflect(t.promptFindChange);
                  }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {t.findChangeBtn} <ChevronRight size={20} />
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
                <span className="text-accent font-medium text-sm tracking-widest uppercase">{t.step4Label}</span>
                <h2 className="serif text-3xl font-medium">{t.actionHeading}</h2>
                <p className="text-foreground/60">
                  {t.actionDesc}
                </p>
              </div>

              {/* Gap Visualization Module */}
              <div className="bg-white p-6 rounded-[2rem] border border-primary/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between font-serif">
                  <div>
                    <span className="text-sm text-foreground/40 block">{t.currentScoreLabel}</span>
                    <span className="text-2xl font-medium text-primary">{t.scorePts(state.currentScore)}</span>
                  </div>
                  <div className="text-center bg-accent/5 px-4 py-2 rounded-2xl border border-accent/10">
                    <span className="text-[10px] text-accent/60 block font-bold tracking-widest uppercase">{t.gapLabel}</span>
                    <span className="text-xl font-bold text-accent">{t.scorePts(10 - state.currentScore)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-foreground/40 block">{t.idealMiracle}</span>
                    <span className="text-2xl font-medium text-primary">{t.scorePts(10)}</span>
                  </div>
                </div>
                
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(state.currentScore / 10) * 100}%` }}
                    className="absolute left-0 top-0 h-full bg-primary/30 rounded-full"
                  />
                  {/* The 5% goal indicator */}
                  <motion.div 
                    initial={{ left: `${(state.currentScore / 10) * 100}%`, opacity: 0 }}
                    animate={{ left: `${((state.currentScore + 0.5) / 10) * 100}%`, opacity: 1 }}
                    className="absolute top-0 w-1 h-full bg-accent z-10 shadow-[0_0_10px_rgba(var(--accent),0.5)]"
                  />
                </div>
                <p className="text-center text-xs text-foreground/40 font-medium">
                  {t.goalDesc('5%')}
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-primary/60 font-medium animate-pulse">{t.generating}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {aiError && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm flex items-center gap-2">
                      <RotateCcw size={16} className="shrink-0" />
                      <p>{aiError}</p>
                      <button 
                        onClick={() => handleAiReflect(t.promptRetryGenerate)}
                        className="ml-auto underline font-bold"
                      >
                        {t.retry}
                      </button>
                    </div>
                  )}

                  {state.aiFeedback && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/10 p-2 rounded-xl">
                          <Lightbulb className="text-accent w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-primary">{t.generatedSuggestionTitle}</h3>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="markdown-body text-foreground/80 leading-relaxed prose prose-slate prose-p:my-2 prose-li:my-1">
                          <Markdown>{state.aiFeedback}</Markdown>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-primary/10 p-1.5 rounded-lg">
                        <Plus className="text-primary w-4 h-4" />
                      </div>
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">{t.chooseActionLabel}</label>
                    </div>
                    <input
                      type="text"
                      value={state.fivePercentAction}
                      onChange={(e) => {
                        setState({ ...state, fivePercentAction: e.target.value });
                        saveToFirestore({ fivePercentAction: e.target.value });
                      }}
                      placeholder={t.actionPlaceholder}
                      className="w-full p-6 rounded-3xl bg-white border border-primary/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-primary/5">
                <button 
                  onClick={() => prevStep('signs')} 
                  className="text-primary/60 hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  <ChevronLeft size={20} /> {t.backToSigns}
                </button>
                <div className="flex gap-4">
                   <button 
                    onClick={() => handleAiReflect(t.promptRegenerate)}
                    className="p-3 rounded-full border border-primary/10 text-primary/60 hover:text-accent hover:border-accent/30 transition-all"
                    title={t.regenerateTitle}
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    disabled={!state.fivePercentAction.trim() || isLoading}
                    onClick={() => {
                      saveToFirestore({ fivePercentAction: state.fivePercentAction });
                      nextStep('summary');
                    }}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-8 shadow-lg shadow-primary/20"
                  >
                    {t.confirmActionBtn} <ArrowRight size={20} />
                  </button>
                </div>
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
                <h2 className="serif text-4xl font-medium italic">{t.summaryHeading}</h2>
                <p className="text-foreground/60 max-w-md mx-auto">
                  {t.summarySubtitle}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-primary/10 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles size={120} />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.myMiracleVision}</h4>
                    <p className="text-lg text-primary/80 leading-relaxed italic">"{state.miracleDescription}"</p>
                  </div>

                  <div className="h-px bg-primary/5" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.currentScoreLabel}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">{state.currentScore}</span>
                        <span className="text-primary/40 text-sm">/ 10</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-widest">{t.fivePercentAction}</h4>
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
                  {t.saveCardBtn}
                </button>
                {user && (
                  <button 
                    onClick={saveToJournal}
                    disabled={isJournalLoading}
                    className="btn-primary bg-accent hover:bg-accent/90 w-full flex items-center justify-center gap-2"
                  >
                    {isJournalLoading ? <Loader2 className="animate-spin" size={20} /> : <Book size={20} />}
                    {t.saveToJournalBtn}
                  </button>
                )}
                <button 
                  onClick={reset}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {t.backHomeBtn}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-2">
                  <Book className="text-accent w-8 h-8" />
                </div>
                <h2 className="serif text-3xl font-medium">{t.journalHeading}</h2>
                <p className="text-foreground/60">
                  {t.journalSubtitle}
                </p>
              </div>

              {journalEntries.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-primary/10 shadow-sm text-center space-y-4">
                  <p className="text-foreground/40 italic">{t.noJournalYet}</p>
                  <button 
                    onClick={() => setStep('intro')}
                    className="btn-primary bg-primary/80 hover:bg-primary"
                  >
                    {t.startExploring}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                  {journalEntries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow group relative"
                    >
                      <button 
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="absolute top-4 right-4 p-2 text-primary/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t.deleteEntryTitle}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center gap-2 text-accent/60 mb-2">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : t.unknownDate}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-primary mb-3">{entry.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-primary/30">{t.currentScoreLabel}</p>
                          <p className="font-bold text-primary">{entry.currentScore} / 10</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-primary/30">{t.miniAction}</p>
                          <p className="text-primary/70 line-clamp-1">{entry.fivePercentAction}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-primary/30">{t.miracleVisionLabel}</p>
                        <p className="text-sm text-primary/60 italic line-clamp-2">"{entry.miracleDescription}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('intro')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> {t.backHomeBtn}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 text-center text-primary/30 text-xs font-medium tracking-widest uppercase">
        Focus on the 5% change • Miracle Question
      </footer>
    </div>
  );
}
