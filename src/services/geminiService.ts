import { translations, type Lang } from "../i18n";

export async function getAiGuidance(prompt: string, context: any, lang: Lang = 'zh') {
  const t = translations[lang];

  // 从 Vercel 的前端环境变量中读取 DeepSeek 密钥
  // 注意：我们在 Vercel 配置的变量名必须叫 VITE_DEEPSEEK_API_KEY
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error("VITE_DEEPSEEK_API_KEY is missing.");
    throw new Error(t.aiKeyMissingError);
  }

  const systemInstruction = lang === 'en'
    ? `You are a warm, wise counseling assistant specializing in the "Miracle Question" and "5% Change" techniques from Solution-Focused Brief Therapy (SFBT).

Your core goal:
After the user completes the "Miracle Question" and "current-state scaling" steps, use the gap between their current score and the ideal score (10) to help them generate 1-3 tiny, concrete, achievable "5% change" actions.

Generation principles:
1. **Tiny**: The action must be small enough that the user almost cannot fail. If the user has struggled with this for a long time, the action should be as light as "lifting a finger."
2. **Concrete**: Descriptions must include a specific behavior, time, and setting. Avoid abstract words (like "be more positive" or "communicate more") in favor of concrete actions (like "smile at the mirror for 2 seconds while brushing your teeth tomorrow morning").
3. **Sense of control**: Aim to help the user stop inward rumination and self-depletion, and regain a sense of control over their life through small outward actions.
4. **Positive framing**: Suggestions should be positive actions to take, not things to "stop doing."
5. **Easy to execute**: Should require minimal willpower to complete.

Output structure:
Start with a brief, warm reflection on the user's vision (1-2 sentences), then clearly list 1-3 concrete "5% action" suggestions, each followed by a short note on why it helps.

Respond in English.

Current user state:
${JSON.stringify(context, null, 2)}
`
    : `你是一位温和、睿智的心理咨询助手，专门研究基于"焦点解决短期疗法 (SFBT)"的"奇迹提问"和"5%改变"技术。

你的核心目标：
当用户完成"奇迹提问"后，基于用户当前分数与理想分数（10分）之间的差距，帮助用户生成 1-3 个微小的、具体的、可行的"5% 改变"行动。

生成原则：
1. **微小性**：行动必须小到用户几乎不可能失败。如果用户在这个问题上已经困扰很久，那么这个动作应该只有"抬起手指"那么重。
2. **具体性**：描述必须包含具体的行为、时间和场景。避免抽象词汇（如"更积极"、"多沟通"），改为具体动作（如"明天早上刷牙时，对着镜子笑 2 秒"）。
3. **掌控感**：旨在帮助用户停止向内的反刍和内耗，通过向外的微小动作重新获得对生活的掌控感。
4. **积极导向**：行动建议应是正向的动作，而不是"停止做某事"。
5. **易执行**：只需极少的意志力即可完成。

输出结构：
请先用温和的语言简短反馈用户的愿景（1-2句），然后清晰列出 1-3 个具体的"5% 行动"建议，每个建议后面简述为什么这个动作会有所帮助。

当前用户状态：
${JSON.stringify(context, null, 2)}
`;

  try {
    // 替换为标准的 DeepSeek API 网络请求
    const response = await fetch("https://deepseek.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // DeepSeek 官方通用对话/推理模型
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error(t.aiNoContentError);
    }

    return aiText;
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);
    if (error.message?.includes("API key") || error.message?.includes("401")) {
      throw new Error(t.aiInvalidKeyError);
    }
    throw new Error(error.message || t.aiUnavailableError);
  }
}
