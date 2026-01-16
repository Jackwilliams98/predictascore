"use client";
import { useState } from "react";
import PredictionsForm from "./PredictionsForm";
import PredictionsLive from "./PredictionsLive";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { Switch } from "@chakra-ui/react";
import EditGameweek from "./EditGameweek";

export default function CurrentGameweekClient({
  isGameweekLive,
  isSubmitted,
  sortedFixtures,
  deadline,
  gameweekId,
  role,
}: {
  isGameweekLive: boolean;
  isSubmitted: boolean;
  sortedFixtures: any[];
  deadline: string;
  gameweekId: string;
  role: string;
}) {
  const [showForm, setShowForm] = useState(!isGameweekLive && !isSubmitted);
  const [isEditGameweek, setIsEditGameweek] = useState(false);

  const router = useRouter();

  const handleEdit = () => setShowForm(true);
  const handleSubmit = () => {
    setShowForm(false);
    router.refresh();
  };

  return (
    <>
      {isEditGameweek ? (
        <EditGameweek
          fixtures={sortedFixtures}
          isGameweekLive={isGameweekLive}
        />
      ) : showForm ? (
        <PredictionsForm
          deadline={deadline}
          fixtures={sortedFixtures}
          gameweekId={gameweekId}
          onSubmit={handleSubmit}
        />
      ) : (
        <PredictionsLive
          fixtures={sortedFixtures}
          onEdit={isGameweekLive ? undefined : handleEdit}
          isGameweekLive={isGameweekLive}
        />
      )}
      <div style={{ marginTop: "1rem" }} />
      {role === Role.ADMIN && (
        <Switch.Root
          colorPalette="green"
          checked={isEditGameweek}
          onCheckedChange={(e) => setIsEditGameweek(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Toggle Edit Gameweek</Switch.Label>
        </Switch.Root>
      )}
    </>
  );
}
