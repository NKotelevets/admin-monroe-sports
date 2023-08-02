import { useState } from "react";

import { SectionContainer } from "../../common/styles";

import AvailabilityList from "./components/AvailabilityList";
import SingleTeamAvailability from "./components/SingleTeamAvailability";
import { AvailabilityDataI } from "../../interfaces";

const data: AvailabilityDataI[] = [
  {
    id: 1,
    teamLogo: "",
    teamName: "Atlanta Hawks",
    league: "Adult",
    season: "Summer 2023",
  },
  {
    id: 2,
    teamLogo: "",
    teamName: "Boston Celtics",
    league: "Adult",
    season: "Summer 2023",
  },
  {
    id: 3,
    teamLogo: "",
    teamName: "Brooklyn Nets",
    league: "Adult",
    season: "Summer 2023",
  },
  {
    id: 4,
    teamLogo: "",
    teamName: "Charlotte Hornets",
    league: "Adult",
    season: "Summer 2023",
  },
];

const Availability = () => {
  const [selectedTeamAvailability, setSelectedTeamAvailability] =
    useState<AvailabilityDataI | null>(null);

  const handleSelectTeam = (team: AvailabilityDataI) =>
    setSelectedTeamAvailability(team);

  const handleShowAllTeams = () => setSelectedTeamAvailability(null);

  return (
    <SectionContainer>
      {selectedTeamAvailability ? (
        <SingleTeamAvailability
          team={selectedTeamAvailability}
          handleShowAllTeams={handleShowAllTeams}
        />
      ) : (
        <AvailabilityList data={data} handleSelectTeam={handleSelectTeam} />
      )}
    </SectionContainer>
  );
};

export default Availability;
