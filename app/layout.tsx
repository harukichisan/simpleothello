import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Simple Othello",
  description: "ブラウザで遊ぶルール忠実なオセロ。CPU難易度とローカル2人対戦を備えています。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

