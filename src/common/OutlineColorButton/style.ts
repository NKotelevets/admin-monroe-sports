import styled from "styled-components";

export const OutlineColorButtonContainer = styled.div<{ margin?: string }>`
  display: flex;
  align-items: center;
  width: max-content;
  height: 46px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #c9262c;
  padding: 10px 30px;
  outline: none;
  cursor: pointer;

  margin: ${(props) => props.margin || "0"};
`;

export const OutlineColorButtonTitle = styled.h5`
  color: #c9262c;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-transform: capitalize;
  margin: 0 0 0 11px;
`;
