import styled from "styled-components";

export const Container = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  margin-left: 8px;
  background: transparent;

  color: #1d1e22;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  &: @placeholder {
    color: #7c7e81;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
`;

export const Wrapper = styled.div<{ isError?: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: #f5f4f4;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  border: ${({ isError }) => (isError ? "1px solid #BC261B" : "none")};
`;

export const Label = styled.h6`
  color: #1d1e22;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  margin: 0 0 8px;
`;

export const ErrorMessage = styled.h6`
  color: #bc261b;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin: 0;
`;

export const DropdownList = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: calc(100% + 10px);
  z-index: 1;
  padding: 9px 0;
  border-radius: 8px;
  border: 1px solid #ececee;
  background: #ffffff;
  box-shadow: 0px 2px 30px 1px rgba(207, 207, 207, 0.15);
`;

export const DropdownListItem = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 8px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #1d1e22;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;

  &:hover {
    background: #f5f4f4;
    cursor: pointer;
  }
`;
