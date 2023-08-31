import {
  Android,
  Apple,
  BallBottle,
  Letter,
  MobileLogo,
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
  const isParentOrGuardianFlow = true;

  const title = isParentOrGuardianFlow
    ? "Your parent/guardian will receive an invitation"
    : "You have successfully joined the [Team Name]";
  const description = isParentOrGuardianFlow
    ? "In the meantime, go to the app so you don't lose touch with us."
    : "Jump into the app to select your availability, view rosters & schedules and more";

  return (
    <SuccessContainer>
      <MobileLogo />
      <SuccessContentContainer>
        {isParentOrGuardianFlow ? <Letter /> : <BallBottle />}
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
