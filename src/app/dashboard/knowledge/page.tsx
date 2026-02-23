"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const KNOWLEDGE_ARTICLES = [
  {
    category: "退職の権利",
    emoji: "⚖️",
    articles: [
      {
        id: "resign_right",
        title: "退職は労働者の権利です",
        summary: "会社に引き止められても、退職は法律で認められた権利です。",
        body: `民法627条により、期間の定めのない雇用契約の場合、2週間前に申告すれば退職できます。

【ポイント】
• 会社の承認は不要。意思表示した時点から2週間後に退職できる
• 「就業規則に1ヶ月前」と書いてあっても、民法が優先される（諸説あり）
• 有期雇用の場合は「やむを得ない事由」が必要

退職を拒否されても、法的には2週間後に退職できます。`,
        keywords: ["民法627条", "退職の自由"],
        link: "https://www.mhlw.go.jp/",
      },
      {
        id: "paid_leave",
        title: "有給休暇は全て取れる？",
        summary: "残っている有給は原則として全て消化できます。",
        body: `有給休暇は労働者の権利です。退職時に残っている有給を消化することは合法です。

【ポイント】
• 会社は時季変更権を持つが、退職直前は実質的に行使できない
• 「有給は使わせない」は違法
• 有給の買取は法的義務ではないが、会社が任意で行うことはOK

【実務的なアドバイス】
退職日を「有給消化後の日付」に設定し、最終出社日以降は有給消化として申請するのが一般的です。`,
        keywords: ["有給休暇", "時季変更権"],
        link: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/jikan/yukyu.html",
      },
    ],
  },
  {
    category: "脅しへの対応",
    emoji: "🛡️",
    articles: [
      {
        id: "damage_claim",
        title: "「損害賠償を請求する」と言われたら",
        summary: "退職による損害賠償請求は原則として認められません。",
        body: `会社が退職を理由に損害賠償を請求することは、非常に困難です。

【法的根拠】
• 労働者の退職は民法上の権利行使であり、権利行使による損害は「損害」にならない
• 「人手不足になった」「採用コストがかかった」は損害賠償の対象外
• 研修費の返還請求も、労働基準法16条の「違約金予定禁止」に抵触する場合あり

【例外ケース】
• 引き抜き（競合他社への転職）に伴う営業秘密漏洩
• 在職中の横領・背任などの不法行為

まずは弁護士に相談することをおすすめします。`,
        keywords: ["損害賠償", "労働基準法16条"],
        link: "https://www.bengo4.com/c_5/",
      },
      {
        id: "disciplinary",
        title: "「懲戒解雇にする」と言われたら",
        summary: "退職の意思表示を理由にした懲戒解雇は無効になる可能性が高いです。",
        body: `退職を申し出たことを理由とした懲戒解雇は、解雇権濫用として無効となる可能性が高いです。

【ポイント】
• 懲戒解雇には「就業規則に定めがある懲戒事由」が必要
• 「退職申し出」は通常、懲戒事由には該当しない
• 退職前に懲戒解雇すると、退職金不支給・失業給付への影響が出る可能性があるが、それ自体が無効になり得る

「懲戒解雇にする」は脅し文句として使われることが多く、実際に行使されることは稀です。
脅された場合は証拠を保全し、弁護士に相談することをおすすめします。`,
        keywords: ["懲戒解雇", "解雇権濫用"],
        link: "https://www.bengo4.com/c_5/",
      },
      {
        id: "lawsuit",
        title: "「訴訟を起こす」と言われたら",
        summary: "退職に対する訴訟は法的に認められにくく、実際に起こすケースは少ないです。",
        body: `「訴える」「弁護士に相談する」という脅し文句は、退職引き止めの常套手段です。

【実態】
• 退職者に対して訴訟を提起するケースは極めて稀
• 訴訟コスト（弁護士費用・時間）が見込まれる賠償額を超えることが多い
• 実際に提訴されても、前述の通り損害賠償請求は認められにくい

【もし訴訟を起こされた場合】
法テラスへの無料相談（収入要件あり）や、弁護士ドットコムの弁護士への相談をご検討ください。
いずれも当サービスとの紹介料関係は一切ありません。`,
        keywords: ["訴訟", "法的措置"],
        link: "https://www.houterasu.or.jp/",
      },
    ],
  },
  {
    category: "退職後の手続き",
    emoji: "📋",
    articles: [
      {
        id: "social_insurance",
        title: "社会保険の切替",
        summary: "退職後は14日以内に健康保険・年金の切替が必要です。",
        body: `退職後は速やかに社会保険の切替手続きが必要です。

【健康保険の選択肢】
1. 国民健康保険：市区町村で手続き。退職後14日以内
2. 任意継続保険：退職後20日以内に申請。最大2年間、在職中と同じ保険料の2倍
3. 家族の扶養：年収130万円未満の見込みなら家族の扶養に入れる場合あり

【年金】
会社員（第2号被保険者）→ 国民年金（第1号被保険者）への切替が必要。
市区町村役場で手続き。退職後14日以内が望ましい。`,
        keywords: ["健康保険", "国民年金"],
        link: "https://www.mhlw.go.jp/",
      },
    ],
  },
];

