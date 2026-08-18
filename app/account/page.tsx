import Text from "@/components/Text/Text";
import { auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Account() {
  const session = await auth();
  const name = session?.user?.name || null;

  return (
    <>
      <Text.Header color="white" textAlign="center" mt={"-60px"} mb={20}>
        Hello, {name}!
      </Text.Header>
      <SignOutButton />
    </>
  );
}
