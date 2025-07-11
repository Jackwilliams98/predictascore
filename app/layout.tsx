import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "@/providers";

import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { NavigationHeader, PageHeader } from "@/components";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "PredictaScore",
  description: "The next level football predictions social hub",
};

const anonymous_Pro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={anonymous_Pro.className}
    >
      <body>
        <SessionProvider session={session}>
          <Provider>
            <NavigationHeader />
            <PageHeader />
            <div className="content">{children}</div>
            <Analytics />
            <Toaster />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
