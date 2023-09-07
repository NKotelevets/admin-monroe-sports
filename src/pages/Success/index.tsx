import { useLocation } from "react-router-dom";
import {
  Android,
  Apple,
  BallBottle,
  Letter,
  QRCode,
  ShirtWatch,
} from "../../assets/svg";
import { FullButton, PageContainer } from "../../common/styles";

import {
  SuccessContainer,
  SuccessContentContainer,
  SuccessTitle,
  SuccessDescription,
  QuestionText,
  DownloadAppButton,
  DownloadAppButtonText,
  QRCodeContainer,
  DownloadAppContainer,
  QRDescription,
} from "./style";

const Success = () => {
  const location = useLocation();
  const { isParentOrGuardianFlow, isNeverUsedAppBefore } = location.state;

  const title = isNeverUsedAppBefore
    ? "Welcome to [Team Name]"
    : isParentOrGuardianFlow
    ? "Your parent/guardian will receive an invitation"
    : "You have successfully joined the [Team Name]";
  const description = isNeverUsedAppBefore
    ? "[User name] has been added as a coach for [Team Name]. Coaches can submit their roster, invite players, enter availability, monitor RSVP and more."
    : isParentOrGuardianFlow
    ? "In the meantime, go to the app so you don't lose touch with us."
    : "Jump into the app to select your availability, view rosters & schedules and more";

  return (
    <SuccessContainer>
      <PageContainer>
        <SuccessContentContainer>
          {isNeverUsedAppBefore ? (
            <ShirtWatch />
          ) : isParentOrGuardianFlow ? (
            <Letter />
          ) : (
            <BallBottle />
          )}
          <SuccessTitle>{title}</SuccessTitle>
          <SuccessDescription>{description}</SuccessDescription>

          <QRCodeContainer>
            <QRCode />
            <QRDescription>
              Scan QR code to open the app on your phone
            </QRDescription>
          </QRCodeContainer>

          <DownloadAppContainer>
            <FullButton>Open the app</FullButton>
            <QuestionText>Don't have an app yet?</QuestionText>

            <DownloadAppButton withGap={true}>
              <Apple />
              <DownloadAppButtonText>
                Download from App Store
              </DownloadAppButtonText>
            </DownloadAppButton>
            <DownloadAppButton>
              <Android />
              <DownloadAppButtonText>
                Download from Google Play
              </DownloadAppButtonText>
            </DownloadAppButton>
          </DownloadAppContainer>
        </SuccessContentContainer>
      </PageContainer>
    </SuccessContainer>
  );
};

export default Success;
