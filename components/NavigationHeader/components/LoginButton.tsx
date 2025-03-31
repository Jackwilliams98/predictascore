import { Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import classes from "../NavigationHeader.module.css";

import { Avatar } from "../../ui/avatar";

export const LoginButton: React.FC<{ isDrawer?: boolean }> = ({
  isDrawer = false,
}) => {
  const { data: session } = useSession();

  const Wrapper = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return isDrawer ? (
      <Link href={href} className={classes.link}>
        {children}
      </Link>
    ) : (
      <Tabs.Trigger value={href} asChild>
        <Link href={href} className={classes.link}>
          {children}
        </Link>
      </Tabs.Trigger>
    );
  };

  return session ? (
    <Wrapper href="/account">
      <div className={classes.avatar}>
        {session.user?.image && <Avatar src={session.user?.image} />}
        {session.user?.name?.split(" ")[0] || "Your account"}
      </div>
    </Wrapper>
  ) : (
    <Wrapper href="/api/auth/signin">Login</Wrapper>
  );
};
