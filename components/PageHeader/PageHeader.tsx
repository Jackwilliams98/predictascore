"use client";

import { usePathname } from "next/navigation";

import { Box } from "@chakra-ui/react";

import classes from "./PageHeader.module.css";
import { ROUTES } from "@/constants";
import Text from "../Text/Text";

export const PageHeader: React.FC = () => {
  const pathname = usePathname();

  return (
    <Box className={classes.container}>
      <Text.Header>
        {
          Object.values(ROUTES).find(
            (pageHeader) => pageHeader.path === pathname,
          )?.header
        }
      </Text.Header>
    </Box>
  );
};
