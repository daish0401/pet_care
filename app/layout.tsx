import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "沐爪宠物洗护店 | 洗澡美容与精致护理",
  description:
    "沐爪宠物洗护店提供宠物洗澡、美容造型、毛发护理、基础洁牙与猫咪安静护理服务。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
