import { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

import classes from "./Card.module.css";

interface ContainerProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export const Card = ({ children, style }: ContainerProps) => {
  return (
    <Box className={classes.container} style={style}>
      {children}
    </Box>
  );
};
