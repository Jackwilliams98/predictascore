"use client";

import { Box, Image, Link, Tabs } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

import classes from "./NavigationHeader.module.css";
import { head } from "lodash";
import { ROUTES } from "@/constants";

export const NavigationHeader: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    {
      pathname: ROUTES.HOME.path,
      tab: ROUTES.HOME.tab,
    },
    { pathname: ROUTES.TABLE.path, tab: ROUTES.TABLE.tab },
    { pathname: ROUTES.LOGIN.path, tab: ROUTES.LOGIN.tab },
  ];

  return (
    <header className={classes.header}>
      <Box className={classes.content}>
        <Image
          src="/assets/icon.png"
          alt="Logo"
          width={"200px"}
          height={"100%"}
        />
        <Tabs.Root defaultValue="/" value={pathname}>
          <Tabs.List className={classes.tabsList}>
            {tabs.map((tab) => (
              <Tabs.Trigger key={tab.pathname} value={tab.pathname} asChild>
                <Link unstyled href={tab.pathname} className={classes.link}>
                  {tab.tab}
                </Link>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Box>
    </header>
  );
};
