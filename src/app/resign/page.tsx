"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

type FormData = {
  companyName: string;
  companyEmail: string;
  recipientName: string;
  resignationDate: string;
  lastWorkingDate: string;
  resignationReason: "PERSONAL" | "OTHER";
  customReason: string;
  paidLeave: "FULL" | "NEGOTIATE" | "NONE";
  equipmentReturn: "BY_MAIL" | "AT_DESK" | "IN_PERSON";
  documentDelivery: "BY_MAIL" | "NONE";
  senderName: string;
  senderEmail: string;
};

function OptionCard({
  selected,
  onClick,
  title,
  desc,
  emoji,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc?: string;
  emoji?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border-2 p-4 text-left transition-all",
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
      )}
    >
      <div className="flex items-start gap-3">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <div className="flex-1">
          <div className="font-semibold text-stone-900">{title}</div>
          {desc && <div className="mt-0.5 text-sm text-stone-500">{desc}</div>}
        </div>
        {selected && <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />}
      </div>
    </button>
  );
}

const STEPS = ["会社情報", "退職希望", "有給・書類", "あなたの情報"];

export default function ResignFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    companyName: "",
    companyEmail: "",
    recipientName: "",
    resignationDate: "",
    lastWorkingDate: "",
    resignationReason: "PERSONAL",
    customReason: "",
    paidLeave: "FULL",
    equipmentReturn: "BY_MAIL",
    documentDelivery: "BY_MAIL",
    senderName: "",
    senderEmail: "",
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canNext(): boolean {
    if (step === 0) return !!(form.companyName && form.companyEmail);
    if (step === 1) return !!(form.resignationDate && form.lastWorkingDate);
    if (step === 2) return true;
    if (step === 3) return !!(form.senderName && form.senderEmail);
    return false;
  }

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    // 最後のステップ → サーバーに保存して次へ
    setIsLoading(true);
    try {
      const res = await fetch("/api/resignations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      router.push(`/resign/method?id=${data.id}`);
    } catch {
      alert("エラーが発生しました。もう一度お試しください。");
      setIsLoading(false);
    }
  }

  const progressValue = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">
              STEP {step + 1} / {STEPS.length}
            </span>
            <span className="text-sm font-semibold text-stone-900">{STEPS[step]}</span>
          </div>
          <Progress value={progressValue} />
          <div className="mt-3 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full",
                  i <= step ? "bg-emerald-500" : "bg-stone-200"
                )}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8">
        {/* 先輩の励まし */}
        <div className="mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="rounded-xl rounded-tl-none bg-white border border-stone-200 p-4 text-sm text-stone-700 shadow-sm">
            {step === 0 && "まずは会社の情報を教えてください。文章は後でAIが全部作りますよ 😊"}
            {step === 1 && "退職希望日を決めましょう。民法上は2週間前の通知でOKです！"}
            {step === 2 && "有給と書類の希望を選んでください。全部タップするだけです✨"}
            {step === 3 && "最後にあなたのお名前とメールアドレスを教えてください。"}
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* STEP 0: 会社情報 */}
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="companyName"
                    placeholder="株式会社○○"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">送付先メールアドレス <span className="text-red-500">*</span></Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="hr@company.co.jp"
                    value={form.companyEmail}
                    onChange={(e) => update("companyEmail", e.target.value)}
                  />
                  <p className="text-xs text-stone-400">人事部・直属の上司・代表のメールアドレスなど</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientName">担当者名（任意）</Label>
                  <Input
                    id="recipientName"
                    placeholder="田中 部長"
                    value={form.recipientName}
                    onChange={(e) => update("recipientName", e.target.value)}
                  />
                  <p className="text-xs text-stone-400">空白の場合は「ご担当者様」になります</p>
                </div>
              </>
            )}

            {/* STEP 1: 退職希望 */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resignationDate">退職希望日 <span className="text-red-500">*</span></Label>
                  <Input
                    id="resignationDate"
                    type="date"
                    value={form.resignationDate}
                    onChange={(e) => update("resignationDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastWorkingDate">最終出社日 <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastWorkingDate"
                    type="date"
                    value={form.lastWorkingDate}
                    onChange={(e) => update("lastWorkingDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-3">
                  <Label>退職理由</Label>
                  <OptionCard
                    selected={form.resignationReason === "PERSONAL"}
                    onClick={() => update("resignationReason", "PERSONAL")}
                    emoji="🤐"
                    title="一身上の都合"
                    desc="最もシンプルで一般的。理由を聞かれても断れます。"
                  />
                  <OptionCard
                    selected={form.resignationReason === "OTHER"}
                    onClick={() => update("resignationReason", "OTHER")}
                    emoji="✍️"
                    title="その他（自由入力）"
                    desc="体調不良・家庭の事情など、具体的に伝える場合"
                  />
                  {form.resignationReason === "OTHER" && (
                    <Textarea
                      placeholder="例: 家族の介護が必要になりました"
                      value={form.customReason}
                      onChange={(e) => update("customReason", e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              </>
            )}

            {/* STEP 2: 有給・書類 */}
            {step === 2 && (
              <>
                <div className="space-y-3">
                  <Label>有給消化の希望</Label>
                  {[
                    { value: "FULL", emoji: "🌴", title: "全て消化したい", desc: "残日数を全て消化して退職" },
                    { value: "NEGOTIATE", emoji: "🤝", title: "相談して決めたい", desc: "会社と相談しながら決める" },
                    { value: "NONE", emoji: "⏩", title: "不要（すぐに退職）", desc: "有給消化なしで早期退職" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={form.paidLeave === opt.value}
                      onClick={() => update("paidLeave", opt.value as FormData["paidLeave"])}
                      emoji={opt.emoji}
                      title={opt.title}
                      desc={opt.desc}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>備品の返却方法</Label>
                  {[
                    { value: "BY_MAIL", emoji: "📦", title: "郵送で返却", desc: "会社指定の宛先に郵送" },
                    { value: "AT_DESK", emoji: "🖥️", title: "デスクに置いて退職", desc: "最終出社日にデスクへ" },
                    { value: "IN_PERSON", emoji: "🤲", title: "直接手渡し", desc: "担当者に直接お渡し" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={form.equipmentReturn === opt.value}
                      onClick={() => update("equipmentReturn", opt.value as FormData["equipmentReturn"])}
                      emoji={opt.emoji}
                      title={opt.title}
                      desc={opt.desc}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>離職票・源泉徴収票の受け取り</Label>
                  {[
                    { value: "BY_MAIL", emoji: "📮", title: "郵送で受け取りたい", desc: "自宅宛てに郵送してもらう" },
                    { value: "NONE", emoji: "🙅", title: "不要", desc: "受け取らない（次の職場で対応等）" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={form.documentDelivery === opt.value}
                      onClick={() => update("documentDelivery", opt.value as FormData["documentDelivery"])}
                      emoji={opt.emoji}
                      title={opt.title}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </>
            )}

            {/* STEP 3: あなたの情報 */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="senderName">氏名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="senderName"
                    placeholder="山田 太郎"
                    value={form.senderName}
                    onChange={(e) => update("senderName", e.target.value)}
                  />
                  <p className="text-xs text-stone-400">退職届・メールの差出人名として使用します</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">あなたのメールアドレス <span className="text-red-500">*</span></Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={form.senderEmail}
                    onChange={(e) => update("senderEmail", e.target.value)}
                  />
                  <p className="text-xs text-stone-400">このアドレスから退職通知メールを送信します（詐称はしません）</p>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                  <p className="font-semibold mb-1">⚠️ ご確認ください</p>
                  <ul className="space-y-1 list-disc list-inside text-xs">
                    <li>当サービスは「伝達」と「要約」のみを行います</li>
                    <li>条件交渉・金銭要求は一切行いません</li>
                    <li>最終的な送信はあなた自身が実行します</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ナビゲーションボタン */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 0 ? setStep((s) => s - 1) : router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 0 ? "トップに戻る" : "戻る"}
          </Button>
          <Button onClick={handleNext} disabled={!canNext() || isLoading}>
            {isLoading ? (
              "処理中..."
            ) : step === STEPS.length - 1 ? (
              <>
                送信方式を選ぶ
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                次へ
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
