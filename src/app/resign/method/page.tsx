"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Star, ShieldCheck, Copy, Lock, AlertCircle } from "lucide-react";

type SendMethod = "SMTP" | "OAUTH" | "COPY_PASTE";

const METHODS = [
  {
    id: "SMTP" as SendMethod,
    label: "かんたんモード",
    difficulty: "★☆☆ かんたん",
    emoji: "⚡",
    recommended: true,
    desc: "依頼者のメールアドレス＋パスワードを入力して送信。SSL暗号化・送信後即時削除。最も操作が少なく迷わない。",
    warning: "パスワードはSSL暗号化のうえ送信後に即時削除します。当社サーバーには保存しません。",
  },
  {
    id: "OAUTH" as SendMethod,
    label: "OAuth連携モード",
    difficulty: "★★☆ ふつう",
    emoji: "🔐",
    recommended: false,
    desc: "Gmail / Outlookアカウントと連携。パスワード不要でセキュリティも高い。Googleログインのような操作感。",
    warning: null,
  },
  {
    id: "COPY_PASTE" as SendMethod,
    label: "コピペモード",
    difficulty: "★★★ 自分で送る",
    emoji: "📋",
    recommended: false,
    desc: "AIが生成した文面をコピーしてご自身で送信。当サービスはメール送信に一切関与しません。",
    warning: null,
  },
];

function MethodPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resignationId = searchParams.get("id");

  const [method, setMethod] = useState<SendMethod>("SMTP");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sendTiming, setSendTiming] = useState<"now" | "scheduled">("now");
  const [isLoading, setIsLoading] = useState(false);

  async function handleNext() {
    if (!resignationId) return;
    setIsLoading(true);

    try {
      await fetch(`/api/resignations/${resignationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sendMethod: method,
          scheduledAt: sendTiming === "scheduled" ? scheduledAt : null,
        }),
      });
      router.push(`/resign/preview?id=${resignationId}&method=${method}`);
    } catch {
      alert("エラーが発生しました。");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-3">
            <Link href={`/resign`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="text-sm text-stone-500">STEP 2 / 3</div>
              <div className="font-semibold text-stone-900">送信方式を選ぶ</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="rounded-xl rounded-tl-none bg-white border border-stone-200 p-4 text-sm text-stone-700 shadow-sm">
            退職通知メールの送信方法を選んでください。
            <strong>かんたんモード</strong>が最もシンプルでおすすめです。
            あなた自身のアドレスから送信されるので、なりすましにもなりません 🔒
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "w-full rounded-xl border-2 p-5 text-left transition-all",
                method === m.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-stone-200 bg-white hover:border-emerald-300"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">{m.label}</span>
                    {m.recommended && (
                      <Badge className="text-xs">
                        <Star className="mr-1 h-3 w-3" />
                        おすすめ
                      </Badge>
                    )}
                    <span className="text-xs text-stone-400">{m.difficulty}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{m.desc}</p>
                  {m.warning && method === m.id && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-white border border-emerald-200 p-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <p className="text-xs text-emerald-800">{m.warning}</p>
                    </div>
                  )}
                </div>
                {method === m.id && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* SMTPパスワード入力 */}
        {method === "SMTP" && (
          <Card className="mb-6">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Lock className="h-4 w-4 text-emerald-600" />
                SMTPパスワード入力
              </div>
              <Alert variant="warn">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Gmailの場合は「アプリパスワード」を使用してください。
                  通常のGoogleパスワードではなく、2段階認証後に発行できる16桁のパスワードです。
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">メールパスワード（アプリパスワード）</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••••••••••"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                />
                <p className="text-xs text-stone-400 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  SSL暗号化済み。送信完了後に即時削除します。
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OAuth連携 */}
        {method === "OAUTH" && (
          <Card className="mb-6">
            <CardContent className="p-5 space-y-3">
              <div className="text-sm font-semibold text-stone-700">メールサービスを選択</div>
              <Button variant="outline" className="w-full justify-start gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Gmailで連携する
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M21.2 5.6v12.8c0 .9-.7 1.6-1.6 1.6H4.4c-.9 0-1.6-.7-1.6-1.6V5.6c0-.9.7-1.6 1.6-1.6h15.2c.9 0 1.6.7 1.6 1.6z" />
                  <path d="M12 13.3L3.5 7.2v9.7h17V7.2L12 13.3z" fill="white" />
                  <path d="M12 11.5L3.8 5.6h16.4L12 11.5z" fill="white" />
                </svg>
                Outlookで連携する
              </Button>
            </CardContent>
          </Card>
        )}

        {/* コピペモード */}
        {method === "COPY_PASTE" && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Copy className="mt-0.5 h-5 w-5 flex-shrink-0 text-stone-500" />
                <div className="text-sm text-stone-600">
                  <p className="font-semibold mb-1">コピペモードの流れ</p>
                  <ol className="space-y-1 text-stone-500 list-decimal list-inside">
                    <li>次の画面でAI生成文面を確認</li>
                    <li>文面をコピー</li>
                    <li>お使いのメールアプリから送信</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 送信タイミング */}
        {method !== "COPY_PASTE" && (
          <Card className="mb-6">
            <CardContent className="p-5 space-y-3">
              <div className="text-sm font-semibold text-stone-700">送信タイミング</div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSendTiming("now")}
                  className={cn(
                    "flex-1 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                    sendTiming === "now"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 text-stone-600 hover:border-emerald-300"
                  )}
                >
                  ⚡ 即時送信
                </button>
                <button
                  type="button"
                  onClick={() => setSendTiming("scheduled")}
                  className={cn(
                    "flex-1 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                    sendTiming === "scheduled"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 text-stone-600 hover:border-emerald-300"
                  )}
                >
                  📅 予約送信
                </button>
              </div>
              {sendTiming === "scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">送信日時</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? "処理中..." : (
              <>
                文面を生成する
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MethodPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <MethodPageInner />
    </Suspense>
  );
}
