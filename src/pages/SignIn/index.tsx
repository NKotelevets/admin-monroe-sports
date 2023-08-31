import { MobileLogo } from "../../assets/svg";
import { CustomCheckbox, MobileInput } from "../../common";

import { FullButton } from "../../common/styles";

import {
  SignInContainer,
  SignInTitle,
  PasswordLinkText,
  SignInText,
  SignInLinkText,
  CheckboxContainer,
} from "./style";

const SignIn = () => {
  return (
    <SignInContainer>
      <MobileLogo />
      <SignInTitle>Welcome Back! Sign In Below</SignInTitle>
      <MobileInput
        type="email"
        label="Email"
        placeholder="Enter your email here"
      />
      <MobileInput
        type="password"
        label="Password"
        placeholder="Enter your password"
        passwordIcon
      />

      <PasswordLinkText>Forgot your password?</PasswordLinkText>
      <CheckboxContainer>
        <CustomCheckbox label="Keep logged in" />
      </CheckboxContainer>

      <FullButton>Log in</FullButton>
      <SignInText>
        Don't have an account yet? <SignInLinkText>Sign Up</SignInLinkText>
      </SignInText>
    </SignInContainer>
  );
};

export default SignIn;
