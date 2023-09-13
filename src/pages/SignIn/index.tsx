import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { CustomCheckbox, MobileInput } from "../../common";
import { SignInSchema } from "../../constants/validationSchemas";
import { FullButton, PageContainer } from "../../common/styles";

import {
  SignInContainer,
  SignInTitle,
  PasswordLinkText,
  SignInText,
  SignInLinkText,
  CheckboxContainer,
} from "./style";
import { routesConstant } from "../../constants/appRoutesConstants";
import { useAppDispatch } from "../../hooks/redux";
import { login } from "../../store/asyncActions/users";

interface SignInFormI {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik<SignInFormI>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      console.log(values);

      dispatch(login(values));
      //navigate(routesConstant.welcome);
    },
    validationSchema: SignInSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleNavigateToGetStarted = () => navigate(routesConstant.started);

  return (
    <SignInContainer>
      <SignInTitle>Welcome Back! Sign In Below</SignInTitle>
      <PageContainer>
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
          type="password"
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

        <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
          Log in
        </FullButton>
        <SignInText>
          Don't have an account yet?{" "}
          <SignInLinkText onClick={handleNavigateToGetStarted}>
            Sign Up
          </SignInLinkText>
        </SignInText>
      </PageContainer>
    </SignInContainer>
  );
};

export default SignIn;
