import styled from "styled-components";
import { TableCell, VerticalCenterContainer } from "../../common/styles";

export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 45px;
  width: 100%;
`;

export const TableAvailabilityCell = styled(TableCell)`
  font-size: 16px;
  min-width: 100px;
`;

export const AvailabilityButton = styled.div`
  color: #c9262c;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-transform: capitalize;
  cursor: pointer;
`;

export const SearchContainer = styled.div`
  width: 220px;
  margin-right: 25px;
`;

export const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

// SingleTeamAvailability component styles
export const TeamAvailabilityNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

export const AvailabilityNavigation = styled.div`
  color: #7d7e80;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-transform: capitalize;
  margin-right: 5px;
  cursor: pointer;
`;

export const TeamNavigationName = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-transform: capitalize;
`;

export const TeamAvailabilityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 35px;
`;

export const CalendarSwitcher = styled(VerticalCenterContainer)`
  margin-right: 30px;
`;

export const CalendarDateContainer = styled(VerticalCenterContainer)`
  margin: 0 10px;
`;

export const CalendarArrowContainer = styled(VerticalCenterContainer)`
  cursor: pointer;
`;

export const CalendarDate = styled.p`
  color: #1d1e22;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-transform: capitalize;
  margin: 0 0 0 10px;
`;

export const TeamName = styled.p`
  color: #1d1e22;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin: 0 5px 0 0;
`;

export const TeamSeason = styled(TeamName)`
  font-weight: 500;
  margin: 0;
`;
