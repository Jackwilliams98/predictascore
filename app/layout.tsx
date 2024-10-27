import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Provider } from "@/components/ui/provider";

import "./globals.css";
import { NavigationHeader } from "@/components";

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
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider>
          <div className="app-wrapper">
            <NavigationHeader />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
