"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Sparkles, Loader2, AlertCircle } from "lucide-react";

function AddReplyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resignationId = searchParams.get("id");

  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [subject, setSubject] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resignationId) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summarize-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resignationId,
          rawContent,
          fromEmail,
          fromName,
          subject,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送信失敗");
      }

      router.push(`/dashboard?id=${resignationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard?id=${resignationId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="font-semibold text-stone-900">返信メールを登録</div>
              <div className="text-xs text-stone-400">AIが感情を除去して要約します</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8 space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="rounded-xl rounded-tl-none bg-white border border-stone-200 p-4 text-sm text-stone-700 shadow-sm">
            会社から返信が来たら、メール本文をここに貼り付けてください。
            AIが怒り・嫌み・引き止めを全て除去して、
            <strong>「何をすればいいか」だけ</strong>を教えてくれます 😊
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">返信メールの情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">送信者メールアドレス</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    placeholder="hr@company.co.jp"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">送信者名（任意）</Label>
                  <Input
                    id="fromName"
                    placeholder="田中 部長"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">件名</Label>
                <Input
                  id="subject"
                  placeholder="Re: 退職のご連絡"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rawContent">
                  メール本文（コピー＆ペースト）
                </Label>
                <Textarea
                  id="rawContent"
                  placeholder="会社から届いたメールの本文をそのまま貼り付けてください。感情的な内容でも構いません。AIが安全に処理します。"
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
                <p className="text-xs text-stone-400">
                  ※ 原文はデフォルト非表示で、別途同意後のみ閲覧できます
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <p className="text-xs text-emerald-800">
                    AIが自動的に以下を処理します：
                    <span className="block mt-1 space-y-0.5">
                      <span className="block">・怒り・嫌み・引き止めの感情的表現を除去</span>
                      <span className="block">・日付・金額・期限・固有名詞を保持</span>
                      <span className="block">・「何をすべきか」を箇条書きで整理</span>
                      <span className="block">・「損害賠償」「訴訟」等のキーワードを検知</span>
                    </span>
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !rawContent || !fromEmail || !subject}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AIが感情フィルタリング中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    感情を除去して要約する
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AddReplyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <AddReplyInner />
    </Suspense>
  );
}
