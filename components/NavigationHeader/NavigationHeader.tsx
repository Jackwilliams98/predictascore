"use client";
import React, { useState } from "react";
import { Box, IconButton, Tabs } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
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
import { LoginButton } from "./components";

export const NavigationHeader: React.FC = () => {
  const pathname = usePathname();
  const basePath = `/${pathname?.split("/")[1]}`;

  const routes = Object.values(NAVIGATION_ROUTES);

  const [open, setOpen] = useState(false);

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
        <Tabs.Root defaultValue="/" value={basePath}>
          <Tabs.List className={classes.tabsList}>
            {routes.map((tab) => (
              <Tabs.Trigger key={tab.path} value={tab.path} asChild>
                <Link href={tab.path} className={classes.link}>
                  {tab.tab}
                </Link>
              </Tabs.Trigger>
            ))}
            <LoginButton />
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
        <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DrawerBackdrop />
          <DrawerTrigger asChild>
            <IconButton>
              <AiOutlineMenu />
            </IconButton>
          </DrawerTrigger>
          <DrawerContent backgroundColor="#fff">
            <DrawerHeader>
              <DrawerTitle className={classes.link}>PredictaScore</DrawerTitle>
            </DrawerHeader>
            <DrawerBody
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {routes.map((tab) => (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={classes.link}
                  onClick={() => setOpen(false)}
                >
                  {tab.tab}
                </Link>
              ))}
              <LoginButton isDrawer />
            </DrawerBody>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>
      </Box>
    </header>
  );
};
