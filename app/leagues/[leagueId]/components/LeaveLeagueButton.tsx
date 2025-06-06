"use client";

import { Button } from "@/components";
import { leaveLeague } from "@/lib/leagueAPI";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LeaveLeagueButton({
  leagueName,
  leagueId,
  userId,
}: {
  leagueName: string;
  leagueId: string;
  userId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onLeaveLeague = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const body = JSON.stringify({
      leagueId: leagueId,
      userId: userId,
    });

    try {
      const response = await fetch("/api/league/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave league");
      }

      setSuccess(`Left "${leagueName}" successfully!`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      if (leagueId) {
        router.push(`/leagues`);
      }
    }
  };

  return (
    <>
      <Dialog.Root placement="center" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <Button buttonType="delete">Leave League</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Leave {leagueName}?</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                Are you sure you want to leave the league {leagueName}? This
                action cannot be undone. You will no longer be able to view the
                league standings or participate in league activities.
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button buttonType="neutral">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button buttonType="delete" onClick={onLeaveLeague}>
                  Leave League
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
