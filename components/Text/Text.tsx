import { Text as ChakraText, TextProps } from "@chakra-ui/react";

import classes from "./Text.module.css";

const Text = (props: TextProps) => <ChakraText {...props} />;

const HeaderText = (props: TextProps) => (
  <ChakraText className={classes.title} as="h1" {...props} />
);

const TitleText = (props: TextProps) => (
  <ChakraText className={classes.subtitle} as="h2" {...props} />
);

const LargeText = (props: TextProps) => (
  <ChakraText className={classes.large} as="p" {...props} />
);

Text.Header = HeaderText;
Text.Title = TitleText;
Text.Large = LargeText;

export default Text;
