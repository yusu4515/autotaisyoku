"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Pencil, CheckCircle, AlertCircle } from "lucide-react";

function PostalPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resignationId = searchParams.get("id");

  const [isSending, setIsSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);

  const [postal, setPostal] = useState({
    companyName: "",
    companyAddress: "",
    recipientName: "代表取締役",
    senderName: "",
    senderAddress: "",
    senderPostalCode: "",
    deliveryType: "CERTIFIED_MAIL", // 内容証明＋配達証明
  });

  function updatePostal(key: keyof typeof postal, value: string) {
    setPostal((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSend() {
    if (!confirmed) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/postal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resignationId, ...postal }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      router.push(`/dashboard?postal=true&tracking=${data.trackingId}`);
    } catch {
      alert("郵送手続きに失敗しました。もう一度お試しください。");
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-sm text-stone-500">郵送確認画面</div>
              <div className="font-semibold text-stone-900">退職届の郵送手配</div>
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
            郵送先と差出人の情報を確認してください。
            内容証明郵便＋配達証明で送るので、法的な証拠として残ります。鉛筆アイコンで編集できます 📝
          </div>
        </div>

        {/* 郵送種別 */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">内容証明郵便＋配達証明</span>
            </div>
            <p className="mt-1 text-xs text-emerald-700">
              送付した内容と日時が法的に証明される最も信頼性の高い郵送方式です。
            </p>
          </CardContent>
        </Card>

        {/* 送付先情報 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">送付先情報</CardTitle>
              <Badge variant="warn" className="text-xs">要確認</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "companyName", label: "会社名", placeholder: "株式会社○○" },
              { key: "companyAddress", label: "会社住所", placeholder: "〒000-0000 東京都○○区..." },
              { key: "recipientName", label: "担当者名", placeholder: "代表取締役" },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-stone-500">{field.label}</Label>
                  <button
                    type="button"
                    onClick={() => setEditField(editField === field.key ? null : field.key)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                {editField === field.key ? (
                  <Input
                    placeholder={field.placeholder}
                    value={postal[field.key as keyof typeof postal]}
                    onChange={(e) => updatePostal(field.key as keyof typeof postal, e.target.value)}
                    autoFocus
                    className="border-red-300 ring-1 ring-red-300"
                  />
                ) : (
                  <div
                    className={`rounded-lg border px-4 py-2.5 text-sm cursor-pointer hover:bg-stone-50 ${
                      !postal[field.key as keyof typeof postal]
                        ? "border-red-300 bg-red-50 text-red-400"
                        : "border-stone-200 text-stone-900"
                    }`}
                    onClick={() => setEditField(field.key)}
                  >
                    {postal[field.key as keyof typeof postal] || `${field.label}を入力してください`}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 差出人情報 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">差出人情報（あなたの情報）</CardTitle>
              <Badge variant="warn" className="text-xs">要確認</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "senderName", label: "氏名", placeholder: "山田 太郎" },
              { key: "senderPostalCode", label: "郵便番号", placeholder: "000-0000" },
              { key: "senderAddress", label: "住所", placeholder: "東京都○○区..." },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-stone-500">{field.label}</Label>
                  <button
                    type="button"
                    onClick={() => setEditField(editField === field.key ? null : field.key)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                {editField === field.key ? (
                  <Input
                    placeholder={field.placeholder}
                    value={postal[field.key as keyof typeof postal]}
                    onChange={(e) => updatePostal(field.key as keyof typeof postal, e.target.value)}
                    autoFocus
                    className="border-red-300 ring-1 ring-red-300"
                  />
                ) : (
                  <div
                    className={`rounded-lg border px-4 py-2.5 text-sm cursor-pointer hover:bg-stone-50 ${
                      !postal[field.key as keyof typeof postal]
                        ? "border-red-300 bg-red-50 text-red-400"
                        : "border-stone-200 text-stone-900"
                    }`}
                    onClick={() => setEditField(field.key)}
                  >
                    {postal[field.key as keyof typeof postal] || `${field.label}を入力してください`}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Alert variant="warn">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>この内容で間違いありませんか？</strong>
            宛先・氏名・住所に誤りがあると郵便が届かない場合があります。
            赤枠のフィールドは必ず入力してください。
          </AlertDescription>
        </Alert>

        {/* 確認チェックボックス */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span className="text-sm text-stone-700">
            送付先・差出人情報に誤りがないことを確認しました。
            内容証明郵便として郵送することに同意します。
          </span>
        </label>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <Button
            className="flex-1"
            onClick={handleSend}
            disabled={!confirmed || isSending || !postal.companyName || !postal.companyAddress || !postal.senderName || !postal.senderAddress}
          >
            {isSending ? (
              "手配中..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                この内容で郵送する
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PostalPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <PostalPageInner />
    </Suspense>
  );
}