export default function KnowledgePage() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
              <div className="font-semibold text-stone-900">退職ナレッジベース</div>
              <div className="text-xs text-stone-400">退職に関する法的知識をわかりやすく解説</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="rounded-xl rounded-tl-none bg-white border border-stone-200 p-4 text-sm text-stone-700 shadow-sm">
            退職に関する法的な知識をまとめました。
            会社から何か言われたときの参考にしてください。
            ※ 本内容は一般的な情報提供であり、法的助言ではありません。
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
          <strong>免責事項：</strong>
          本コンテンツは一般的な情報提供を目的としており、個別の法的助言ではありません。
          具体的な問題については弁護士等の専門家にご相談ください。
          当サービスは専門家への紹介料を受け取りません。
        </div>

        {KNOWLEDGE_ARTICLES.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{cat.emoji}</span>
              <h2 className="text-lg font-bold text-stone-900">{cat.category}</h2>
            </div>

            <div className="space-y-3">
              {cat.articles.map((article) => {
                const isOpen = expanded === article.id;
                return (
                  <Card key={article.id}>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpanded(isOpen ? null : article.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-sm font-bold text-stone-900">
                              {article.title}
                            </CardTitle>
                            <p className="mt-1 text-xs text-stone-500">{article.summary}</p>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0 text-stone-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-stone-400" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {article.keywords.map((kw) => (
                            <Badge key={kw} variant="secondary" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                    </button>

                    {isOpen && (
                      <CardContent className="pt-0 pb-5 animate-fadeInUp">
                        <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                          <pre className="whitespace-pre-wrap text-sm text-stone-700 leading-relaxed font-sans">
                            {article.body}
                          </pre>
                        </div>
                        {article.link && (
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
                          >
                            公式・参考サイトで詳しく確認する
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <p className="font-semibold text-emerald-900 mb-2">🤝 専門家への相談</p>
            <p className="text-xs text-emerald-800 mb-3">
              より詳しいアドバイスが必要な場合は、公的サービスへの相談をおすすめします。
            </p>
            <div className="space-y-2">
              {[
                { name: "法テラス（無料法律相談）", url: "https://www.houterasu.or.jp/", desc: "収入要件あり" },
                { name: "弁護士ドットコム", url: "https://www.bengo4.com/c_5/", desc: "弁護士への無料相談" },
                { name: "総合労働相談コーナー（厚労省）", url: "https://www.mhlw.go.jp/", desc: "労働問題全般" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-white border border-emerald-200 px-3 py-2.5 hover:border-emerald-400 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">{link.name}</p>
                    <p className="text-xs text-stone-400">{link.desc}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-500" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
