import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { Provider } from "@/components/ui/provider";

import "./globals.css";
import { NavigationHeader, PageHeader } from "@/components";

export const metadata: Metadata = {
  title: "PredictaScore",
  description: "The next level football predictions social hub",
};

const anonymous_Pro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={anonymous_Pro.className}
    >
      <body>
        <Provider>
          <NavigationHeader />
          <PageHeader />
          <div className="content">{children}</div>
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
