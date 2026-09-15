import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/i18n/context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniFlat 找房：墨尔本商学院 | UniFlat Finder: Melbourne Business School",
  description:
    "墨尔本商学院周边单人套间实时比价——步行时间、周租金、账单是否包含，部分公寓价格实时抓取。/ Single-occupancy studios near Melbourne Business School (200 Leicester St, Carlton) with live weekly rents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The app defaults to Chinese; I18nProvider corrects `lang` on the client
    // when a visitor switches to English.
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
