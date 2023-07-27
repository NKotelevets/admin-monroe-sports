import styled from "styled-components";

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: #f8f8f8;
  padding: 10px 16px;
  width: 100%;
  box-sizing: border-box;
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
    color: #7d7e80;
  }
`;
