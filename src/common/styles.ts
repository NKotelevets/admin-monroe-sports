import styled from "styled-components";

export const VerticalCenterContainer = styled.div`
  display: flex;
  align-items: center;
`;

// styles for tabs section
export const SectionContainer = styled.div`
  width: 100%;
  padding: 45px 40px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 45px;
  width: 100%;
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

export const HeaderFilterContainer = styled.h2`
  display: flex;
  align-items: center;
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

export const TableHeaderTitle = styled.th<{ center?: boolean }>`
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
    text-align: ${(props) => (props.center ? "center" : "left")};
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

export const TableCell = styled.td<{ center?: boolean }>`
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
    text-align: ${(props) => (props.center ? "center" : "left")};
  }
`;

export const TableCenterCellContainer = styled.div`
  display: flex;
  align-items: center;
`;

// SING IN or SIGN UP flow styles

export const MobileContainer = styled.div`
  padding: 0 20px 50px;
`;

export const FixedContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
`;

export const Title = styled.h1`
  color: #1d1e22;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin: 30px 0 0;
`;

export const Description = styled.p`
  color: #696163;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin: 0;
`;

export const Text = styled.p`
  color: #1d1e22;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

export const LinkText = styled.span`
  color: #3e34ca;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  text-decoration-line: underline;
`;

export const FullButton = styled.button<{ disabled?: boolean }>`
  display: block;
  margin: 0 auto;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? "#D8817B" : "#bc261b")};
  outline: none;
  border: none;
  width: 263px;
  padding: 15px 26px;
  box-sizing: border-box;

  color: #ffffff;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-transform: capitalize;
`;

export const OutlineButton = styled.button<{ disabled?: boolean }>`
  display: block;
  margin: 0 auto;
  border-radius: 8px;
  outline: none;
  border: 1px solid #bc261b;
  background: transparent;
  width: 263px;
  padding: 15px 26px;
  box-sizing: border-box;

  color: #bc261b;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-transform: capitalize;
`;
