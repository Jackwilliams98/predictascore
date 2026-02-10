"use client";
import { useState } from "react";
import PredictionsForm from "./PredictionsForm";
import PredictionsLive from "./PredictionsLive";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { Switch } from "@chakra-ui/react";
import EditGameweek from "./EditGameweek";
import { Card } from "@/components/Card";
import { Button } from "@/components";

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
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleEdit = () => setShowForm(true);

  const handleSubmit = () => {
    setShowForm(false);
    router.refresh();
  };

  const updatePredictions = async () => {
    try {
      setIsLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/scores`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        cache: "no-store",
      });
      setIsLoading(false);
      router.refresh();
    } catch (e) {
      console.warn("Fixture update failed:", e);
    }
  };

  const isAdmin = role === Role.ADMIN;
  const isUpdateMode = isEditGameweek && isGameweekLive;

  return (
    <>
      {isAdmin && isUpdateMode && (
        <Card style={{ margin: "12px 0" }}>
          <div
            style={{ color: "red", marginBottom: "8px", fontWeight: "bold" }}
          >
            Note: You are in Edit Gameweek mode while the gameweek is live.
          </div>
          <div>
            To update scores, click on a fixture and use the modal to edit the
            current score and status.
          </div>
          <div>
            Once completed, use the button at the bottom of the page to update
            the users predictions.
          </div>
        </Card>
      )}
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
      {isAdmin && (
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
      {isAdmin && isUpdateMode && (
        <Button fontSize={20} onClick={updatePredictions} loading={isLoading}>
          Update Scores
        </Button>
      )}
    </>
  );
}
