import { MobileInput, OutlineColorButton } from "../../../common";
import { FullButton, OutlineButton } from "../../../common/styles";
import {
  BackgroundWrapper,
  AthleteContainer,
  AthleteContainerTitle,
  NoteText,
  ButtonsContainer,
} from "../style";

const CreateAthleteModal = () => {
  return (
    <BackgroundWrapper>
      <AthleteContainer>
        <AthleteContainerTitle>Player Info</AthleteContainerTitle>
        <MobileInput
          type="text"
          label="Full name"
          placeholder="Enter the player full name here"
        />
        <MobileInput
          type="text"
          label="Date of birth"
          placeholder="MM.DD.YYYY"
          dateIcon
        />
        <MobileInput type="text" label="ZIP code" placeholder="012345" />
        <MobileInput
          type="email"
          label="Email (Optional)"
          placeholder="Enter the player email here"
        />
        <NoteText>
          <span>Note:</span> if the player does not have an email, leave the
          input empty.
        </NoteText>

        <ButtonsContainer>
          <FullButton disabled={true}>Add Player</FullButton>
          <OutlineButton>Cancel</OutlineButton>
        </ButtonsContainer>
      </AthleteContainer>
    </BackgroundWrapper>
  );
};

export default CreateAthleteModal;
