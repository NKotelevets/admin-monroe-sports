import styled from "styled-components";
import { TableCell, TableRow } from "../../common/styles";

export const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const ScrolledTableWrapper = styled.div`
  white-space: nowrap;
  width: max-content;
  padding: 0 10px 5px 0;
`;

export const GameTableRow = styled(TableRow)`
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

export const GamesTableCell = styled(TableCell)`
  width: 250px;
  span {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;

export const ScrolledGameTableContainer = styled.div`
  overflow-x: auto;
  width: calc(100% + 40px);
  padding-bottom: 50px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const PaginationArrowContainer = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #c9262c;
  background: ${({ disabled }) => (disabled ? "#FFFFFF" : "#C9262C")};
  color: ${({ disabled }) => (disabled ? "#C9262C" : "#1D1E22")};
  border: ${({ disabled }) => (disabled ? "1px solid #E4E5E5" : "none")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  &:first-of-type {
    margin-right: 4px;
  }
  &:last-of-type {
    margin-left: 4px;
  }
`;

export const PaginationItemContainer = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  box-sizing: border-box;
  background: ${({ active }) => (active ? "#F9F2F2" : "#FFF")};
  color: ${({ active }) => (active ? "#C9262C" : "#1D1E22")};
  border: ${({ active }) => (active ? "none" : "1px solid #E4E5E5")};
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  margin: 0 4px;
  cursor: pointer;
`;
