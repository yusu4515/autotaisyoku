# 🤖 オートマ退職

AIで退職を事務的に完了させる退職支援SaaS

## 概要

「退職を伝えるのがこわい」という労働者のために、AIが退職通知メールと退職届を自動生成し、感情的なやり取りを排除するサービスです。

- **料金**: ¥3,000（買い切り）
- **電話退職代行比**: 1/10以下の価格
- **AI**: Anthropic Claude API（Sonnet / Haiku）

## 主な機能

| 機能 | 説明 |
|------|------|
| ポチポチ入力フォーム | 選択肢形式で退職情報を入力（文章入力不要） |
| AI文面生成 | 退職通知メール・退職届を自動生成 |
| 3種送信方式 | SMTP（かんたん）/ OAuth / コピペ |
| 感情フィルタリング | 返信メールから感情・嫌みを除去し事実のみ提示 |
| 法的キーワード検知 | 「損害賠償」「訴訟」等を検出して解説カード表示 |
| 内容証明郵送 | 退職届の内容証明郵便手配 |
| 退職後チェックリスト | 健保・年金・雇用保険など手続きリマインド |

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5
- **AI**: Anthropic Claude API
- **Payment**: Stripe
- **Email**: Nodemailer (SMTP)
- **Hosting**: Railway

## セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数設定

```bash
cp .env.example .env
```

`.env` を開いて各種APIキーを設定してください：

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
ANTHROPIC_API_KEY="sk-ant-..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GOOGLE_CLIENT_ID=""       # オプション
GOOGLE_CLIENT_SECRET=""   # オプション
```

### 3. データベース初期化

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 開発サーバー起動

```bash
npm run dev
```

`http://localhost:3000` でアクセスできます。

## Stripe Webhookのローカルテスト

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 画面構成

| パス | 説明 |
|------|------|
| `/` | ランディングページ |
| `/register` | アカウント登録 |
| `/login` | ログイン |
| `/resign` | 退職情報入力フォーム（4ステップ） |
| `/resign/method` | 送信方式選択 |
| `/resign/preview` | AI生成文面確認・送信 |
| `/resign/postal` | 退職届郵送確認 |
| `/dashboard` | 管理ダッシュボード（感情フィルタリング済み返信閲覧） |
| `/dashboard/checklist` | 退職後手続きチェックリスト |
| `/dashboard/knowledge` | 退職法務ナレッジベース |

## API Routes

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/api/auth/register` | アカウント登録 |
| POST | `/api/resignations` | 退職申請作成 |
| GET | `/api/resignations` | 退職申請一覧取得 |
| PATCH | `/api/resignations/[id]` | 退職申請更新 |
| POST | `/api/generate-email` | AI文面生成（Claude Sonnet） |
| POST | `/api/send-email` | メール送信（SMTP） |
| POST | `/api/summarize-reply` | 返信要約（Claude Haiku） |
| POST | `/api/stripe/checkout` | Stripe決済セッション作成 |
| POST | `/api/stripe/webhook` | Stripe Webhook受信 |
| POST | `/api/postal` | 退職届郵送手配 |

## 法的ガードレール

本サービスは弁護士法に準拠した設計になっています：

- ✅ 退職意思の「伝達」と「要約」のみ実行
- ✅ 条件交渉・金銭要求はAIに行わせない
- ✅ 最終的な送信判断はユーザー自身が実行
- ✅ 当サービスのアドレスを差出人に使用しない
- ✅ パスワードは送信後即時削除
- ✅ 弁護士への紹介料授受なし

## Railway へのデプロイ

```bash
# Railway CLIインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクト作成
railway new

# PostgreSQL追加
railway add postgresql

# 環境変数設定（Railway Dashboard または CLI）
railway variables set ANTHROPIC_API_KEY=...

# デプロイ
railway up
```

## ライセンス

MIT
