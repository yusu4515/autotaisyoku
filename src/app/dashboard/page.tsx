"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatDateTime } from "@/lib/utils";
import {
  Mail,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  ExternalLink,
  Clock,
  Download,
} from "lucide-react";

const LEGAL_KEYWORDS_COLUMNS: Record<string, { title: string; desc: string; link: string }> = {
  損害賠償: {
    title: "損害賠償請求について",
    desc: "退職による損害賠償請求は、原則として認められません。民法627条により、労働者は2週間の予告期間を置けば自由に退職できます。",
    link: "https://www.bengo4.com/c_5/",
  },
  懲戒解雇: {
    title: "懲戒解雇の脅しについて",
    desc: "退職の意思表示を理由に懲戒解雇することは、解雇権の濫用として無効となる可能性が高いです。",
    link: "https://www.mhlw.go.jp/",
  },
  訴訟: {
    title: "訴訟予告について",
    desc: "退職に対して訴訟を起こすことは法的に困難です。まずは弁護士に無料相談することをおすすめします。",
    link: "https://www.houterasu.or.jp/",
  },
  違約金: {
    title: "違約金・研修費の請求について",
    desc: "労働基準法16条により、違約金・損害賠償額を予定する契約は禁止されています。",
    link: "https://jsite.mhlw.go.jp/",
  },
};

type Reply = {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  summary: string;
  hasKeywords: boolean;
  detectedKeywords: string[];
  isRead: boolean;
  receivedAt: string;
  rawContent?: string;
};

