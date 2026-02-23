"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Copy, CheckCircle, Loader2, RefreshCw, AlertCircle } from "lucide-react";

function PreviewPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resignationId = searchParams.get("id");
  const method = searchParams.get("method");

  const [isGenerating, setIsGenerating] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [letterBody, setLetterBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resignationId) return;
    generateEmail();
  }, [resignationId]);

  async function generateEmail() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resignationId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmailSubject(data.subject);
      setEmailBody(data.body);
      setLetterBody(data.letter);
    } catch {
      setError("文面の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`件名: ${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSend() {
    if (!resignationId) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resignationId,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      if (!res.ok) throw new Error();
      router.push(`/dashboard?sent=true&id=${resignationId}`);
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
      setIsSending(false);
    }
  }

  async function handleStripeCheckout() {
    if (!resignationId) return;
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resignationId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-sm text-stone-500">STEP 3 / 3</div>
              <div className="font-semibold text-stone-900">AI生成文面を確認する</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* 先輩の励まし */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="rounded-xl rounded-tl-none bg-white border border-stone-200 p-4 text-sm text-stone-700 shadow-sm">
            AIが「角の立たない」退職通知メールを生成しました。
            内容を確認して、必要であれば修正してください。問題なければ送信ボタンを押すだけです！
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isGenerating ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-stone-500">AIが退職通知メールを生成中です...</p>
                <p className="text-sm text-stone-400">「角の立たない」文面を考えています 🤖</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* メール文面 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">退職通知メール</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateEmail}
                    title="再生成"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <><CheckCircle className="mr-1 h-4 w-4 text-emerald-600" />コピー済み</>
                    ) : (
                      <><Copy className="mr-1 h-4 w-4" />コピー</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-400 uppercase">件名</span>
                    <Badge variant="secondary" className="text-xs">編集可</Badge>
                  </div>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-400 uppercase">本文</span>
                    <Badge variant="secondary" className="text-xs">編集可</Badge>
                  </div>
                  <Textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="min-h-[300px] bg-stone-50 font-mono text-sm leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 退職届プレビュー */}
            {letterBody && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">退職届（内容証明フォーマット）</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-stone-50 border border-stone-200 p-5">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-stone-700 leading-relaxed">
                      {letterBody}
                    </pre>
                  </div>
                  <p className="mt-3 text-xs text-stone-400">
                    ※ 次の画面で郵送先情報を確認・編集できます
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 法的ガードレール注意書き */}
            <Alert>
              <AlertCircle className="h-4 w-4 text-stone-500" />
              <AlertDescription className="text-xs text-stone-600">
                本サービスは退職意思の「伝達」のみを行います。条件交渉・金銭要求は含まれていません。
                最終的な送信判断はあなた自身が行います。
              </AlertDescription>
            </Alert>

            {/* 送信ボタン */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-stone-900 mb-4">
                  ✅ 内容を確認しましたか？
                </p>

                {method === "COPY_PASTE" ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCopy}
                      variant={copied ? "secondary" : "default"}
                    >
                      {copied ? (
                        <><CheckCircle className="mr-2 h-5 w-5" />コピーしました！</>
                      ) : (
                        <><Copy className="mr-2 h-5 w-5" />文面をコピーする</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-stone-500">
                      コピー後、お使いのメールアプリに貼り付けて送信してください
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard?id=${resignationId}`)}
                    >
                      ダッシュボードへ進む
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleStripeCheckout}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" />送信中...</>
                      ) : (
                        <><Send className="mr-2 h-5 w-5" />¥3,000 支払って送信する</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-stone-500">
                      Stripeの安全な決済画面に移動します
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 郵送オプション */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📮</span>
                  <div>
                    <p className="font-semibold text-stone-900 mb-1">退職届の郵送（内容証明）もしますか？</p>
                    <p className="text-sm text-stone-500 mb-3">
                      メールに加えて内容証明郵便を送ることで、法的な証拠力が高まります。
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/resign/postal?id=${resignationId}`)}
                    >
                      郵送手続きへ進む
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <PreviewPageInner />
    </Suspense>
  );
}
