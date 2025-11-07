import Text from "@/components/Text/Text";
import { Card } from "@/components/Card";
import classes from "../../Predictions.module.css";
import EditFixtureModal from "./EditFixtureModal";
import { Dialog } from "@chakra-ui/react";
import { useState } from "react";

interface FixtureCardProps {
  id: string;
  homeTeam: string;
  homeScore: number | null;
  awayTeam: string;
  awayScore: number | null;
  kickoff: string;
  points: number | null;
  prediction?: {
    homeScore: number | null;
    awayScore: number | null;
  };
  isEditGameweek?: boolean;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({
  id,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  kickoff,
  points,
  prediction,
  isEditGameweek = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardComponent = (
    <Card
      key={id}
      style={{
        marginBottom: "16px",
        position: "relative",
        cursor: isEditGameweek ? "pointer" : "default",
      }}
    >
      <Text>
        {new Date(kickoff).toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text.Title className={classes.fixtureCardTitle}>
        <div className={classes.flex}>{homeTeam}</div>
        {!isEditGameweek && (
          <div className={classes.flex}>
            {prediction?.homeScore || 0}:{prediction?.awayScore || 0}
          </div>
        )}
        <div className={classes.flex}>{awayTeam}</div>
      </Text.Title>
      {points !== null && (
        <>
          <Text className={classes.fixtureCardScore}>
            Actual Score:{" "}
            {`${homeScore && homeScore}:${awayScore && awayScore}`}
          </Text>
          <span
            className={classes.points}
            style={{
              backgroundColor:
                points === 0 ? "#fff9c4" : points > 0 ? "#d4edda" : "#f8d7da",
            }}
          >
            <Text style={{ marginInlineStart: "2px" }}>{points}</Text>
          </span>
        </>
      )}
    </Card>
  );

  if (isEditGameweek) {
    return (
      <Dialog.Root onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
        <Dialog.Trigger asChild>{cardComponent}</Dialog.Trigger>
        <EditFixtureModal
          id={id}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          kickoff={kickoff}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </Dialog.Root>
    );
  } else {
    return cardComponent;
  }
};
