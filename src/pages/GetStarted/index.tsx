import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { CustomCheckbox, MobileInput } from "../../common";
import { FixedContainer, FullButton, PageContainer } from "../../common/styles";
import { GetStartedSchema } from "../../constants/validationSchemas";
import { routesConstant } from "../../constants/appRoutesConstants";
import { useAppDispatch } from "../../hooks/redux";
import { checkEmail } from "../../store/asyncActions/users";

import {
  GetStartedContainer,
  GetStartedTitle,
  GetStartedDescription,
  GetStartedText,
  GetStartedLinkText,
  CheckboxContainer,
} from "./style";
import { toast } from "react-toastify";

interface GetStartedFormI {
  email: string;
  privacyPolicy: boolean;
}

const GetStarted = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik<GetStartedFormI>({
    initialValues: {
      email: "",
      privacyPolicy: false,
    },
    onSubmit({ email }) {
      dispatch(checkEmail({ email }))
        .unwrap()
        .then((isEmailExist) =>
          isEmailExist
            ? toast("This email is already exist", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              })
            : navigate(routesConstant.signUp, { state: { email } })
        );
    },
    validationSchema: GetStartedSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleNavigateToSignIn = () => navigate(routesConstant.signIn);

  return (
    <GetStartedContainer>
      <GetStartedTitle>Let’s get started</GetStartedTitle>
      <GetStartedDescription>Create your account</GetStartedDescription>
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
          <CheckboxContainer>
            <CustomCheckbox
              value={formik.values.privacyPolicy}
              name="privacyPolicy"
              label={
                <GetStartedText>
                  I accept the{" "}
                  <GetStartedLinkText>Terms of use</GetStartedLinkText> and{" "}
                  <GetStartedLinkText>Privacy policy</GetStartedLinkText>
                </GetStartedText>
              }
              setFieldValue={formik.setFieldValue}
            />
          </CheckboxContainer>

          <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
            Continue
          </FullButton>
          <GetStartedText>
            Already have an account?{" "}
            <GetStartedLinkText onClick={handleNavigateToSignIn}>
              Sign In
            </GetStartedLinkText>
          </GetStartedText>
        </FixedContainer>
      </PageContainer>
    </GetStartedContainer>
  );
};

export default GetStarted;
