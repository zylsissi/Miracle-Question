import { translations, type Lang } from "../i18n";

/**
 * 前端只调用自己部署的 /api/ai-guidance，不直接接触 DeepSeek 的 API Key。
 * 真正调用 DeepSeek 的逻辑在 api/ai-guidance.ts 中（Vercel Serverless Function）。
 */
export async function getAiGuidance(prompt: string, context: any, lang: Lang = "zh") {
  const t = translations[lang];

  try {
    const response = await fetch("/api/ai-guidance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, context, lang }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // 后端把具体错误信息透传回来，这里做一层友好提示
      if (response.status === 401 || data?.error?.includes?.("API key")) {
        throw new Error(t.aiInvalidKeyError);
      }
      if (response.status === 500 && data?.error?.includes?.("missing API key")) {
        throw new Error(t.aiKeyMissingError);
      }
      throw new Error(data?.error || t.aiUnavailableError);
    }

    if (!data.text) {
      throw new Error(t.aiNoContentError);
    }

    return data.text as string;
  } catch (error: any) {
    console.error("getAiGuidance error:", error);
    throw new Error(error.message || t.aiUnavailableError);
  }
}
