"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Circle, ExternalLink, Clock } from "lucide-react";

const CHECKLIST_ITEMS = [
  {
    category: "退職直後",
    emoji: "🏃",
    timing: "退職日当日〜翌日",
    items: [
      {
        id: "health_insurance",
        title: "健康保険の切替手続き",
        desc: "退職後は14日以内に国民健康保険への加入、または任意継続保険の申請が必要です。",
        detail: "任意継続：退職後20日以内に申請。最長2年間、在職中と同じ保険に加入可能。国保：市区町村役場で手続き。",
        link: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/",
        priority: "high",
      },
      {
        id: "pension",
        title: "年金の種別変更（第2号→第1号）",
        desc: "会社員から個人に変わるため、年金の種類が変わります。市区町村役場で手続きを。",
        detail: "退職後14日以内に市区町村役場で国民年金への加入手続きが必要です。",
        link: "https://www.nenkin.go.jp/",
        priority: "high",
      },
    ],
  },
  {
    category: "退職後すぐ",
    emoji: "📋",
    timing: "退職後1〜2週間",
    items: [
      {
        id: "unemployment",
        title: "失業給付申請（ハローワーク）",
        desc: "離職票を受け取ったら、ハローワークで失業給付の申請をしましょう。",
        detail: "自己都合退職：3ヶ月の給付制限あり。会社都合退職：即日受給可能。離職票が必要。",
        link: "https://www.hellowork.mhlw.go.jp/",
        priority: "high",
      },
      {
        id: "source_of_income",
        title: "源泉徴収票の受け取り確認",
        desc: "退職月の給与明細と源泉徴収票を保管してください。確定申告に必要です。",
        detail: "会社は退職後1ヶ月以内に源泉徴収票を発行する義務があります。",
        link: null,
        priority: "medium",
      },
      {
        id: "my_number",
        title: "マイナンバーカード確認",
        desc: "各種手続きに必要です。カードの有効期限と暗証番号を確認しておきましょう。",
        detail: null,
        link: null,
        priority: "low",
      },
    ],
  },
  {
    category: "翌年の手続き",
    emoji: "📅",
    timing: "翌年2〜3月",
    items: [
      {
        id: "tax_return",
        title: "確定申告",
        desc: "退職した年は自分で確定申告が必要です。源泉徴収票をもとに申告します。",
        detail: "e-Taxでオンライン申告が便利です。還付金が返ってくる場合がほとんど。",
        link: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/",
        priority: "high",
      },
      {
        id: "residence_tax",
        title: "住民税の支払い",
        desc: "退職翌年は前年の所得に対する住民税を自分で支払う必要があります。",
        detail: "一括払い or 4回払い。退職時に役場から通知が来ます。",
        link: null,
        priority: "medium",
      },
    ],
  },
];

export default function ChecklistPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalItems = CHECKLIST_ITEMS.flatMap((c) => c.items).length;
  const completedCount = completed.size;
  const progress = Math.round((completedCount / totalItems) * 100);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="font-semibold text-stone-900">退職後チェックリスト</div>
              <div className="text-xs text-stone-400">必要な手続きを時系列でご案内します</div>
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
            退職後も色々な手続きがありますが、一つずつやれば大丈夫！
            期限のあるものから順番にこなしていきましょう 💪
          </div>
        </div>

        {/* 進捗 */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-stone-900">完了状況</span>
              <span className="text-sm font-bold text-emerald-600">{completedCount} / {totalItems} 完了</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-3">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <p className="mt-3 text-sm font-semibold text-emerald-700 text-center">
                🎉 全ての手続きが完了しました！お疲れさまでした！
              </p>
            )}
          </CardContent>
        </Card>

        {/* チェックリスト */}
        {CHECKLIST_ITEMS.map((category) => (
          <div key={category.category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{category.emoji}</span>
              <div>
                <h2 className="font-bold text-stone-900">{category.category}</h2>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock className="h-3 w-3" />
                  {category.timing}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {category.items.map((item) => {
                const isDone = completed.has(item.id);
                const isExpanded = expanded === item.id;

                return (
                  <Card
                    key={item.id}
                    className={`transition-all ${isDone ? "opacity-60" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleComplete(item.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-stone-300 hover:text-emerald-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={`font-semibold text-sm cursor-pointer ${isDone ? "line-through text-stone-400" : "text-stone-900"}`}
                              onClick={() => setExpanded(isExpanded ? null : item.id)}
                            >
                              {item.title}
                            </div>
                            <Badge
                              variant={
                                item.priority === "high"
                                  ? "destructive"
                                  : item.priority === "medium"
                                  ? "warn"
                                  : "secondary"
                              }
                              className="text-xs flex-shrink-0"
                            >
                              {item.priority === "high" ? "急ぎ" : item.priority === "medium" ? "推奨" : "任意"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-stone-500 leading-relaxed">{item.desc}</p>

                          {isExpanded && (
                            <div className="mt-3 space-y-2 animate-fadeInUp">
                              {item.detail && (
                                <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 text-xs text-stone-600 leading-relaxed">
                                  {item.detail}
                                </div>
                              )}
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                                >
                                  公式サイトで確認 <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : item.id)}
                            className="mt-2 text-xs text-stone-400 hover:text-stone-600"
                          >
                            {isExpanded ? "閉じる" : "詳しく見る"}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* 専門家相談 */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <p className="font-semibold text-amber-900 mb-2">💡 困ったら専門家に相談を</p>
            <p className="text-xs text-amber-800 mb-3">
              退職後の手続きや労働問題でお困りの場合は、以下の公的サービスをご利用ください。
              当サービスから紹介料は一切受け取っていません。
            </p>
            <div className="space-y-2">
              {[
                { name: "法テラス（法律援助）", url: "https://www.houterasu.or.jp/" },
                { name: "弁護士ドットコム", url: "https://www.bengo4.com/" },
                { name: "ハローワーク（雇用保険）", url: "https://www.hellowork.mhlw.go.jp/" },
                { name: "労働基準監督署", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm text-amber-800 hover:border-amber-400 transition-colors"
                >
                  {link.name}
                  <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
