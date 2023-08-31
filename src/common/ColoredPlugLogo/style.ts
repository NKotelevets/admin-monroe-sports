import styled, { css } from "styled-components";

export const RandomTeamName = styled.div<{
  width: number;
  height: number;
  background?: string;
  smallText?: boolean;
  isBorder?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.background};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50%;
  margin-right: 10px;
  border: ${(props) => (props.isBorder ? "1px solid #e4e5e5" : "none")};

  ${({ smallText }) =>
    smallText
      ? css`
          color: #fff;
          text-align: center;
          font-family: Inter;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%;
        `
      : css`
          color: #1d1e22;
          font-family: Inter;
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%;
        `};
`;
