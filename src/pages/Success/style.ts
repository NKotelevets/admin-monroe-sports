import styled from "styled-components";

import { MobileContainer } from "../../common/styles";

export const SuccessContainer = styled(MobileContainer)``;

export const SuccessContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
`;

export const SuccessTitle = styled.h1`
  color: #1d1e22;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin: 26px 0 10px;
  @media (min-width: 768px) {
    color: #1d1e22;
    text-align: center;
    font-family: Inter;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
`;

export const SuccessDescription = styled.p`
  color: #696163;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin: 0 0 40px;
`;

export const QuestionText = styled.p`
  width: 100%;
  color: #1d1e22;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  position: relative;
  margin: 26px 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 64px;
    height: 1px;
    background: #1d1e22;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 64px;
    height: 1px;
    background: #1d1e22;
  }
`;

export const DownloadAppButton = styled.button<{ withGap?: boolean }>`
  border-radius: 8px;
  border: 1px solid #1d1e22;
  background: #fff;
  outline: none;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 13px 16px;
  box-sizing: border-box;
  width: 280px;

  margin-bottom: ${({ withGap }) => (withGap ? "12px" : "0")};
`;

export const DownloadAppButtonText = styled.p`
  color: #1d1e22;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  margin: 0 0 0 8px;
`;

export const DownloadAppContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const QRCodeContainer = styled.div`
  width: 100%;
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const QRDescription = styled.p`
  color: #1d1e22;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin: 16px 0 0;
`;
