import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface ResignationInput {
  companyName: string;
  recipientName?: string;
  resignationDate: string;
  lastWorkingDate: string;
  resignationReason: "PERSONAL" | "OTHER";
  customReason?: string;
  paidLeave: "FULL" | "NEGOTIATE" | "NONE";
  equipmentReturn: "BY_MAIL" | "AT_DESK" | "IN_PERSON";
  documentDelivery: "BY_MAIL" | "NONE";
  senderName?: string;
}

export async function generateResignationEmail(input: ResignationInput): Promise<{
  subject: string;
  body: string;
}> {
  const paidLeaveText = {
    FULL: "有給休暇を全て消化させていただきたく存じます",
    NEGOTIATE: "有給休暇の消化につきましては、別途ご相談させていただければ幸いです",
    NONE: "有給休暇の消化は不要でございます",
  }[input.paidLeave];

  const equipmentText = {
    BY_MAIL: "備品につきましては郵送にてご返却いたします",
    AT_DESK: "備品につきましてはデスクにて返却いたします",
    IN_PERSON: "備品につきましては直接お持ちしてご返却いたします",
  }[input.equipmentReturn];

  const documentText = {
    BY_MAIL: "離職票等の書類につきましては、郵送にてお送りいただけますと幸いです",
    NONE: "離職票等の書類は不要でございます",
  }[input.documentDelivery];

  const reasonText =
    input.resignationReason === "PERSONAL"
      ? "一身上の都合により"
      : input.customReason
      ? `${input.customReason}により`
      : "一身上の都合により";

  const prompt = `あなたは退職通知メールを作成するプロフェッショナルアシスタントです。
以下の情報をもとに、誠実かつ法的に有効な退職通知メールを作成してください。

【絶対に守るべきルール】
1. 感情的・対立的な表現は一切使わない
2. 「角が立たない」丁寧なビジネス文体を使用する
3. 事実のみを簡潔に伝える
4. 条件交渉・金銭要求は一切含めない
5. 件名と本文を分けて出力する

【入力情報】
会社名: ${input.companyName}
担当者名: ${input.recipientName || "ご担当者様"}
退職希望日: ${input.resignationDate}
最終出社日: ${input.lastWorkingDate}
退職理由: ${reasonText}
有給休暇: ${paidLeaveText}
備品返却: ${equipmentText}
書類: ${documentText}
差出人氏名: ${input.senderName || "（氏名）"}

【出力形式】
件名: （件名のみ）
本文:
（本文のみ、宛名から署名まで）

件名と本文をそれぞれ出力してください。`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const text = content.text;
  const subjectMatch = text.match(/件名[:：]\s*(.+)/);
  const bodyMatch = text.match(/本文[:：]\s*([\s\S]+)/);

  return {
    subject: subjectMatch?.[1]?.trim() || "退職のご連絡",
    body: bodyMatch?.[1]?.trim() || text,
  };
}

export async function generateResignationLetter(input: ResignationInput): Promise<string> {
  const reasonText =
    input.resignationReason === "PERSONAL"
      ? "一身上の都合"
      : input.customReason || "一身上の都合";

  const prompt = `あなたは退職届（内容証明郵便用）を作成するプロフェッショナルアシスタントです。
以下の情報をもとに、法的に有効な退職届を作成してください。

【絶対に守るべきルール】
1. 内容証明郵便の形式に準拠する（1行20字以内、1ページ26行以内）
2. 感情的・対立的な表現は一切使わない
3. 退職の意思表示のみを簡潔に記載する
4. 条件交渉は含めない

【入力情報】
宛先会社名: ${input.companyName}
担当者名: ${input.recipientName || "代表取締役"}
退職希望日: ${input.resignationDate}
退職理由: ${reasonText}
差出人氏名: ${input.senderName || "（氏名）"}

退職届の本文のみを出力してください（宛名・日付・署名を含む）。`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

const ALERT_KEYWORDS = [
  "損害賠償",
  "懲戒解雇",
  "訴訟",
  "法的措置",
  "弁護士",
  "裁判",
  "損害",
  "賠償",
  "違約金",
  "ハラスメント",
  "不当解雇",
];

export async function summarizeReply(rawContent: string): Promise<{
  summary: string;
  hasKeywords: boolean;
  detectedKeywords: string[];
}> {
  const detectedKeywords = ALERT_KEYWORDS.filter((kw) => rawContent.includes(kw));

  const prompt = `あなたは感情フィルタリングの専門家です。
以下のメール本文から、感情・怒り・嫌み・引き止めの表現を完全に除去し、
「相手が何をしてほしいか」という事実のみを箇条書きで抽出してください。

【絶対に守るべきルール】
1. 感情・怒り・焦りのニュアンスは一切含めない
2. 日付・金額・期限・固有名詞は必ず保持する
3. 箇条書きで3〜5項目に整理する
4. 事実のみを客観的に記載する
5. 相手の心情・意図の推測は含めない

【メール原文】
${rawContent}

箇条書きのみ出力してください（前置き・後記不要）:`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return {
    summary: content.text,
    hasKeywords: detectedKeywords.length > 0,
    detectedKeywords,
  };
}
