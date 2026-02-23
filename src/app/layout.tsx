import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "オートマ退職 | AIで退職を事務的に完了させる",
  description:
    "退職を伝えるストレスをAIが代わりに解消。¥3,000の買い切りで退職通知メール・退職届を自動生成。感情を排除した「事実だけの要約」で返信対応もラクに。",
  keywords: ["退職", "退職代行", "退職通知", "退職届", "AI", "退職支援"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
