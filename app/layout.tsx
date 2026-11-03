import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MIU Reimagined · Prototipo académico no oficial",
  description:
    "Propuesta estudiantil no oficial para ver tus entregas, tu horario y los avisos de tus cursos en un solo lugar. Sin vinculación operativa con MIU/UFM.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), Inter, 'Segoe UI', sans-serif" }}>{children}</body>
    </html>
  );
}
