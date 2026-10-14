import type { Metadata, Viewport } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "cyrillic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "Орликов дом — подбор апартаментов",
  description:
    "Подберите апартаменты в Орликовом доме по цели покупки, виду, бюджету и способу оплаты.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${openSans.variable} ${roboto.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
