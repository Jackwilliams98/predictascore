"use client";
import { useState } from "react";
import PredictionsForm from "./PredictionsForm";
import PredictionsLive from "./PredictionsLive";
import { useRouter } from "next/navigation";

export default function CurrentGameweekClient({
  isGameweekLive,
  isSubmitted,
  sortedFixtures,
  deadline,
  gameweekId,
}: {
  isGameweekLive: boolean;
  isSubmitted: boolean;
  sortedFixtures: any[];
  deadline: string;
  gameweekId: string;
}) {
  const [showForm, setShowForm] = useState(!isGameweekLive && !isSubmitted);
  const router = useRouter();

  const handleEdit = () => setShowForm(true);
  const handleSubmit = () => {
    setShowForm(false);
    router.refresh();
  };

  return showForm ? (
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
    />
  );
}
