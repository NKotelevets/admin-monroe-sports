import styled, { css } from "styled-components";

export const SideBarContainer = styled.div`
  width: 268px;
  height: 100vh;
  padding-top: 20px;
  position: relative;
  box-sizing: border-box;
  background: rgba(83, 83, 83, 0.03);
`;

export const NavigationMenu = styled.div`
  margin-top: 90px;
  a {
    text-decoration: none;
  }
`;

export const NavigationItemContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 40px;
  margin-bottom: 15px;
  position: relative;

  ${(props) =>
    props.selected &&
    css`
      background: rgba(247, 223, 223, 0.31);
      cursor: pointer;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 2px;
        height: 100%;
        background: #c9262c;
      }
      h3 {
        color: #c9262c;
      }
    `}
`;

export const NavigationItemTitle = styled.h3`
  color: #636467;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0 0 0 16px;
`;

export const LogoutContainer = styled.div`
  display: flex;
  padding: 0 40px;
  position: absolute;
  bottom: 40px;
  cursor: pointer;
`;

export const LogoutText = styled.h6`
  color: #1d1e22;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0 0 0 12px;
`;
