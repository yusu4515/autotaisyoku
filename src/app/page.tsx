import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  Lock,
  Heart,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-stone-50">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-lg font-bold text-stone-900">オートマ退職</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">無料で始める</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <Badge className="mb-6 text-sm px-4 py-1.5">
          <Sparkles className="mr-1 h-3.5 w-3.5" />
          AI退職支援サービス
        </Badge>

        <div className="mb-6 text-6xl">😌</div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-stone-900 md:text-5xl">
          退職を伝えるのが
          <br />
          <span className="text-emerald-600">こわい</span>、そんなあなたへ。
        </h1>

        <p className="mx-auto mb-4 max-w-xl text-lg text-stone-600 leading-relaxed">
          AIが退職通知メールと退職届を自動生成。
          <br />
          感情的なやり取りを一切せず、事務的に退職を完了させます。
        </p>

        <div className="mb-8 text-stone-500 text-sm">
          ※ 電話退職代行の相場2〜5万円に対して、
          <span className="font-bold text-emerald-600 text-base"> ¥3,000</span>
          の買い切り
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 h-auto">
              今すぐ退職を始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-4 h-auto">
              使い方を見る
            </Button>
          </Link>
        </div>
      </section>

      {/* 先輩キャラクターの吹き出し */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
              👩‍💼
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-2">優しい先輩より</p>
              <p className="text-stone-700 leading-relaxed">
                「辞めたいけど言い出せない…」そんな気持ち、すごくわかります。
                でも大丈夫。退職は労働者の権利。私が代わりに、
                <strong>角が立たない丁寧なメールと退職届</strong>
                を作りますね。あとはボタンを押すだけでOKです。😊
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方ステップ */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold text-stone-900">使い方は超かんたん</h2>
          <p className="mb-12 text-center text-stone-500">4ステップで退職完了</p>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: "✏️",
                title: "ポチポチ入力",
                desc: "退職日・有給消化などをタップで選ぶだけ。文章を書く必要ゼロ。",
              },
              {
                step: "02",
                icon: "🤖",
                title: "AI文面生成",
                desc: "Claudeが「角の立たない」退職通知メールと退職届を自動生成。",
              },
              {
                step: "03",
                icon: "📤",
                title: "確認して送信",
                desc: "内容を確認したら、あなたのメールアドレスから直接送信。",
              },
              {
                step: "04",
                icon: "😮‍💨",
                title: "返信は要約で確認",
                desc: "会社からの返信を感情除去して「何をすればいいか」だけ提示。",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                  {item.icon}
                </div>
                <div className="mb-1 text-xs font-bold text-emerald-600">STEP {item.step}</div>
                <h3 className="mb-2 font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold text-stone-900">主な機能</h2>
          <p className="mb-12 text-center text-stone-500">精神的な負担をゼロにする機能設計</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Mail className="h-6 w-6 text-emerald-600" />,
                title: "AI退職通知メール生成",
                desc: "入力データをもとに、誠実かつ法的に有効な退職通知メールを自動生成。",
              },
              {
                icon: <FileText className="h-6 w-6 text-emerald-600" />,
                title: "退職届（内容証明）作成",
                desc: "法的効力の高い内容証明フォーマットの退職届を自動生成・郵送手配。",
              },
              {
                icon: <Heart className="h-6 w-6 text-emerald-600" />,
                title: "感情フィルタリング",
                desc: "会社の返信から怒り・嫌み・引き止めを除去。「何をすべきか」だけ表示。",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
                title: "法的キーワード検知",
                desc: "「損害賠償」「訴訟」などのキーワードを検出して解説カードを自動表示。",
              },
              {
                icon: <Clock className="h-6 w-6 text-emerald-600" />,
                title: "退職後チェックリスト",
                desc: "健保切替・失業給付・確定申告まで、退職後の手続きを時系列でリマインド。",
              },
              {
                icon: <Lock className="h-6 w-6 text-emerald-600" />,
                title: "セキュリティ設計",
                desc: "パスワードは送信後即時削除。メール原文は暗号化保存。プライバシー最優先。",
              },
            ].map((feature, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-bold text-stone-900">{feature.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-stone-900">シンプルな料金</h2>
          <p className="mb-12 text-stone-500">面倒なサブスクなし。1回払いで完結。</p>

          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-8 shadow-lg">
            <Badge className="mb-4">買い切り型</Badge>
            <div className="mb-2 text-5xl font-bold text-stone-900">
              ¥3,000
              <span className="text-xl font-normal text-stone-500">（税込）</span>
            </div>
            <p className="mb-8 text-stone-500">電話退職代行の1/10以下の価格</p>

            <div className="mb-8 space-y-3 text-left">
              {[
                "AI退職通知メール生成",
                "退職届（内容証明フォーマット）作成",
                "3種類の送信方式（SMTP/OAuth/コピペ）",
                "感情フィルタリング機能",
                "法的キーワード検知・解説カード",
                "退職後チェックリスト",
                "送信ログ証明書",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span className="text-stone-700">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/register">
              <Button size="lg" className="w-full text-base py-4 h-auto">
                今すぐ退職を完了させる
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-stone-400">
            Stripeによる安全な決済。クレジットカード・コンビニ・銀行振込対応。
          </p>
        </div>
      </section>

      {/* 法的ガードレール */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold text-stone-900">安心の設計</h2>
          <p className="mb-8 text-center text-stone-500">法的リスクを徹底的に排除しています</p>

          <div className="space-y-4">
            {[
              {
                title: "弁護士法に準拠",
                desc: "条件交渉・金銭要求はAIに一切させません。「伝達」と「要約」に徹します。",
              },
              {
                title: "メールアドレスの詐称なし",
                desc: "当サービスのアドレスを差出人に使用しません。必ずご本人のアカウントから送信します。",
              },
              {
                title: "パスワードは即時削除",
                desc: "かんたんモードでのパスワードはSSL暗号化後に送信完了と同時に削除。保存しません。",
              },
              {
                title: "弁護士紹介報酬なし",
                desc: "専門家への紹介料授受は行いません。公的サービスへのリンク誘導のみです。",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-white border border-stone-200 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                <div>
                  <div className="font-semibold text-stone-900">{item.title}</div>
                  <div className="text-sm text-stone-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-4 text-5xl">🚀</div>
          <h2 className="mb-4 text-3xl font-bold">今日、退職の第一歩を踏み出そう。</h2>
          <p className="mb-8 text-emerald-100">
            AIが全てのストレスを引き受けます。あなたはボタンを押すだけ。
          </p>
          <Link href="/register">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-emerald-600 hover:bg-emerald-50 text-base px-8 py-4 h-auto font-bold"
            >
              無料で始める（支払いは後から）
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-stone-400">
          <div className="mb-3 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-stone-600">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:text-stone-600">利用規約</Link>
            <Link href="/legal" className="hover:text-stone-600">法的事項</Link>
            <Link href="/contact" className="hover:text-stone-600">お問い合わせ</Link>
          </div>
          <p>© 2025 オートマ退職. All rights reserved.</p>
          <p className="mt-2 text-xs text-stone-300">
            本サービスは法律上の退職代理業務を行うものではありません。
            お客様ご自身の意思決定・実行のサポートツールです。
          </p>
        </div>
      </footer>
    </div>
  );
}
