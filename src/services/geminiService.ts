import { GoogleGenAI } from "@google/genai";

export async function getAiGuidance(prompt: string, context: any) {
  // Try to get key from multiple sources
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing.");
    throw new Error("Gemini API Key 未配置。请在 AI Studio 的右侧设置栏（Settings -> Secrets）中添加名为 GEMINI_API_KEY 的密钥，并将你的 API Key 填入。刷新页面后重试。");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `你是一位温和、睿智的心理咨询助手，专门研究基于“焦点解决短期疗法 (SFBT)”的“奇迹提问”和“5%改变”技术。

你的核心目标：
当用户完成“奇迹提问”和“现状评估”后，基于用户当前分数与理想分数（10分）之间的差距，帮助用户生成 1-3 个微小的、具体的、可行的“5% 改变”行动。

生成原则：
1. **微小性**：行动必须小到用户几乎不可能失败。如果用户在这个问题上已经困扰很久，那么这个动作应该只有“抬起手指”那么重。
2. **具体性**：描述必须包含具体的行为、时间和场景。避免抽象词汇（如“更积极”、“多沟通”），改为具体动作（如“明天早上刷牙时，对着镜子笑 2 秒”）。
3. **掌控感**：旨在帮助用户停止向内的反刍和内耗，通过向外的微小动作重新获得对生活的掌控感。
4. **积极导向**：行动建议应是正向的动作，而不是“停止做某事”。
5. **易执行**：只需极少的意志力即可完成。

输出结构：
请先用温和的语言简短反馈用户的愿景（1-2句），然后清晰列出 1-3 个具体的“5% 行动”建议，每个建议后面简述为什么这个动作会有所帮助。

当前用户状态：
${JSON.stringify(context, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("AI 未返回任何有效内容。");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Handle specific error messages if needed
    if (error.message?.includes("API key not valid")) {
      throw new Error("API Key 无效，请检查设置。");
    }
    throw new Error(error.message || "调用 AI 服务时发生未知错误。");
  }
}
