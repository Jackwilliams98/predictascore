"use client";

import { Image, Link, Tabs } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

import classes from "./NavigationHeader.module.css";

export const NavigationHeader: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { pathname: "/", tab: "Home" },
    { pathname: "/table", tab: "Table" },
    { pathname: "/profile", tab: "Profile" },
  ];

  return (
    <header className={classes.header}>
      <Image src="/assets/icon.jpeg" alt="Logo" width={"150px"} />
      <div style={{ width: "100%", paddingLeft: 12 }}>
        <Tabs.Root defaultValue="/" value={pathname}>
          <Tabs.List
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex" }}>
              {tabs.map((tab) => (
                <Tabs.Trigger key={tab.pathname} value={tab.pathname} asChild>
                  <Link
                    unstyled
                    href={tab.pathname}
                    style={{ fontSize: "18px" }}
                  >
                    {tab.tab}
                  </Link>
                </Tabs.Trigger>
              ))}
            </div>
            <Tabs.Trigger value="/login" asChild>
              <Link unstyled href="/login" style={{ fontSize: "18px" }}>
                Login
              </Link>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
    </header>
  );
};
