import { GameweekFixture } from "@/app/types";
import { Button } from "@/components";
import { FixtureCard } from "./FixtureCard";

export default function PredictionsLive({
  fixtures,
  onEdit,
}: {
  fixtures: GameweekFixture[];
  onEdit?: () => void;
}) {
  return (
    <>
      {fixtures.map((fixture) => {
        const {
          id,
          homeTeam,
          homeScore,
          awayTeam,
          awayScore,
          kickoff,
          points,
          prediction,
        } = fixture;

        if (!prediction) {
          return null;
        }

        return (
          <div key={id}>
            <FixtureCard
              id={id}
              homeTeam={homeTeam}
              homeScore={homeScore}
              awayTeam={awayTeam}
              awayScore={awayScore}
              kickoff={kickoff}
              points={points}
              prediction={prediction}
            />
          </div>
        );
      })}
      {onEdit && (
        <Button fontSize={20} onClick={onEdit}>
          Edit
        </Button>
      )}
    </>
  );
}
