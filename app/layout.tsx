import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { Provider } from "@/components/ui/provider";

import "./globals.css";
import { NavigationHeader } from "@/components";

export const metadata: Metadata = {
  title: "GGFPL",
  description: "The next level football predictions league",
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
          </Provider>
        </div>
      </body>
    </html>
  );
}
