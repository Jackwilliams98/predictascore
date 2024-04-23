import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "GGFPL",
  description: "The next level football predictions league",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 22 }}>
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            src="/assets/icon.jpeg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={100}
            priority
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: 12,
            }}
          >
            <span style={{ fontSize: 32 }}>
              Gambling Gab Football Predictions League
            </span>
            <div style={{ width: "100%" }}>
              <Link href="/" style={{ paddingRight: 12 }}>
                Home
              </Link>
              <Link href="/profile">Profile</Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
