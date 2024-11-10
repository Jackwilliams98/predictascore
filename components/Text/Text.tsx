import { Text as ChakraText, TextProps } from "@chakra-ui/react";

import classes from "./Text.module.css";

const Text = (props: TextProps) => <ChakraText {...props} />;

const HeaderText = (props: TextProps) => (
  <ChakraText className={classes.title} as="h1" {...props} />
);

Text.Header = HeaderText;

export default Text;
