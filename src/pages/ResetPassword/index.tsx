import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { MobileInput } from "../../common";
import { FixedContainer, FullButton, PageContainer } from "../../common/styles";
import { ResetPasswordSchema } from "../../constants/validationSchemas";
import { routesConstant } from "../../constants/appRoutesConstants";

import {
  ResetPasswordContainer,
  ResetPasswordTitle,
  ResetPasswordDescription,
  ResetPasswordText,
  ResetPasswordLinkText,
} from "./style";
import { useAppDispatch } from "../../hooks/redux";
import { startResetPassword } from "../../store/asyncActions/users";

interface ResetPasswordFormI {
  email: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik<ResetPasswordFormI>({
    initialValues: {
      email: "",
    },
    onSubmit(values) {
      dispatch(startResetPassword(values))
        .unwrap()
        .then(() => navigate(routesConstant.checkEmail));
    },
    validationSchema: ResetPasswordSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleNavigateToSignIn = () => navigate(routesConstant.signIn);

  return (
    <ResetPasswordContainer>
      <ResetPasswordTitle>Reset Password</ResetPasswordTitle>
      <ResetPasswordDescription>
        Enter the email associated with your account and we’ll send a message
        with an instruction to reset your password
      </ResetPasswordDescription>
      <PageContainer>
        <MobileInput
          type="text"
          name="email"
          label="Email"
          placeholder="Enter your email here"
          value={formik.values.email}
          error={formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <FixedContainer>
          <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
            Reset Password
          </FullButton>
          <ResetPasswordText>
            Back to{" "}
            <ResetPasswordLinkText onClick={handleNavigateToSignIn}>
              Log In
            </ResetPasswordLinkText>
          </ResetPasswordText>
        </FixedContainer>
      </PageContainer>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;
