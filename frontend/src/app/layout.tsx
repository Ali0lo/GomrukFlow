import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GömrükFlow — Ağıllı Gömrük & İxrac Köməkçisi (Smart Customs AI)",
  description: "Azərbaycan kənd təsərrüfatı ixracatçıları və gömrük brokerləri üçün XİF MN kod təsnifatı, AQTA/mənşə sənəd uyğunluğu və bəyannamə qaralaması modulu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className="antialiased min-h-screen font-sans selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

