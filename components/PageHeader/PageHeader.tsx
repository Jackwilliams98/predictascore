"use client";

import { usePathname } from "next/navigation";

import { Box } from "@chakra-ui/react";

import classes from "./PageHeader.module.css";
import { ROUTES } from "@/constants";
import Text from "../Text/Text";

export const PageHeader: React.FC = () => {
  const pathname = usePathname();

  const pageHeaders = [
    {
      pathname: ROUTES.HOME.path,
      header: ROUTES.HOME.header,
    },
    { pathname: ROUTES.TABLE.path, header: ROUTES.TABLE.header },
    { pathname: ROUTES.LOGIN.path, header: ROUTES.LOGIN.header },
  ];

  return (
    <Box className={classes.container}>
      <Text.Header>
        {
          pageHeaders.find((pageHeader) => pageHeader.pathname === pathname)
            ?.header
        }
      </Text.Header>
    </Box>
  );
};
