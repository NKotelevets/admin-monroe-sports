import styled from "styled-components";

import {
  Title,
  MobileContainer,
  Description,
  FixedContainer,
} from "../../common/styles";

export const CheckEmailContainer = styled(MobileContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CheckEmailTitle = styled(Title)`
  margin: 26px 0 10px;
  text-align: center;
`;

export const CheckEmailDescription = styled(Description)`
  margin-bottom: 30px;
  text-align: center;
`;

export const CheckEmailLinkText = styled(Description)`
  display: inline-block;
  text-align: center;
  color: #3e34ca;
  text-decoration-line: underline;
  margin: 0;
`;

export const CheckEmailFixedContainer = styled(FixedContainer)`
  @media (min-width: 768px) {
    position: fixed;
  }
`;
