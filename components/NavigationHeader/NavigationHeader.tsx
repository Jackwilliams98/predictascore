"use client";

import { Box, Icon, Link, Tabs } from "@chakra-ui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import classes from "./NavigationHeader.module.css";
import { NAVIGATION_ROUTES } from "@/constants";
import { AiOutlineMenu } from "react-icons/ai";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export const NavigationHeader: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className={classes.header}>
      <Box className={classes.desktopContent}>
        <Image
          src="/assets/icon.png"
          alt="Logo"
          width={200}
          height={80}
          priority
        />
        <Tabs.Root defaultValue="/" value={pathname}>
          <Tabs.List className={classes.tabsList}>
            {Object.values(NAVIGATION_ROUTES).map((tab) => (
              <Tabs.Trigger key={tab.path} value={tab.path} asChild>
                <Link unstyled href={tab.path} className={classes.link}>
                  {tab.tab}
                </Link>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Box>
      <Box className={classes.mobileContent}>
        <Image
          src="/assets/icon.png"
          alt="Logo"
          width={150}
          height={60}
          priority
        />
        <DrawerRoot>
          <DrawerBackdrop />
          <DrawerTrigger asChild>
            <Icon fontSize="2xl">
              <AiOutlineMenu />
            </Icon>
          </DrawerTrigger>
          <DrawerContent backgroundColor="#fff">
            <DrawerHeader>
              <DrawerTitle
                style={{
                  color: "#31511e",
                  fontSize: "24px",
                }}
              >
                PredictaScore
              </DrawerTitle>
            </DrawerHeader>
            <DrawerBody
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {Object.values(NAVIGATION_ROUTES).map((tab) => (
                <Link
                  key={tab.path}
                  unstyled
                  href={tab.path}
                  style={{
                    color: "#31511e",
                  }}
                  className={classes.link}
                >
                  {tab.tab}
                </Link>
              ))}
            </DrawerBody>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>
      </Box>
    </header>
  );
};