type Resignation = {
  id: string;
  companyName: string;
  status: string;
  emailSentAt: string | null;
  createdAt: string;
  replies: Reply[];
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSent = searchParams.get("sent") === "true";
  const resignationId = searchParams.get("id");

  const [resignations, setResignations] = useState<Resignation[]>([]);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [rawAgreed, setRawAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResignations();
  }, []);

  async function fetchResignations() {
    try {
      const res = await fetch("/api/resignations");
      const data = await res.json();
      setResignations(data);
    } catch {
      console.error("Failed to fetch resignations");
    } finally {
      setIsLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "warn" | "destructive" }> = {
      DRAFT: { label: "下書き", variant: "secondary" },
      READY: { label: "準備完了", variant: "warn" },
      EMAIL_SENT: { label: "メール送信済み", variant: "default" },
      POSTAL_SENT: { label: "郵送済み", variant: "default" },
      COMPLETED: { label: "完了", variant: "default" },
    };
    const s = map[status] || { label: status, variant: "secondary" };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <header className="border-b border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-stone-900">オートマ退職</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/checklist">
              <Button variant="outline" size="sm">
                <CheckCircle className="mr-1.5 h-4 w-4" />
                退職後手続き
              </Button>
            </Link>
            <Link href="/dashboard/knowledge">
              <Button variant="outline" size="sm">
                📚 ナレッジ
              </Button>
            </Link>
            <Link href="/resign">
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                新しい退職手続き
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* 送信完了バナー */}
        {justSent && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">退職通知を送信しました！</AlertTitle>
            <AlertDescription className="text-emerald-700">
              会社から返信が届くと、感情フィルタリングで要約してここに表示されます。
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">読み込み中...</div>
        ) : resignations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">まだ退職手続きがありません</h2>
            <p className="text-stone-500 mb-6">退職の第一歩を踏み出しましょう</p>
            <Link href="/resign">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                退職手続きを始める
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* 左側: 退職手続き一覧 */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-stone-900">退職手続き一覧</h2>
              {resignations.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    router.push(`/dashboard?id=${r.id}`, { scroll: false });
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-all hover:border-emerald-400 ${
                    resignationId === r.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-stone-900 text-sm">{r.companyName}</span>
                    {getStatusBadge(r.status)}
                  </div>
                  <div className="text-xs text-stone-400">
                    {r.emailSentAt
                      ? `送信: ${formatDateTime(r.emailSentAt)}`
                      : `作成: ${formatDateTime(r.createdAt)}`}
                  </div>
                  {r.replies.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-stone-400" />
                      <span className="text-xs text-stone-500">
                        返信 {r.replies.length}件
                        {r.replies.some((rep) => !rep.isRead) && (
                          <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                            {r.replies.filter((rep) => !rep.isRead).length}
                          </span>
                        )}
                      </span>
                      {r.replies.some((rep) => rep.hasKeywords) && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 右側: 返信詳細 */}
            <div className="lg:col-span-3">
              {resignations.find((r) => r.id === resignationId)?.replies.length ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="font-bold text-stone-900">会社からの返信</h2>
                    <div className="flex gap-2">
                      {resignationId && (
                        <a href={`/api/certificate?id=${resignationId}`} download>
                          <Button size="sm" variant="ghost" className="text-stone-400 hover:text-stone-700">
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            送信証明書
                          </Button>
                        </a>
                      )}
                      {resignationId && (
                        <Link href={`/dashboard/add-reply?id=${resignationId}`}>
                          <Button size="sm" variant="outline">
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            返信を登録
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {resignations
                      .find((r) => r.id === resignationId)
                      ?.replies.map((reply) => (
                        <Card
                          key={reply.id}
                          className={`cursor-pointer transition-all hover:border-stone-300 ${
                            selectedReply?.id === reply.id ? "border-emerald-400" : ""
                          }`}
                          onClick={() => {
                            setSelectedReply(selectedReply?.id === reply.id ? null : reply);
                            setShowRaw(false);
                            setRawAgreed(false);
                          }}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-sm text-stone-900">
                                  {reply.fromName || reply.fromEmail}
                                </p>
                                <p className="text-xs text-stone-400">{reply.subject}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {reply.hasKeywords && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    要注意
                                  </Badge>
                                )}
                                {!reply.isRead && (
                                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                )}
                                <ChevronRight className={`h-4 w-4 text-stone-400 transition-transform ${selectedReply?.id === reply.id ? "rotate-90" : ""}`} />
                              </div>
                            </div>

                            {selectedReply?.id === reply.id && (
                              <div className="mt-4 space-y-4 animate-fadeInUp">
                                {/* 重要キーワードバナー */}
                                {reply.hasKeywords && (
                                  <Alert variant="warn">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>重要キーワードが検出されました</AlertTitle>
                                    <AlertDescription className="space-y-2">
                                      <p className="text-xs">
                                        メールに <strong>{reply.detectedKeywords.join("・")}</strong> という
                                        法的に重要なキーワードが含まれています。
                                      </p>
                                      {reply.detectedKeywords.map((kw) => {
                                        const col = LEGAL_KEYWORDS_COLUMNS[kw];
                                        if (!col) return null;
                                        return (
                                          <div key={kw} className="rounded-lg bg-white border border-amber-200 p-3">
                                            <p className="text-xs font-semibold text-amber-800">{col.title}</p>
                                            <p className="text-xs text-amber-700 mt-0.5">{col.desc}</p>
                                            <a
                                              href={col.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline mt-1"
                                            >
                                              詳しく見る <ExternalLink className="h-3 w-3" />
                                            </a>
                                          </div>
                                        );
                                      })}
                                      <p className="text-xs">
                                        ※ 紛争になる恐れがある場合は、
                                        <a href="https://www.bengo4.com/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">弁護士ドットコム</a>
                                        や
                                        <a href="https://www.houterasu.or.jp/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">法テラス</a>
                                        への相談をおすすめします。
                                      </p>
                                    </AlertDescription>
                                  </Alert>
                                )}

                                {/* 感情フィルタリング済みの要約 */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className="text-xs">感情フィルタリング済み</Badge>
                                    <span className="text-xs text-stone-400">あなたに必要なことだけ</span>
                                  </div>
                                  <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                                    <p className="text-xs font-semibold text-stone-500 mb-2">
                                      ✅ 会社から求められていること
                                    </p>
                                    <div className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                                      {reply.summary || "（要約を生成中です）"}
                                    </div>
                                  </div>
                                </div>

                                {/* 原文確認（隠し） */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowRaw(!showRaw);
                                    }}
                                    className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-600"
                                  >
                                    {showRaw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    原文を{showRaw ? "隠す" : "見る"}
                                  </button>

                                  {showRaw && !rawAgreed && (
                                    <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
                                      <p className="text-sm font-semibold text-red-800">⚠️ 注意</p>
                                      <p className="text-xs text-red-700">
                                        原文には感情的・攻撃的な表現が含まれている可能性があります。
                                        精神的な負担になる場合があります。本当に閲覧しますか？
                                      </p>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-red-300 text-red-600"
                                          checked={rawAgreed}
                                          onChange={(e) => setRawAgreed(e.target.checked)}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-xs text-red-700">
                                          感情的な表現が含まれる可能性を理解した上で閲覧します
                                        </span>
                                      </label>
                                    </div>
                                  )}

                                  {showRaw && rawAgreed && (
                                    <div className="mt-3 rounded-xl bg-stone-100 border border-stone-300 p-4">
                                      <p className="text-xs font-semibold text-stone-500 mb-2">原文</p>
                                      <p className="text-sm text-stone-600 whitespace-pre-wrap">
                                        {reply.rawContent || "（原文は取得できません）"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ) : resignationId ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center space-y-4">
                      <Clock className="mx-auto h-10 w-10 text-stone-300" />
                      <p className="font-semibold text-stone-700">返信待ち中</p>
                      <p className="text-sm text-stone-400">
                        会社から返信が届いたら、下のボタンから登録してください。
                        <br />
                        感情を除去した「事実だけの要約」でお届けします。
                      </p>
                      <Link href={`/dashboard/add-reply?id=${resignationId}`}>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-1.5 h-4 w-4" />
                          返信メールを貼り付けて登録
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                      <span className="text-4xl">👈</span>
                      <p className="text-stone-500">左の退職手続きを選んでください</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
