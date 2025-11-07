import { GameweekFixture } from "@/app/types";
import { FixtureCard } from "./FixtureCard";
import { Button } from "@/components";
import { Dialog } from "@chakra-ui/react";
import { useState } from "react";
import EditFixtureModal from "./EditFixtureModal";

interface EditGameweekProps {
  fixtures: GameweekFixture[];
}

const EditGameweek: React.FC<EditGameweekProps> = ({ fixtures }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {fixtures.map((fixture) => {
        const {
          id,
          homeTeam,
          homeScore,
          awayTeam,
          awayScore,
          kickoff,
          points,
        } = fixture;

        return (
          <FixtureCard
            key={id}
            isEditGameweek={true}
            id={id}
            homeTeam={homeTeam}
            homeScore={homeScore}
            awayTeam={awayTeam}
            awayScore={awayScore}
            kickoff={kickoff}
            points={points}
          />
        );
      })}
      <Dialog.Root onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
        <Dialog.Trigger asChild>
          <Button>Add Fixture</Button>
        </Dialog.Trigger>
        <EditFixtureModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Dialog.Root>
    </div>
  );
};

export default EditGameweek;
