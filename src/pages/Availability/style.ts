import styled, { css } from "styled-components";
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

export const AvailabilityTableWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  width: 105%;
  padding-bottom: 20px;
`;

export const AvailabilityTableContainer = styled.div`
  width: max-content;
  overflow: scroll hidden;
`;

export const EmptyBlock = styled.div`
  width: 171px;
  height: 46px;
  background: rgba(29, 30, 34, 0.05);
`;

export const AvailabilityItemKey = styled.div<{
  selected: boolean;
  availableTime: boolean;
}>`
  width: 53px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  cursor: pointer;
  color: ${({ selected }) => (selected ? "#FFFFFF" : "#000000")};
  background: ${({ availableTime, selected }) =>
    selected
      ? "#1D1E22"
      : availableTime
      ? "rgba(29, 30, 34, 0.10)"
      : "#F4F4F4"};
`;

export const AvailabilityTableRow = styled.div<{ selected: boolean }>`
  display: flex;
  ${({ selected }) =>
    selected &&
    css`
      border-top: 1px solid #1d1e22;
      border-bottom: 1px solid #1d1e22;
    `}
`;

export const AvailabilityTime = styled.div<{
  availableTime: boolean;
  selected: boolean;
}>`
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;

  width: 171px;
  height: 46px;
  border-top: ${({ selected }) =>
    selected ? "1px solid #1D1E22" : "1px solid #e4e5e5"};
  box-sizing: border-box;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ selected }) => (selected ? "#FFFFFF" : "#000000")};
  background: ${({ availableTime, selected }) =>
    selected
      ? "#1D1E22"
      : availableTime
      ? "rgba(29, 30, 34, 0.10)"
      : "rgba(29, 30, 34, 0.05)"};
`;

export const AvailabilityValueContainer = styled.div<{
  selectedColumn: boolean;
}>`
  position: relative;

  background: #ffffff;
  border: 0.5px solid #e4e5e5;
  ${({ selectedColumn }) =>
    selectedColumn &&
    css`
      border-left: 1px solid #1d1e22;
      border-right: 1px solid #1d1e22;
    `}

  width: 53px;
  height: 46px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BluredBlock = styled.div<{ extra: boolean }>`
  position: absolute;
  width: 53.3px;
  height: 47px;
  left: -1px;
  top: -1px;
  z-index: 1;
  background: ${({ extra }) =>
    extra ? "rgba(29, 30, 34, 0.49)" : "rgba(29, 30, 34, 0.24)"};
`;

export const AvailabilityValue = styled.div<{ value: number }>`
  color: ${({ value }) => (value < 2 && value >= 1 ? "#1D1E22" : "#FFFFFF")};
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-transform: capitalize;
  border-radius: 4px;
  background: ${({ value }) =>
    value < 1 ? "#C9262C" : value < 2 ? "#FFD600" : "#047E29"};

  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  z-index: 2;
`;
