import type { Metadata } from "next";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import { Metrika } from "@/components/Metrika";
import { BRAND } from "@/lib/brand";
import "./globals.css";

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
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full bg-[#f3ece4] font-sans text-foreground">
        <Metrika />
        <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
