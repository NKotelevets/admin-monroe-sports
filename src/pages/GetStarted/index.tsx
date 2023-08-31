import { MobileLogo } from "../../assets/svg";
import { CustomCheckbox, MobileInput } from "../../common";

import { FixedContainer, FullButton } from "../../common/styles";

import {
  GetStartedContainer,
  GetStartedTitle,
  GetStartedDescription,
  GetStartedText,
  GetStartedLinkText,
  CheckboxContainer,
} from "./style";

const GetStarted = () => {
  return (
    <GetStartedContainer>
      <MobileLogo />
      <GetStartedTitle>Let’s get started</GetStartedTitle>
      <GetStartedDescription>Create your account</GetStartedDescription>
      <MobileInput
        type="text"
        label="Email"
        placeholder="Enter your email here"
      />

      <FixedContainer>
        <CheckboxContainer>
          <CustomCheckbox
            label={
              <GetStartedText>
                I accept the{" "}
                <GetStartedLinkText>Terms of use</GetStartedLinkText> and{" "}
                <GetStartedLinkText>Privacy policy</GetStartedLinkText>
              </GetStartedText>
            }
          />
        </CheckboxContainer>

        <FullButton>Continue</FullButton>
        <GetStartedText>
          Already have an account?{" "}
          <GetStartedLinkText>Sign In</GetStartedLinkText>
        </GetStartedText>
      </FixedContainer>
    </GetStartedContainer>
  );
};

export default GetStarted;
