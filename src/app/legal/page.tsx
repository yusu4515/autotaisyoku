import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-stone-900">オートマ退職</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">法的事項・ガードレール</h1>
          <p className="text-sm text-stone-500">
            本サービスの法的位置づけと、非弁行為リスクへの対策を説明します。
          </p>
        </div>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900 mb-1">本サービスの法的位置づけ</p>
                <p className="text-sm text-emerald-800">
                  オートマ退職は「退職意思の伝達を支援するソフトウェアツール」です。
                  弁護士法72条が規定する「法律事務の取り扱い」には該当せず、
                  非弁行為には当たらないと解釈しています。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {[
            {
              title: "弁護士法72条・27条への対応",
              emoji: "⚖️",
              items: [
                { label: "条件交渉の不介入", desc: "AIは退職意思の伝達のみを行い、金銭要求・条件合意の取り付けを自動実行しません。" },
                { label: "意思決定の主体はユーザー", desc: "送信ボタンの押下・内容の承認は必ずユーザー自身が行います。AIの自動実行は一切ありません。" },
                { label: "弁護士紹介報酬なし", desc: "専門家への紹介料授受は行いません。弁護士ドットコム・法テラス等の公的サービスへのリンク誘導のみです（弁護士法27条対応）。" },
              ],
            },
            {
              title: "なりすまし・不正利用防止",
              emoji: "🔐",
              items: [
                { label: "メールアドレスの詐称なし", desc: "当サービスのアドレスを差出人に使用することは一切ありません。必ずユーザー自身のアカウントから送信します。" },
                { label: "SMTPパスワードの即時削除", desc: "かんたんモード利用時のパスワードは、SSL暗号化のうえ送信後に即時削除します。サーバーには保存しません。" },
                { label: "認証の徹底", desc: "全ての送信操作はログイン済みユーザーのみが実行できます。" },
              ],
            },
            {
              title: "個人情報保護法への対応",
              emoji: "🛡️",
              items: [
                { label: "要配慮個人情報の取り扱い", desc: "退職届・メール内容は機微情報として扱い、暗号化保存・アクセス制限を実施します。" },
                { label: "データの自動削除", desc: "退職届・返信原文は一定期間後に自動削除します。" },
                { label: "退会時のデータ削除", desc: "ユーザーの申請により、全データを速やかに削除します。" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="flex items-center gap-2 text-base font-bold text-stone-900 mb-3">
                <span>{section.emoji}</span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-xl bg-white border border-stone-200 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{item.label}</p>
                      <p className="text-sm text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
          <h2 className="font-bold text-amber-900 mb-2">⚠️ 継続的な法的チェックについて</h2>
          <p className="text-sm text-amber-800 mb-4">
            本サービスは以下の法的事項について、継続的な確認体制を設けています。
          </p>
          <ul className="space-y-1 text-sm text-amber-800 list-disc list-inside">
            <li>弁護士法27条・72条への準拠状況</li>
            <li>Claude API利用規約（AUP）における代理送信行為の適否</li>
            <li>Stripe利用規約における業種適合性</li>
            <li>日本郵便 Webゆうびん API利用規約への適合</li>
            <li>個人情報保護法・電気通信事業法への準拠</li>
          </ul>
        </div>

        <div className="rounded-xl bg-white border border-stone-200 p-5">
          <h2 className="font-bold text-stone-900 mb-3">専門家への相談窓口</h2>
          <p className="text-xs text-stone-400 mb-3">
            ※ 当サービスはこれらの機関から紹介料を受け取っていません
          </p>
          <div className="space-y-2">
            {[
              { name: "法テラス（法律援助）", url: "https://www.houterasu.or.jp/", desc: "収入要件を満たす場合、弁護士費用の立替制度あり" },
              { name: "弁護士ドットコム", url: "https://www.bengo4.com/c_5/", desc: "労働問題専門の弁護士への無料相談" },
              { name: "総合労働相談コーナー（厚生労働省）", url: "https://www.mhlw.go.jp/", desc: "全国の労働局・ハローワークで無料相談" },
              { name: "労働基準監督署", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/", desc: "残業代未払い・不当解雇等の申告窓口" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3 hover:border-emerald-400 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">{link.name}</p>
                  <p className="text-xs text-stone-400">{link.desc}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline">トップページに戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
