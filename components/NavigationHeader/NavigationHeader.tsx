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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: 12,
        }}
      >
        <div style={{ width: "100%" }}>
          <Tabs.Root defaultValue="/" value={pathname}>
            <Tabs.List>
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
            </Tabs.List>
          </Tabs.Root>
        </div>
      </div>
    </header>
  );
};
