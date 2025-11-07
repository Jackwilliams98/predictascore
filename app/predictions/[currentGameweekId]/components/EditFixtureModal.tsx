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
  kickoff?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const EditFixtureModal: React.FC<EditFixtureModalProps> = ({
  id,
  homeTeam,
  awayTeam,
  kickoff,
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const router = useRouter();

  const [editedHomeTeam, setEditedHomeTeam] = useState<string>(homeTeam ?? "");
  const [editedAwayTeam, setEditedAwayTeam] = useState<string>(awayTeam ?? "");
  const [editedKickoff, setEditedKickoff] = useState(
    kickoff ? new Date(kickoff).toISOString().slice(0, 16) : ""
  );
  const [editedStatus, setEditedStatus] = useState<FixtureStatus>(
    FixtureStatus.SCHEDULED
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEditedHomeTeam(homeTeam ?? "");
      setEditedAwayTeam(awayTeam ?? "");
      setEditedKickoff(
        kickoff ? new Date(kickoff).toISOString().slice(0, 16) : ""
      );
      setEditedStatus(FixtureStatus.SCHEDULED);
    }
  }, [isOpen, homeTeam, awayTeam, kickoff]);

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
            homeTeam: editedHomeTeam,
            awayTeam: editedAwayTeam,
            kickoff: new Date(editedKickoff).toISOString(),
            status: editedStatus,
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
        description: "Fixture updated successfully",
        type: "success",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating fixture:", error);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/gameweekFixture/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete fixture");
      }

      const data = await response.json();
      console.log("Fixture deleted successfully:", data);
      setIsLoading(false);
      router.refresh();
      setIsOpen(false);
      toaster.create({
        description: "Fixture deleted successfully",
        type: "success",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting fixture:", error);
    }
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit Fixture</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit}>
              <Stack>
                <div>
                  <label className={classes.editFixtureLabel}>Home Team</label>
                  <input
                    className={classes.editFixtureInput}
                    value={editedHomeTeam}
                    onChange={(e) => setEditedHomeTeam(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={classes.editFixtureLabel}>Away Team</label>
                  <input
                    className={classes.editFixtureInput}
                    value={editedAwayTeam}
                    onChange={(e) => setEditedAwayTeam(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={classes.editFixtureLabel}>
                    Kickoff Date & Time
                  </label>
                  <input
                    className={classes.editFixtureInput}
                    type="datetime-local"
                    value={editedKickoff}
                    onChange={(e) => setEditedKickoff(e.target.value)}
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
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    background="red"
                    onClick={onDelete}
                    loading={isLoading}
                  >
                    Delete
                  </Button>
                </Dialog.ActionTrigger>
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

export default EditFixtureModal;
