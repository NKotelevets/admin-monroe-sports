import { MobileLogo } from "../../assets/svg";
import { MobileInput } from "../../common";

import { FixedContainer, FullButton } from "../../common/styles";

import { JoinTeamContainer, JoinTeamTitle, JoinTeamDescription } from "./style";

const JoinTeam = () => {
  return (
    <JoinTeamContainer>
      <MobileLogo />
      <JoinTeamTitle>Who is joining Team [Team Name]?</JoinTeamTitle>
      <JoinTeamDescription>
        You are under 16 years old. Please submit your Parent/Guardian’s email
      </JoinTeamDescription>
      <MobileInput
        type="text"
        label="Parent/Guardian’s email"
        placeholder="Enter Parent/Guardian’s email here"
      />

      <FixedContainer>
        <FullButton>Continue</FullButton>
      </FixedContainer>
    </JoinTeamContainer>
  );
};

export default JoinTeam;
