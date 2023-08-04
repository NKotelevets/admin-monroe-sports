import styled from "styled-components";

export const RolesContainer = styled.div``;

export const RoleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #e4e5e5;
`;

export const RoleTitle = styled.h2`
  color: #1d1e22;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin: 0;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  svg {
    cursor: pointer;
  }
`;
