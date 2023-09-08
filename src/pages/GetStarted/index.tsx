import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { CustomCheckbox, MobileInput } from "../../common";
import { FixedContainer, FullButton, PageContainer } from "../../common/styles";
import {
  GetStartedContainer,
  GetStartedTitle,
  GetStartedDescription,
  GetStartedText,
  GetStartedLinkText,
  CheckboxContainer,
} from "./style";
import { GetStartedSchema } from "../../constants/validationSchemas";
import { routesConstant } from "../../constants/appRoutesConstants";

interface GetStartedFormI {
  email: string;
  privacyPolicy: boolean;
}

const GetStarted = () => {
  const navigate = useNavigate();

  const formik = useFormik<GetStartedFormI>({
    initialValues: {
      email: "",
      privacyPolicy: false,
    },
    onSubmit(values) {
      console.log(values);
    },
    validationSchema: GetStartedSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleNavigateToSignUp = () => navigate(routesConstant.signUp);

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
              label={
                <GetStartedText>
                  I accept the{" "}
                  <GetStartedLinkText>Terms of use</GetStartedLinkText> and{" "}
                  <GetStartedLinkText>Privacy policy</GetStartedLinkText>
                </GetStartedText>
              }
            />
          </CheckboxContainer>

          <FullButton
            disabled={isDisabledButton}
            onClick={handleNavigateToSignUp}
          >
            Continue
          </FullButton>
          <GetStartedText>
            Already have an account?{" "}
            <GetStartedLinkText>Sign In</GetStartedLinkText>
          </GetStartedText>
        </FixedContainer>
      </PageContainer>
    </GetStartedContainer>
  );
};

export default GetStarted;
