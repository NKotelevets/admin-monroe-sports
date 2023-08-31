import styled from "styled-components";

export const CheckboxLabel = styled.label`
  color: #1d1e22;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;

  display: flex;
  align-items: center;
`;

export const CheckboxInput = styled.input<{ checked: boolean }>`
  display: none;
`;

export const CheckboxWrapper = styled.div<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border: 1px solid #bc261b;
  border-radius: 4px;
  box-sizing: border-box;
  background: ${({ checked }) => (checked ? "#BC261B" : "transparent")};
  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 12px;
`;
