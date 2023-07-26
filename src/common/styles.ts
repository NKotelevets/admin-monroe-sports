import styled from "styled-components";

// styles for tabs section
export const SectionContainer = styled.div`
  width: 100%;
  padding: 45px 40px;
  box-sizing: border-box;
`;

export const SectionContainerTitle = styled.h2`
  color: #1d1e22;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Inter;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  text-transform: capitalize;
  margin: 0;
`;

// styles for table
export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export const TableBodyContainer = styled.tbody`
  border: 1px solid #e4e5e5;
  border-radius: 8px;
`;

export const TableHeaderTitle = styled.th`
  color: #636467;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-align: left;
  padding: 0 0 9px;
  &:first-of-type {
    padding-left: 20px;
  }
  &:last-of-type {
    text-align: center;
  }
`;

export const TableRow = styled.tr`
  border-top: 1px solid #e4e5e5;
  border-bottom: 1px solid #e4e5e5;
  background: #fff;
  &:nth-child(even) {
    background: #fafafa;
  }
  &:hover {
    transform: scale(1.01);
    transition: all 0.5s ease-out;
    box-shadow: 0px 6px 30px 3px rgba(29, 30, 34, 0.1);
  }
`;

export const TableCell = styled.td`
  color: #1d1e22;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  padding: 17px 0;
  &:first-of-type {
    padding-left: 20px;
  }
  &:last-of-type {
    text-align: center;
  }
`;

export const TableCenterCellContainer = styled.div`
  display: flex;
  align-items: center;
`;
