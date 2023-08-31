import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { MobileLogo } from "../../assets/svg";
import { CustomCheckbox, MobileInput } from "../../common";
import { SignInSchema } from "../../constants/validationSchemas";
import { FullButton } from "../../common/styles";

import {
  SignInContainer,
  SignInTitle,
  PasswordLinkText,
  SignInText,
  SignInLinkText,
  CheckboxContainer,
} from "./style";
import { routesConstant } from "../../constants/appRoutesConstants";

interface SignInFormI {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();

  const formik = useFormik<SignInFormI>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      console.log(values);
    },
    validationSchema: SignInSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleNavigateToGetStarted = () => navigate(routesConstant.started);

  return (
    <SignInContainer>
      <MobileLogo />
      <SignInTitle>Welcome Back! Sign In Below</SignInTitle>
      <MobileInput
        type="email"
        label="Email"
        name="email"
        placeholder="Enter your email here"
        value={formik.values.email}
        error={formik.errors.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <MobileInput
        type="text"
        label="Password"
        name="password"
        placeholder="Enter your password"
        passwordIcon
        value={formik.values.password}
        error={formik.errors.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <PasswordLinkText>Forgot your password?</PasswordLinkText>
      <CheckboxContainer>
        <CustomCheckbox label="Keep logged in" />
      </CheckboxContainer>

      <FullButton
        disabled={isDisabledButton}
        onClick={() => formik.handleSubmit}
      >
        Log in
      </FullButton>
      <SignInText>
        Don't have an account yet?{" "}
        <SignInLinkText onClick={handleNavigateToGetStarted}>
          Sign Up
        </SignInLinkText>
      </SignInText>
    </SignInContainer>
  );
};

export default SignIn;
