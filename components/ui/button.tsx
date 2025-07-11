import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import {
  AbsoluteCenter,
  Button as ChakraButton,
  Span,
  Spinner,
} from "@chakra-ui/react";
import { forwardRef } from "react";

interface CustomButtonProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
  buttonType?: "delete" | "default" | "neutral";
}

export interface ButtonProps extends ChakraButtonProps, CustomButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      buttonType,
      loading,
      disabled,
      loadingText,
      children,
      style,
      ...rest
    } = props;

    const backgroundColours = {
      delete: "#c53030",
      default: "#31511e",
      neutral: "#666",
    };

    return (
      <ChakraButton
        disabled={loading || disabled}
        ref={ref}
        {...rest}
        style={{
          backgroundColor: backgroundColours[buttonType || "default"],
          color: "#fff",
          margin: "10px 0",
          ...style,
        }}
      >
        {loading && !loadingText ? (
          <>
            <AbsoluteCenter display="inline-flex">
              <Spinner size="inherit" color="inherit" />
            </AbsoluteCenter>
            <Span opacity={0}>{children}</Span>
          </>
        ) : loading && loadingText ? (
          <>
            <Spinner size="inherit" color="inherit" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </ChakraButton>
    );
  }
);
