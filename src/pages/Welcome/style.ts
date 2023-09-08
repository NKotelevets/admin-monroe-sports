import styled from "styled-components";

import {
  Title,
  MobileContainer,
  Description,
  PageContainer,
} from "../../common/styles";

export const WelcomeContainer = styled(MobileContainer)`
  position: relative;
`;

export const WelcomePageContainer = styled(PageContainer)`
  max-width: 500px;
`;

export const WelcomeTitle = styled(Title)`
  margin-bottom: 10px;
`;

export const WelcomeDescription = styled(Description)`
  margin-bottom: 30px;
`;

export const AthleteCard = styled.div<{ selected: boolean }>`
  border-radius: 8px;
  padding: 26px 20px;
  border: ${({ selected }) => (selected ? "1px solid #bc261b" : "none")};
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const AthleteName = styled.h3`
  color: #1d1e22;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin: 0;
`;

export const AthleteCheckBoxContainer = styled.div<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border: 1px solid #bc261b;
  border-radius: 4px;
  box-sizing: border-box;
  background: ${({ checked }) => (checked ? "#BC261B" : "transparent")};
  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 26px;
`;

export const AddAthleteButton = styled.button`
  outline: none;
  border-radius: 8px;
  border: 1px solid #3e34ca;
  background: #fff;
  padding: 12px 16px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  margin: 20px 0 144px;

  color: #3e34ca;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
`;

export const AddAthleteButtonText = styled.p`
  margin: 0 0 0 8px;
`;

export const UpdateAvatarButton = styled(AddAthleteButton)`
  margin: 0 0 0 16px;
`;

export const UpdateAvatarButtonText = styled.p`
  margin: 0 0 0 8px;
`;

export const BackgroundWrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: #292930b3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 48px 21px;
`;

export const AthleteContainer = styled.div`
  border-radius: 8px;
  background: #ffffff;
  max-width: 600px;
  width: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 26px 20px;

  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 40px 60px;
  }
`;

export const AthleteContainerTitle = styled.h4`
  color: #1d1e22;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin: 0 0 16px;
  @media (min-width: 768px) {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 32px;
  }
`;

export const NoteText = styled.p`
  color: #696163;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: -15px 0 26px;

  span {
    font-weight: 600;
  }
`;

export const ButtonsContainer = styled.div`
  & > button {
    margin-bottom: 12px;
  }

  @media (min-width: 768px) {
    max-width: 333px;
    width: 100%;
    margin: 0 auto;

    button {
      width: 100%;
    }
  }
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const IconContainer = styled.div`
  margin-right: 12px;
`;
