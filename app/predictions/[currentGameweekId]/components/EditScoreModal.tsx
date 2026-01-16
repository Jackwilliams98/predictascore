import { Button, CloseButton, Dialog, Portal, Stack } from "@chakra-ui/react";
import classes from "../../Predictions.module.css";
import { useEffect, useState } from "react";
import { FixtureStatus } from "@prisma/client";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

interface EditFixtureModalProps {
  id?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status?: FixtureStatus;
  kickoff?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const EditScoreModal: React.FC<EditFixtureModalProps> = ({
  id,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  kickoff,
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const router = useRouter();

  const [editedHomeScore, setEditedHomeScore] = useState<number | null>(
    homeScore ?? null
  );
  const [editedAwayScore, setEditedAwayScore] = useState<number | null>(
    awayScore ?? null
  );
  const [editedStatus, setEditedStatus] = useState<FixtureStatus>(
    status ? status : FixtureStatus.SCHEDULED
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEditedHomeScore(homeScore ?? null);
      setEditedAwayScore(awayScore ?? null);
      setEditedStatus(status ? status : FixtureStatus.SCHEDULED);
    }
  }, [isOpen, homeScore, awayScore, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch("/api/gameweekFixture/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fixture: {
            id,
            homeTeam,
            awayTeam,
            kickoff,
            status: editedStatus,
            homeScore: editedHomeScore,
            awayScore: editedAwayScore,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update fixture");
      }

      const data = await response.json();
      console.log("Fixture updated successfully:", data);
      setIsLoading(false);
      router.refresh();
      setIsOpen(false);
      toaster.create({
        description: "Score updated successfully",
        type: "success",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating fixture:", error);
    }
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>
              Update {homeTeam} vs {awayTeam}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit}>
              <Stack>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <label className={classes.editFixtureLabel}>{homeTeam}</label>
                  <input
                    className={classes.editFixtureInput}
                    type="number"
                    value={editedHomeScore ?? undefined}
                    onChange={(e) => setEditedHomeScore(Number(e.target.value))}
                    required
                  />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <label className={classes.editFixtureLabel}>{awayTeam}</label>
                  <input
                    className={classes.editFixtureInput}
                    value={editedAwayScore ?? undefined}
                    onChange={(e) => setEditedAwayScore(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className={classes.editFixtureLabel}>Status</label>
                  <select
                    className={classes.editFixtureInput}
                    value={editedStatus}
                    onChange={(e) =>
                      setEditedStatus(e.target.value as FixtureStatus)
                    }
                  >
                    {Object.values(FixtureStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </Stack>
              <Dialog.Footer
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <Button type="submit" loading={isLoading}>
                  Save
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Body>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};

export default EditScoreModal;
