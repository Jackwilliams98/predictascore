import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { Provider } from "@/components/ui/provider";

import "./globals.css";
import { NavigationHeader } from "@/components";

export const metadata: Metadata = {
  title: "PredictaScore",
  description: "The next level football predictions social hub",
};

const nunito = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={nunito.className}>
      <body>
        <div className="app-wrapper">
          <Provider>
            <NavigationHeader />
            {children}
            <Analytics />
          </Provider>
        </div>
      </body>
    </html>
  );
}
