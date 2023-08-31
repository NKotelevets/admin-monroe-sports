import { MobileLogo } from "../../assets/svg";
import { CustomCheckbox, MobileInput } from "../../common";

import { FullButton } from "../../common/styles";

import {
  SignUpContainer,
  SignUpTitle,
  SignUpDescription,
  SignUpText,
  SignUpLinkText,
  CheckboxContainer,
} from "./style";

const SignUp = () => {
  return (
    <SignUpContainer>
      <MobileLogo />
      <SignUpTitle>Welcome to Schedule World!</SignUpTitle>
      <SignUpDescription>Create your account</SignUpDescription>
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
      <MobileInput
        type="password"
        label="Password"
        placeholder="Create your password"
        passwordIcon
      />
      <MobileInput
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        passwordIcon
      />

      <CheckboxContainer>
        <CustomCheckbox
          label={
            <SignUpText>
              I accept the <SignUpLinkText>Terms of use</SignUpLinkText> and{" "}
              <SignUpLinkText>Privacy policy</SignUpLinkText>
            </SignUpText>
          }
        />
      </CheckboxContainer>

      <FullButton>Sign Up</FullButton>
      <SignUpText>
        Already have an account? <SignUpLinkText>Login</SignUpLinkText>
      </SignUpText>
    </SignUpContainer>
  );
};

export default SignUp;
