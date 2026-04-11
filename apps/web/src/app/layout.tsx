import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstroMath",
  description: "Multiplayer turn-based game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
