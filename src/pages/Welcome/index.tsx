import { Check, MobileLogo, CircledPlus } from "../../assets/svg";
import { ColoredPlugLogo } from "../../common";
import { FixedContainer, FullButton } from "../../common/styles";

import CreateAthleteModal from "./components/CreateAthleteModal";

import {
  AthleteCard,
  AthleteName,
  AthleteCheckBoxContainer,
  AddAthleteButton,
  AddAthleteButtonText,
  WelcomeContainer,
  WelcomeDescription,
  WelcomeTitle,
} from "./style";

const Welcome = () => {
  return (
    <WelcomeContainer>
      <MobileLogo />
      <WelcomeTitle>Welcome to [Team Name]</WelcomeTitle>
      <WelcomeDescription>
        Please submit the info for the player who is being added to [Team Name]
      </WelcomeDescription>

      <AthleteCard selected={true}>
        <AthleteCheckBoxContainer checked={true}>
          {true && <Check />}
        </AthleteCheckBoxContainer>

        <div>
          {null ? (
            <img src="" alt="coach image" />
          ) : (
            <ColoredPlugLogo
              name="John Appleseed"
              width={40}
              height={40}
              background="#BC261B"
              smallText
            />
          )}
        </div>
        <AthleteName>John Appleseed</AthleteName>
      </AthleteCard>

      <AthleteCard selected={false}>
        <AthleteCheckBoxContainer checked={false}>
          {false && <Check />}
        </AthleteCheckBoxContainer>

        <div>
          {null ? (
            <img src="" alt="coach image" />
          ) : (
            <ColoredPlugLogo
              name="Anna Appleseed"
              width={40}
              height={40}
              background="#BC261B"
              smallText
            />
          )}
        </div>
        <AthleteName>Anna Appleseed</AthleteName>
      </AthleteCard>

      <AddAthleteButton>
        <CircledPlus />
        <AddAthleteButtonText>Add Athlete</AddAthleteButtonText>
      </AddAthleteButton>

      <FixedContainer>
        <FullButton disabled={true}>Continue</FullButton>
      </FixedContainer>

      {/* <CreateAthleteModal /> */}
    </WelcomeContainer>
  );
};

export default Welcome;
