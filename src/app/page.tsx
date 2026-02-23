import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ShieldCheck, Phone, Mail, FileText, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ===== ナビゲーション ===== */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-bold text-white">自</span>
            </div>
            <span className="text-lg font-bold text-stone-900">オートマ退職</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">使い方</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">機能</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">料金</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">よくある質問</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-stone-600 font-medium">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-semibold px-5">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== ヒーロー ===== */}
      <section className="bg-stone-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI退職支援サービス　退職届・通知メールを自動生成
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              退職を伝えるのが
              <br />
              <span className="text-emerald-400">こわくない</span>社会へ。
            </h1>

            <p className="mb-8 text-lg text-stone-300 leading-relaxed md:text-xl">
              AIが退職通知メールと退職届を自動生成。<br className="hidden md:block" />
              電話退職代行と同等のサポートを、<strong className="text-white">わずか¥3,000</strong>で。
            </p>

            <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-base px-8 h-13 shadow-lg shadow-emerald-500/30">
                  今すぐ退職を始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white font-medium text-base px-8 h-13 bg-transparent">
                  使い方を見る
                </Button>
              </a>
            </div>

            {/* 信頼スコア */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>弁護士法準拠</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>個人情報保護</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Stripe安全決済</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>送信後即時削除</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 実績バー ===== */}
      <section className="bg-emerald-600 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center text-white">
            {[
              { num: "¥3,000", label: "業界最安値水準", sub: "電話代行の1/10以下" },
              { num: "2〜5分", label: "最短で退職通知完了", sub: "入力からメール送信まで" },
              { num: "100%", label: "退職意思の法的有効性", sub: "民法627条に基づく" },
              { num: "24h", label: "いつでも利用可能", sub: "深夜・休日も対応" },
            ].map((item) => (
              <div key={item.num}>
                <div className="text-3xl font-bold text-white mb-0.5">{item.num}</div>
                <div className="text-sm font-semibold text-emerald-100">{item.label}</div>
                <div className="text-xs text-emerald-200 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== こんな悩みありませんか？ ===== */}
      <section className="py-20 bg-stone-50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Problem</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">こんな悩み、ありませんか？</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "上司に退職を切り出せず、何ヶ月も悩んでいる",
              "退職を伝えたら引き止められそうで怖い",
              "電話退職代行は高すぎる（2〜5万円）",
              "退職届の書き方がわからない",
              "会社からの返信メールを読むのが精神的につらい",
              "退職後の手続き（保険・年金など）が不安",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white border border-stone-200 p-4 shadow-sm">
                <span className="mt-0.5 text-lg">😰</span>
                <p className="text-sm font-medium text-stone-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block rounded-2xl bg-emerald-600 px-8 py-4 text-white">
              <p className="text-lg font-bold">オートマ退職が、すべて解決します。</p>
              <p className="text-sm text-emerald-100 mt-1">¥3,000・買い切り・AI全自動</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 使い方 ===== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">How it works</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">4ステップで退職完了</h2>
            <p className="mt-3 text-stone-500">最短2〜5分。難しい手順は一切ありません。</p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "情報を入力",
                desc: "退職日・有給消化・備品返却など、選択肢をタップするだけ。文章を書く必要ゼロ。",
                icon: "✏️",
              },
              {
                step: "2",
                title: "AIが文面を生成",
                desc: "Claudeが「角の立たない」退職通知メールと退職届を自動生成。プレビューで確認できます。",
                icon: "🤖",
              },
              {
                step: "3",
                title: "確認して送信",
                desc: "内容を確認したら、ご自身のメールアドレスから直接送信。成りすましは一切なし。",
                icon: "📤",
              },
              {
                step: "4",
                title: "返信は要約で確認",
                desc: "感情除去された「事実だけの要約」で会社の返信を確認。精神的ダメージゼロ。",
                icon: "😮‍💨",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-2xl">
                  {item.icon}
                </div>
                <div className="absolute top-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 機能一覧 ===== */}
      <section id="features" className="py-20 bg-stone-50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Features</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">充実した機能</h2>
            <p className="mt-3 text-stone-500">退職にまつわる精神的負担をすべてAIが引き受けます</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Mail className="h-5 w-5 text-emerald-600" />,
                title: "AI退職通知メール生成",
                desc: "入力情報をもとに、誠実かつ法的に有効な退職通知メールを自動生成します。",
                tag: "コア機能",
              },
              {
                icon: <FileText className="h-5 w-5 text-emerald-600" />,
                title: "退職届（内容証明フォーマット）",
                desc: "法的効力の高い内容証明フォーマットの退職届を自動生成。郵送手配も可能。",
                tag: "コア機能",
              },
              {
                icon: <span className="text-emerald-600 text-lg font-bold">✦</span>,
                title: "感情フィルタリング",
                desc: "会社の返信から感情的表現・引き止め・威圧を除去。必要な事実だけを表示。",
                tag: "精神的サポート",
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
                title: "法的キーワード検知",
                desc: "「損害賠償」「訴訟」「懲戒解雇」など重要キーワードを検知して解説を表示。",
                tag: "法的保護",
              },
              {
                icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
                title: "退職後チェックリスト",
                desc: "健保切替・失業給付・確定申告など、退職後の手続きを時系列でガイド。",
                tag: "アフターサポート",
              },
              {
                icon: <Star className="h-5 w-5 text-emerald-600" />,
                title: "送信証明書の発行",
                desc: "送信日時・宛先などを記録した証明書をダウンロード。トラブル時の証拠に。",
                tag: "安心機能",
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl bg-white border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    {feature.icon}
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-stone-900">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 電話退職代行との比較 ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Comparison</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">電話退職代行との違い</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">項目</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    <span className="text-emerald-400">オートマ退職</span>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-stone-400">電話退職代行</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["料金", "¥3,000（税込）", "¥20,000〜¥50,000"],
                  ["対応時間", "24時間いつでも", "営業時間内のみ"],
                  ["退職通知", "AI自動生成メール", "電話による口頭連絡"],
                  ["退職届", "自動生成・郵送対応", "別途費用が必要な場合も"],
                  ["差出人", "ご本人のアドレス", "代行会社のアドレス"],
                  ["成りすまし", "なし", "あり（会社側から見ると）"],
                  ["返信の確認", "感情フィルタリング付き", "なし"],
                  ["法的根拠", "弁護士法準拠", "グレーゾーンの業者あり"],
                ].map(([item, ours, theirs], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                    <td className="px-6 py-4 font-medium text-stone-700">{item}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-emerald-600">{ours}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-stone-400">{theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== 料金 ===== */}
      <section id="pricing" className="py-20 bg-stone-50">
        <div className="mx-auto max-w-xl px-4 text-center">
          <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Pricing</p>
          <h2 className="mb-3 text-3xl font-bold text-stone-900 md:text-4xl">シンプルな料金体系</h2>
          <p className="mb-12 text-stone-500">サブスクなし。1回払いで退職まで使い放題。</p>

          <div className="relative rounded-2xl bg-white border-2 border-emerald-500 p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-emerald-500 px-5 py-1.5 text-sm font-bold text-white shadow">
                業界最安値水準
              </span>
            </div>

            <div className="mb-1 text-6xl font-bold text-stone-900">
              ¥3,000
            </div>
            <p className="mb-1 text-stone-400 text-sm">税込 / 買い切り</p>
            <p className="mb-8 text-sm font-medium text-emerald-600">電話退職代行（¥20,000〜¥50,000）の1/10以下</p>

            <div className="mb-8 space-y-3 text-left">
              {[
                "AI退職通知メール自動生成",
                "退職届（内容証明フォーマット）作成",
                "SMTP・OAuth・コピペの3送信方式",
                "感情フィルタリング（返信要約）",
                "法的キーワード検知・解説カード",
                "退職後チェックリスト（保険・年金・雇用保険）",
                "送信証明書ダウンロード",
                "内容証明郵便の手配",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm text-stone-700">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/register" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-base font-bold py-4 h-auto">
                今すぐ退職を完了させる
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-stone-400">
              Stripeによる安全決済。クレジット・コンビニ・銀行振込対応。
              <br />支払いは送信前に行います。
            </p>
          </div>
        </div>
      </section>

      {/* ===== お客様の声 ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Testimonials</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">ご利用者の声</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "20代・会社員",
                text: "上司に怒られるのが怖くて半年悩んでいましたが、AIが作ってくれたメールを送ったら意外とあっさり退職できました。3,000円は安すぎます。",
                stars: 5,
              },
              {
                name: "30代・正社員",
                text: "会社からの返信が「感情フィルタリング」されて届くのが本当に助かりました。原文を見なくて済むのが精神的にとても楽でした。",
                stars: 5,
              },
              {
                name: "20代・パート",
                text: "電話代行は高すぎると思っていたのでこのサービスを使いました。退職届まで自動で作ってくれて、至れり尽くせりでした。",
                stars: 5,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-stone-50 border border-stone-200 p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-stone-700 leading-relaxed">「{item.text}」</p>
                <p className="text-xs font-semibold text-stone-400">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 安心の設計 ===== */}
      <section className="py-20 bg-stone-50">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">Security & Legal</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">安心の法的・セキュリティ設計</h2>
            <p className="mt-3 text-stone-500">法律と個人情報を徹底的に守ります</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "弁護士法72条・27条に準拠",
                desc: "AIは「退職意思の伝達」と「メール要約」のみ行います。条件交渉・金銭要求は一切しません。",
                icon: "⚖️",
              },
              {
                title: "なりすましゼロ",
                desc: "当サービスのアドレスを差出人に使いません。必ずご本人のメールアカウントから送信します。",
                icon: "🔐",
              },
              {
                title: "パスワードは即時削除",
                desc: "SMTPモードでのパスワードはSSL暗号化後、送信完了と同時にサーバーから即時削除します。",
                icon: "🗑️",
              },
              {
                title: "紹介報酬なし",
                desc: "弁護士・専門家への紹介料は受け取りません。法テラス・弁護士ドットコム等の公的機関へのリンクのみです。",
                icon: "✅",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <span className="mt-0.5 text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="mb-1 font-bold text-stone-900">{item.title}</div>
                  <div className="text-sm text-stone-500 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/legal" className="text-sm font-medium text-emerald-600 hover:underline">
              詳しい法的事項を確認する →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-emerald-600 mb-2 tracking-widest uppercase">FAQ</p>
            <h2 className="text-3xl font-bold text-stone-900 md:text-4xl">よくある質問</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "本当に¥3,000だけですか？隠れた費用はありませんか？",
                a: "はい、¥3,000（税込）の買い切りです。月額費用も追加費用も一切ありません。支払いはStripeによる安全な決済です。",
              },
              {
                q: "法的に有効な退職手続きですか？",
                a: "民法627条により、労働者は2週間前に退職の意思を伝えれば退職できます。当サービスのメールはこれを満たします。ただし法律相談は弁護士にご相談ください。",
              },
              {
                q: "会社に代行サービスを使ったことはバレますか？",
                a: "バレません。差出人はご自身のメールアドレスです。当サービスのアドレスは一切使いません。",
              },
              {
                q: "会社が電話してきた場合は？",
                a: "電話対応は当サービスの範囲外です。電話対応が必要な場合は、電話退職代行サービスまたは弁護士をご利用ください（当サービスからのご紹介は行っておりません）。",
              },
              {
                q: "送信前に内容を確認・修正できますか？",
                a: "はい、AIが生成した文面はすべてプレビュー画面で確認・編集できます。送信するのはご本人が「送信」ボタンを押したときのみです。",
              },
              {
                q: "返金はできますか？",
                a: "サービスの性質上、一度メールを送信した後の返金はお断りしています。ただし、生成のみで未送信の場合はお問い合わせください。",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <p className="mb-2 font-bold text-stone-900">Q. {item.q}</p>
                <p className="text-sm text-stone-600 leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 最終CTA ===== */}
      <section className="bg-stone-950 py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            今日、退職の第一歩を
            <br />
            <span className="text-emerald-400">踏み出しましょう。</span>
          </h2>
          <p className="mb-8 text-lg text-stone-400">
            AIが全ての手続きを自動化。あなたはボタンを押すだけ。
          </p>

          <Link href="/register">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-base px-10 h-14 shadow-lg shadow-emerald-500/20">
              無料でアカウント作成
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-stone-500">
            アカウント作成・文面生成は無料。¥3,000の支払いはメール送信前のみ。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>電話対応不要</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>弁護士法準拠</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>成りすましなし</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="bg-stone-900 border-t border-stone-800 py-12 text-stone-400">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600">
                <span className="text-xs font-bold text-white">自</span>
              </div>
              <span className="font-bold text-stone-200">オートマ退職</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="hover:text-stone-200 transition-colors">プライバシーポリシー</Link>
              <Link href="/terms" className="hover:text-stone-200 transition-colors">利用規約</Link>
              <Link href="/legal" className="hover:text-stone-200 transition-colors">法的事項</Link>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6">
            <p className="text-sm text-stone-500">© 2025 オートマ退職. All rights reserved.</p>
            <p className="mt-2 text-xs text-stone-600">
              本サービスは弁護士法72条の「法律事務の取り扱い」には該当しません。退職意思の伝達を支援するソフトウェアツールです。
              退職に関する法律問題は弁護士等の専門家にご相談ください。
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
