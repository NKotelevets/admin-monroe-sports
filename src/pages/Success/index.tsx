import { useLocation } from "react-router-dom";
import {
  Android,
  Apple,
  BallBottle,
  Letter,
  MobileLogo,
  ShirtWatch,
} from "../../assets/svg";
import { FullButton } from "../../common/styles";

import {
  SuccessContainer,
  SuccessContentContainer,
  SuccessTitle,
  SuccessDescription,
  QuestionText,
  DownloadAppButton,
  DownloadAppButtonText,
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
      <MobileLogo />
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

        <FullButton>Open the app</FullButton>
        <QuestionText>Don't have an app yet?</QuestionText>

        <DownloadAppButton withGap={true}>
          <Apple />
          <DownloadAppButtonText>Download from App Store</DownloadAppButtonText>
        </DownloadAppButton>
        <DownloadAppButton>
          <Android />
          <DownloadAppButtonText>
            Download from Google Play
          </DownloadAppButtonText>
        </DownloadAppButton>
      </SuccessContentContainer>
    </SuccessContainer>
  );
};

export default Success;
