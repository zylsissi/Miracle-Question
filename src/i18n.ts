import { useState, useEffect, useCallback } from 'react';

export type Lang = 'zh' | 'en';

export const translations = {
  zh: {
    appTitle: '奇迹提问',
    welcomeBack: '欢迎回来',
    logoutTitle: '退出登录',
    loginToSave: '登录以保存进度',
    myJournalTitle: '我的日记',
    reset: '重置',

    introHeading: '如果奇迹在今晚发生...',
    introSubtitle: '困扰过于模糊？来试试"奇迹提问"，帮你发现那些通往美好的微小迹象。',
    existingDataDetected: '检测到已有记录',
    currentScoreLabel: '当前分数',
    rescoreBtn: '重新打分',
    adjustVisionBtn: '调整愿景',
    continueExploring: '继续探索',
    startJourney: '开始奇迹之旅',
    viewMyJournal: (count: number) => `查看我的日记 (${count})`,

    step1Label: '第一步：想象奇迹',
    miracleHeading: '想象你醒来，问题已经消失了',
    miracleDesc: '假设今晚你睡着时，一个奇迹发生了。你面临的所有困扰都解决了。当你明天醒来，你会注意到什么不同？',
    miraclePlaceholder: '描述那个完美的早晨：你看到了什么？听到了什么？你的心情是怎样的？',
    back: '返回',
    next: '下一步',

    step2Label: '第二步：评估现状',
    scalingHeading: '如果奇迹是10分，你现在是几分？',
    scalingDesc: '10分代表奇迹完全实现，0分代表最糟糕的时候。',
    scalingQuote: (score: number) => `"即便只有 ${score} 分，也意味着你已经做到了很多。想想看，是什么让你没有变成 0 分？"`,

    step3Label: '第三步：发现迹象',
    signsHeading: '如果分数增加1分，会发生什么？',
    signsDesc: (score: number) => `想象你从 ${score} 分变成了 ${score + 1} 分。那个微小的进步会体现在哪里？谁会第一个注意到？`,
    signsPlaceholder: '例如：我可能会在吃早餐时多看一眼窗外的树，或者对同事点点头...',
    findChangeBtn: '寻找5%的改变',

    step4Label: '第四步：5%的行动模块',
    actionHeading: '从"反刍"走向"行动"',
    actionDesc: '与其在宏大的愿望面前感到无力，不如专注于缩小那 5% 的差距。',
    gapLabel: '待跨越差距',
    idealMiracle: '理想奇迹',
    scorePts: (score: number) => `${score}分`,
    goalDesc: (pct: string) => `我们的目标是先向前迈进 5%，即大约 0.5 分的距离。`,
    generating: '正在根据差距生成微小行动建议...',
    retry: '重试',
    generatedSuggestionTitle: '生成的微行动建议 (1-3个)',
    chooseActionLabel: '选择或写下你要尝试的一个行动：',
    actionPlaceholder: '从上面选一个你最想做的，或者写下你自己的计划...',
    backToSigns: '返回迹象',
    regenerateTitle: '换一套建议',
    confirmActionBtn: '确认行动',

    summaryHeading: '奇迹已经播下了种子',
    summarySubtitle: '记住，改变不是一蹴而就的。这5%的行动，就是你夺回生活掌控感的开始。',
    myMiracleVision: '我的奇迹愿景',
    fivePercentAction: '5% 行动',
    saveCardBtn: '保存我的奇迹卡片',
    saveToJournalBtn: '保存到我的日记',
    backHomeBtn: '返回首页',

    journalHeading: '我的私密日记',
    journalSubtitle: '回顾你的奇迹，见证你的成长。',
    noJournalYet: '还没有保存过日记，开始一段奇迹提问吧。',
    startExploring: '开始探索',
    deleteEntryTitle: '删除条目',
    unknownDate: '未知日期',
    miniAction: '微小行动',
    miracleVisionLabel: '奇迹愿景',

    savedToJournalAlert: '已保存到日记！',
    saveFailedAlert: '保存失败，请重试。',
    confirmDeleteEntry: '确定要删除这条日记吗？',
    journalEntryTitle: (date: string) => `我的奇迹反思 - ${date}`,

    aiKeyMissingError: 'Gemini API Key 未配置。请在 AI Studio 的右侧设置栏（Settings -> Secrets）中添加名为 GEMINI_API_KEY 的密钥，并将你的 API Key 填入。刷新页面后重试。',
    aiNoContentError: 'AI 未返回任何有效内容。',
    aiInvalidKeyError: 'API Key 无效，请检查设置。',
    aiUnavailableError: 'AI 服务暂时不可用，请稍后再试。',

    promptFindChange: '基于我的奇迹描述和现状，请帮我分析一下，并引导我思考一个5%的微小改变。',
    promptRegenerate: '请根据我刚才描述的奇迹、迹象以及现状分数差距，为我重新生成一套5%改变行动示例。',
    promptRetryGenerate: '请根据我刚才描述的奇迹、迹象以及现状分数差距，为我生成1-3个极简、具体的5%改变行动。',

    footer: 'Focus on the 5% change • Miracle Question',
  },
  en: {
    appTitle: 'Miracle Question',
    welcomeBack: 'Welcome back',
    logoutTitle: 'Log out',
    loginToSave: 'Log in to save progress',
    myJournalTitle: 'My Journal',
    reset: 'Reset',

    introHeading: 'If a miracle happened tonight...',
    introSubtitle: 'Too foggy to name your struggle? Try the "Miracle Question" to spot small signs pointing toward something better.',
    existingDataDetected: 'Existing entry found',
    currentScoreLabel: 'Current score',
    rescoreBtn: 'Re-score',
    adjustVisionBtn: 'Adjust vision',
    continueExploring: 'Continue exploring',
    startJourney: 'Begin the journey',
    viewMyJournal: (count: number) => `View my journal (${count})`,

    step1Label: 'Step 1: Imagine the miracle',
    miracleHeading: 'Imagine waking up and the problem is gone',
    miracleDesc: "Suppose that tonight, while you're asleep, a miracle happens. All the troubles you're facing are solved. When you wake up tomorrow, what would you notice is different?",
    miraclePlaceholder: 'Describe that perfect morning: what do you see? What do you hear? How do you feel?',
    back: 'Back',
    next: 'Next',

    step2Label: 'Step 2: Assess where you are',
    scalingHeading: 'If the miracle is a 10, where are you now?',
    scalingDesc: '10 means the miracle has fully happened, 0 means the worst it has ever been.',
    scalingQuote: (score: number) => `"Even at just ${score}, that already means you've accomplished a lot. What's kept you from being at 0?"`,

    step3Label: 'Step 3: Spot the signs',
    signsHeading: 'What would happen if your score went up by 1?',
    signsDesc: (score: number) => `Imagine going from ${score} to ${score + 1}. Where would that small step forward show up? Who would notice it first?`,
    signsPlaceholder: 'For example: I might glance a little longer at the tree outside during breakfast, or nod at a coworker...',
    findChangeBtn: 'Find the 5% change',

    step4Label: 'Step 4: The 5% action module',
    actionHeading: 'From "ruminating" to "acting"',
    actionDesc: "Instead of feeling powerless in front of a huge wish, focus on closing just that 5% gap.",
    gapLabel: 'Gap to close',
    idealMiracle: 'Ideal miracle',
    scorePts: (score: number) => `${score} pts`,
    goalDesc: (pct: string) => `Our goal is just a first 5% step forward — about 0.5 points.`,
    generating: 'Generating small-action suggestions based on your gap...',
    retry: 'Retry',
    generatedSuggestionTitle: 'Suggested micro-actions (1-3)',
    chooseActionLabel: 'Pick or write down one action to try:',
    actionPlaceholder: 'Choose one from above, or write your own plan...',
    backToSigns: 'Back to signs',
    regenerateTitle: 'Generate new suggestions',
    confirmActionBtn: 'Confirm action',

    summaryHeading: 'The seed of a miracle has been planted',
    summarySubtitle: "Remember, change doesn't happen all at once. This 5% action is the start of taking back control of your life.",
    myMiracleVision: 'My miracle vision',
    fivePercentAction: '5% action',
    saveCardBtn: 'Save my miracle card',
    saveToJournalBtn: 'Save to my journal',
    backHomeBtn: 'Back to home',

    journalHeading: 'My private journal',
    journalSubtitle: 'Look back on your miracles, and witness your growth.',
    noJournalYet: 'No journal entries yet — start a Miracle Question session.',
    startExploring: 'Start exploring',
    deleteEntryTitle: 'Delete entry',
    unknownDate: 'Unknown date',
    miniAction: 'Small action',
    miracleVisionLabel: 'Miracle vision',

    savedToJournalAlert: 'Saved to journal!',
    saveFailedAlert: 'Save failed, please try again.',
    confirmDeleteEntry: 'Are you sure you want to delete this entry?',
    journalEntryTitle: (date: string) => `My Miracle Reflection - ${date}`,

    aiKeyMissingError: 'The Gemini API key is not configured. Please add a secret named GEMINI_API_KEY in AI Studio\'s settings panel (Settings -> Secrets) with your API key, then refresh the page and try again.',
    aiNoContentError: 'The AI did not return any content.',
    aiInvalidKeyError: 'Invalid API key. Please check your settings.',
    aiUnavailableError: 'The AI service is temporarily unavailable. Please try again later.',

    promptFindChange: 'Based on my miracle description and current state, please help analyze it and guide me toward one 5% small change.',
    promptRegenerate: 'Based on the miracle, signs, and current score gap I just described, please regenerate a fresh set of 5% change action examples.',
    promptRetryGenerate: 'Based on the miracle, signs, and current score gap I just described, please generate 1-3 minimal, concrete 5% change actions.',

    footer: 'Focus on the 5% change • Miracle Question',
  },
} as const;

const STORAGE_KEY = 'miracle-question-lang';

function detectDefaultLang(): Lang {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved === 'zh' || saved === 'en') return saved;
  if (typeof navigator !== 'undefined' && navigator.language && !navigator.language.toLowerCase().startsWith('zh')) {
    return 'en';
  }
  return 'zh';
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(detectDefaultLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  }, [lang, setLang]);

  return { lang, setLang, toggleLang, t: translations[lang] };
}
