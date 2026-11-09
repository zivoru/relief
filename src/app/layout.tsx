import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Metrika } from "@/components/Metrika";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — сушка без потери мышц`,
  description:
    "Персональный план PSMF: белок, меню, рефиды и тренировки под твой зал. Узнай, сколько жира можно сбросить за 2–4 недели.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0..1,0&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500..700,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f3ece4] font-sans text-foreground">
        <Metrika />
        <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
