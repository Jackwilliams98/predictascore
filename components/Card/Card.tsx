import { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

import classes from "./Card.module.css";

interface ContainerProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card = ({ children, style, onClick }: ContainerProps) => {
  return (
    <Box className={classes.container} style={style} onClick={onClick}>
      {children}
    </Box>
  );
};
