import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 事業者情報",
      content: `本プライバシーポリシーは、オートマ退職（以下「当サービス」）が提供するサービスにおける個人情報の取り扱いについて定めるものです。`,
    },
    {
      title: "2. 収集する個人情報",
      content: `当サービスは、以下の個人情報を収集します。

【登録情報】
・メールアドレス
・氏名（任意）
・パスワード（ハッシュ化して保存）

【退職手続き情報】
・退職希望日・最終出社日
・勤務先会社名・担当者名・連絡先メールアドレス
・有給消化希望・備品返却方法等の設定
・AI生成退職通知メール文面
・AI生成退職届文面

【通信情報】
・会社から受信した返信メールの内容（感情フィルタリング処理のため）

【決済情報】
・クレジットカード情報はStripeが直接収集・管理します。当サービスはカード番号等を保持しません。

【利用ログ】
・アクセスログ（IPアドレス、ブラウザ情報等）`,
    },
    {
      title: "3. 利用目的",
      content: `収集した個人情報は以下の目的で利用します。

・退職通知メール・退職届の自動生成
・メール送信機能の提供
・返信メールの感情フィルタリング・要約
・決済処理
・サービス改善・障害対応
・法令に基づく対応`,
    },
    {
      title: "4. 第三者提供",
      content: `当サービスは、以下の場合を除き、個人情報を第三者に提供しません。

・法令に基づく場合
・人の生命・身体・財産の保護のために必要な場合
・公衆衛生の向上または児童の健全な育成に必要な場合

【業務委託先（処理目的の範囲内のみ共有）】
・Anthropic（Claude API）：AI文面生成・感情フィルタリング処理
・Stripe：決済処理
・Google（Gmail API）：OAuth連携メール送信（利用者が選択した場合のみ）
・Railway：サービスのホスティング・データベース管理`,
    },
    {
      title: "5. データ保存期間と削除",
      content: `【メールアドレス・パスワード等の基本情報】
退会申請から30日以内に削除します。

【退職通知メール・退職届の内容】
メール送信完了後6ヶ月で自動削除します。ユーザーは任意のタイミングで削除を申請できます。

【受信返信メールの原文】
感情フィルタリング処理後、原文は3ヶ月で自動削除します。

【かんたんモード（SMTP）のパスワード】
メール送信完了後に即時削除します。当サービスのサーバーには保存しません。

【送信ログ（タイムスタンプ）】
法的証拠として利用可能なよう、退職日から1年間保存します。`,
    },
    {
      title: "6. セキュリティ",
      content: `当サービスは、個人情報の安全管理のため以下の措置を講じます。

・通信の暗号化（TLS/SSL）
・パスワードのハッシュ化保存（bcrypt）
・データベースの暗号化
・アクセス制限・ログ監視
・かんたんモードでのパスワード即時削除`,
    },
    {
      title: "7. Cookie・解析ツール",
      content: `当サービスは、認証セッションの維持のためCookieを使用します。

Google Analytics等の解析ツールは現時点では使用していません。将来的に導入する場合は、本ポリシーを改定の上、事前に通知します。`,
    },
    {
      title: "8. ユーザーの権利",
      content: `ユーザーは以下の権利を有します。

・個人情報の開示・訂正・削除の請求
・利用停止・提供停止の請求
・退会とデータ削除の申請

上記のご要望は、サービス内の「アカウント設定」またはお問い合わせフォームよりご連絡ください。法令に基づく例外事由がない限り、速やかに対応します。`,
    },
    {
      title: "9. 未成年者の利用",
      content: `当サービスは18歳以上の方を対象としています。18歳未満の方のご利用はご遠慮ください。`,
    },
    {
      title: "10. プライバシーポリシーの改定",
      content: `当サービスは、法令改正やサービス変更に伴い本ポリシーを改定することがあります。重要な変更の場合は、サービス内でのお知らせまたはメールにて事前に通知します。`,
    },
    {
      title: "11. お問い合わせ",
      content: `個人情報の取り扱いに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。`,
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
        <h1 className="text-2xl font-bold text-stone-900 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-stone-400 mb-8">最終更新日：2025年1月1日</p>

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
