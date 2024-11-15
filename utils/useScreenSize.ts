import { useBreakpoint } from "@chakra-ui/react";

export const useScreenSize = () => {
  const breakpoint = useBreakpoint({
    breakpoints: ["xs", "sm", "md", "lg", "xl"],
  });

  const isDesktop =
    breakpoint === "md" || breakpoint === "lg" || breakpoint === "xl";
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";
  const isLargeScreen = breakpoint === "lg" || breakpoint === "xl";

  return {
    breakpoint,
    isDesktop,
    isMobile,
    isTablet,
    isLargeScreen,
  };
};
