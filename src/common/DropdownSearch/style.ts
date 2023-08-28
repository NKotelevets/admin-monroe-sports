import styled from "styled-components";

export const DropdownSearchContainer = styled.div<{ opened?: boolean }>`
  position: relative;
  border-radius: 4px;
  width: max-content;
  cursor: pointer;

  border: ${({ opened }) => (opened ? "1px solid #000000" : "none")};
  padding: ${({ opened }) => (opened ? "10px" : "0")};
`;

export const InputContainer = styled.input`
  outline: none;
  border: none;
  color: inherit;
  font: inherit;
  background: transparent;

  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export const ListContainer = styled.div`
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  z-index: 2;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
`;

export const ListItemContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const CheckContainer = styled.div`
  margin: 0 0 0 auto;
`;

export const ListItemText = styled.p`
  color: #000;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin: 0 8px 0 0;

  overflow: hidden;
  text-overflow: ellipsis;
`;
