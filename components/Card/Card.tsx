import { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

import classes from "./Card.module.css";

interface ContainerProps {
  children: ReactNode;
}

export const Card = ({ children }: ContainerProps) => {
  return <Box className={classes.container}>{children}</Box>;
};
