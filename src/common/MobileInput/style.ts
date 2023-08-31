import styled from "styled-components";

export const Container = styled.div`
  margin-bottom: 20px;
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

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: #f5f4f4;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
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
