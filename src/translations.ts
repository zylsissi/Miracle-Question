export type Language = 'en' | 'zh';

export const translations = {
  en: {
    title: "Miracle Question",
    reset: "Reset",
    intro: {
      title: "If a miracle happened tonight...",
      description: "The 'Miracle Question' helps you break free from vague distress and discover the overlooked, tiny signs leading toward a better life.",
      button: "Start Your Journey"
    },
    miracle: {
      step: "Step 1: Imagine the Miracle",
      title: "Imagine you wake up, and the problem is gone",
      description: "Suppose while you are sleeping tonight, a miracle happens. All the troubles you face are solved. When you wake up tomorrow, what would you notice that is different?",
      placeholder: "Describe that perfect morning: What do you see? What do you hear? How do you feel?",
      back: "Back",
      next: "Next"
    },
    scaling: {
      step: "Step 2: Assess the Present",
      title: "If the miracle is 10, where are you now?",
      description: "10 represents the miracle fully realized, and 0 represents the worst it's ever been.",
      encouragement: "Even if it's only {score}, it means you've already achieved a lot. Think about it, what kept it from becoming 0?",
      back: "Back",
      next: "Next"
    },
    signs: {
      step: "Step 3: Discover Signs",
      title: "If the score increased by 1, what would happen?",
      description: "Imagine you went from {score} to {nextScore}. Where would that tiny progress show up? Who would be the first to notice?",
      placeholder: "Example: I might look at the trees outside while eating breakfast, or nod to a colleague...",
      back: "Back",
      button: "Find the 5% Change"
    },
    action: {
      step: "Step 4: The 5% Action",
      title: "Create a tiny change",
      description: "Instead of pursuing a complete overhaul, try creating a 5% small change. It must be small enough that you almost cannot fail.",
      aiLoading: "AI is organizing your thoughts...",
      aiTitle: "AI Assistant's Suggestion",
      label: "Your 5% Action Plan:",
      placeholder: "Example: Spend 3 minutes deep breathing tomorrow morning...",
      back: "Back",
      button: "Complete Plan"
    },
    summary: {
      title: "The seeds of a miracle have been sown",
      description: "Remember, change doesn't happen overnight. This 5% action is the beginning of you reclaiming control of your life.",
      vision: "My Miracle Vision",
      state: "Current State",
      action: "5% Action",
      save: "Save My Miracle Card",
      new: "Start New Exploration"
    },
    footer: "Focus on the 5% change • Miracle Question"
  },
  zh: {
    title: "奇迹提问",
    reset: "重置",
    intro: {
      title: "如果奇迹在今晚发生...",
      description: "“奇迹提问”能帮你从模糊的困扰中解脱，发现那些被忽略的、通往美好的微小迹象。",
      button: "开始奇迹之旅"
    },
    miracle: {
      step: "第一步：想象奇迹",
      title: "想象你醒来，问题已经消失了",
      description: "假设今晚你睡着时，一个奇迹发生了。你面临的所有困扰都解决了。当你明天醒来，你会注意到什么不同？",
      placeholder: "描述那个完美的早晨：你看到了什么？听到了什么？你的心情是怎样的？",
      back: "返回",
      next: "下一步"
    },
    scaling: {
      step: "第二步：评估现状",
      title: "如果奇迹是10分，你现在是几分？",
      description: "10分代表奇迹完全实现，0分代表最糟糕的时候。",
      encouragement: "即便只有 {score} 分，也意味着你已经做到了很多。想想看，是什么让你没有变成 0 分？",
      back: "返回",
      next: "下一步"
    },
    signs: {
      step: "第三步：发现迹象",
      title: "如果分数增加1分，会发生什么？",
      description: "想象你从 {score} 分变成了 {nextScore} 分。那个微小的进步会体现在哪里？谁会第一个注意到？",
      placeholder: "例如：我可能会在吃早餐时多看一眼窗外的树，或者对同事点点头...",
      back: "返回",
      button: "寻找5%的改变"
    },
    action: {
      step: "第四步：5%的行动",
      title: "创造一个微小的改变",
      description: "与其追求彻底的翻转，不如尝试创造5%的小改变。它必须足够小，小到你几乎不可能失败。",
      aiLoading: "AI 正在为你梳理思绪...",
      aiTitle: "AI 助手的建议",
      label: "你的 5% 行动计划：",
      placeholder: "例如：明天早上花3分钟深呼吸，或者给朋友发一条简短的问候...",
      back: "返回",
      button: "完成计划"
    },
    summary: {
      title: "奇迹已经播下了种子",
      description: "记住，改变不是一蹴而就的。这5%的行动，就是你夺回生活掌控感的开始。",
      vision: "我的奇迹愿景",
      state: "当前状态",
      action: "5% 行动",
      save: "保存我的奇迹卡片",
      new: "开启新的探索"
    },
    footer: "关注 5% 的改变 • 奇迹提问"
  }
};
