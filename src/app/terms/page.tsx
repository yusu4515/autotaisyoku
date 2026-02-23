import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "第1条（サービスの目的）",
      content: `オートマ退職（以下「本サービス」）は、退職意思を持つ労働者が、退職通知メールおよび退職届の作成・送付をスムーズに行えるよう支援するツールです。

本サービスは「伝達」と「要約」のみを提供するツールであり、法律上の退職代理業務（弁護士法に規定される法律事務の取り扱い）は一切行いません。`,
    },
    {
      title: "第2条（利用条件）",
      content: `本サービスを利用するためには以下の条件を満たす必要があります。

・18歳以上であること
・日本国内の労働者であること
・本利用規約およびプライバシーポリシーに同意すること
・正確な情報を提供すること`,
    },
    {
      title: "第3条（禁止事項）",
      content: `以下の行為を禁止します。

・虚偽の情報を入力しての利用
・他人になりすましての利用（差出人メールアドレスの詐称）
・当サービスを利用した第三者への誹謗中傷・脅迫
・当サービスのシステムへの不正アクセス・改ざん
・当サービスを通じた会社との条件交渉・金銭要求を目的とした利用
・当サービスの逆エンジニアリング・無断転載
・利用規約に違反するその他の行為`,
    },
    {
      title: "第4条（サービスの性質と限界）",
      content: `【本サービスが提供すること】
・入力情報に基づくAI退職通知メールの自動生成
・退職届（内容証明フォーマット）の自動生成
・受信メールの感情フィルタリングと事実要約
・法的キーワードの検知と一般的な情報提供

【本サービスが提供しないこと】
・会社との条件交渉・折衝の代理
・退職条件（退職金・有給消化日数等）の確定
・法律相談・法的助言
・退職後の手続きの代行
・弁護士や専門家への事件の仲介（紹介報酬なし）

退職が複雑な法的問題を伴う場合（未払い賃金・ハラスメント等）は、弁護士等の専門家にご相談ください。`,
    },
    {
      title: "第5条（料金・支払い）",
      content: `本サービスの利用料金は¥3,000（税込）の買い切り型です。

・決済はStripeを通じてクレジットカード・コンビニ払い・銀行振込で行えます
・支払い完了後にメール送信機能が有効になります
・サービスの性質上、一度送信が完了した場合の返金はお断りしています
・AI文面生成・コピペモードは支払い前に試すことができます`,
    },
    {
      title: "第6条（個人情報の取り扱い）",
      content: `個人情報の取り扱いは、別途定めるプライバシーポリシーに従います。

特に以下の点を重要事項として確認してください。

・かんたんモードで入力したパスワードは、送信完了後に即時削除します
・退職通知メール・退職届の内容は送信完了後6ヶ月で自動削除します
・当サービスのメールアドレスを差出人として使用することはありません`,
    },
    {
      title: "第7条（免責事項）",
      content: `当サービスは以下について責任を負いません。

・AI生成文面の内容・品質・法的効力
・メール送信の到達・開封の確保
・退職交渉の結果（受理・拒否・引き止め等）
・退職に起因する雇用関係上のトラブル
・Stripe・Gmail API・日本郵便等の外部サービス障害
・ユーザーが入力した情報の誤りに起因するトラブル
・当サービス外で行われたやり取り・判断

本サービスはあくまで「伝達を助けるツール」です。最終的な判断と責任はユーザー自身が負います。`,
    },
    {
      title: "第8条（サービスの変更・終了）",
      content: `当サービスは、事前の通知なくサービスの内容を変更・停止・終了することがあります。

サービス終了の場合は、事前にメールでお知らせし、保存データのエクスポート期間を設けます。`,
    },
    {
      title: "第9条（準拠法・管轄）",
      content: `本利用規約は日本法に準拠します。本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。`,
    },
    {
      title: "第10条（利用規約の改定）",
      content: `当サービスは本利用規約を改定することがあります。重要な変更の場合は、サービス内またはメールにて事前に通知します。

改定後も継続してサービスを利用した場合、改定内容に同意したものとみなします。`,
    },
  ];

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

      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">利用規約</h1>
        <p className="text-sm text-stone-400 mb-8">最終更新日：2025年1月1日</p>

        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <strong>⚠️ 重要事項</strong>：本サービスは退職意思の「伝達ツール」です。法律上の退職代行業務（弁護士法72条が規定する法律事務）は一切行いません。
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-stone-900 mb-3 border-l-4 border-emerald-500 pl-3">
                {section.title}
              </h2>
              <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap bg-white rounded-xl border border-stone-200 p-5">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="outline">トップページに戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
