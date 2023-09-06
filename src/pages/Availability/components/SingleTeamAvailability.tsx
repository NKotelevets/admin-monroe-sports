import ArrowLeft from "../../../assets/svg/ArrowLeft";
import ArrowRight from "../../../assets/svg/ArrowRight";
import Calendar from "../../../assets/svg/Calendar";
import ColoredPlugLogo from "../../../common/ColoredPlugLogo";
import OutlineColorButton from "../../../common/OutlineColorButton";
import { VerticalCenterContainer } from "../../../common/styles";
import { AvailabilityDataI } from "../../../interfaces";

import {
  AvailabilityNavigation,
  AvailabilityTableWrapper,
  CalendarArrowContainer,
  CalendarDate,
  CalendarDateContainer,
  CalendarSwitcher,
  TeamAvailabilityHeader,
  TeamAvailabilityNavigation,
  TeamLogo,
  TeamName,
  TeamNavigationName,
  TeamSeason,
} from "../style";
import AvailabilityTable from "./AvailabilityTable";

interface SingleTeamAvailabilityI {
  team: AvailabilityDataI;
  handleShowAllTeams: () => void;
}

const SingleTeamAvailability = ({
  team,
  handleShowAllTeams,
}: SingleTeamAvailabilityI) => {
  const handleShowFullAvailabilityList = () => handleShowAllTeams();

  return (
    <>
      <TeamAvailabilityNavigation>
        <AvailabilityNavigation onClick={handleShowFullAvailabilityList}>
          Availability /
        </AvailabilityNavigation>
        <TeamNavigationName>{team.teamName}</TeamNavigationName>
      </TeamAvailabilityNavigation>

      <TeamAvailabilityHeader>
        <VerticalCenterContainer>
          <TeamLogo>
            {team.teamLogo ? (
              <img src={team.teamLogo} alt="team logo" />
            ) : (
              <ColoredPlugLogo
                name={team.teamName}
                width={32}
                height={32}
                isBorder
              />
            )}
          </TeamLogo>
          <TeamName>{team.teamName}</TeamName>
          <TeamSeason> / {team.season}</TeamSeason>
        </VerticalCenterContainer>

        <VerticalCenterContainer>
          <CalendarSwitcher>
            <CalendarArrowContainer>
              <ArrowLeft disabled />
            </CalendarArrowContainer>

            <CalendarDateContainer>
              <Calendar />
              <CalendarDate>June, 2023</CalendarDate>
            </CalendarDateContainer>

            <CalendarArrowContainer>
              <ArrowRight />
            </CalendarArrowContainer>
          </CalendarSwitcher>
          <OutlineColorButton title="Export" icon="export" />
        </VerticalCenterContainer>
      </TeamAvailabilityHeader>

      <AvailabilityTableWrapper>
        <AvailabilityTable />
      </AvailabilityTableWrapper>
    </>
  );
};

export default SingleTeamAvailability;
