import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { MobileLogo } from "../../assets/svg";
import { CustomCheckbox, MobileInput } from "../../common";

import { DatePickerWrapper, FullButton } from "../../common/styles";

import {
  SignUpContainer,
  SignUpTitle,
  SignUpDescription,
  SignUpText,
  SignUpLinkText,
  CheckboxContainer,
} from "./style";
import { SignUpSchema } from "../../constants/validationSchemas";
import { routesConstant } from "../../constants/appRoutesConstants";
import Dropdown, { DropdownListValue } from "../../common/Dropdown";

interface SignUpFormI {
  firstName: string;
  lastName: string;
  // dateOfBitrh: string;
  gender: string;
  zip: string;
  password: string;
  passwordConfirmation: string;
  privacyPolicy: boolean;
}

const SignUp = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(null);

  const formik = useFormik<SignUpFormI>({
    initialValues: {
      firstName: "",
      lastName: "",
      // TODO: change the format
      // dateOfBitrh: "",
      gender: "",
      zip: "",
      password: "",
      passwordConfirmation: "",
      privacyPolicy: false,
    },
    onSubmit(values) {
      console.log(values);
      navigate(routesConstant.joinTeam);
    },
    validationSchema: SignUpSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  const handleSelectDropdownValue = (value: string) => {
    formik.setFieldValue("gender", value);
  };

  return (
    <SignUpContainer>
      <MobileLogo />
      <SignUpTitle>Welcome to Schedule World!</SignUpTitle>
      <SignUpDescription>Create your account</SignUpDescription>
      <MobileInput
        type="text"
        label="First name"
        placeholder="Enter the player first name here"
        name="firstName"
        value={formik.values.firstName}
        error={formik.errors.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <MobileInput
        type="text"
        label="Last name"
        placeholder="Enter the player last name here"
        name="lastName"
        value={formik.values.lastName}
        error={formik.errors.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Dropdown
        label="Gender"
        placeholder="Select your gender"
        name="gender"
        value={formik.values.gender}
        error={formik.errors.gender}
        dropdownList={[
          { id: 0, value: "Male" },
          { id: 1, value: "Female" },
        ]}
        onSelectDropdownValue={handleSelectDropdownValue}
      />
      <DatePickerWrapper>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM.dd.yyyy"
          placeholderText="MM.DD.YYYY"
          showPopperArrow={false}
          customInput={
            <MobileInput
              type="text"
              label="Date of birth"
              placeholder="MM.DD.YYYY"
              name="dateOfBitrh"
              dateIcon
              // value={formik.values.dateOfBitrh}
              // error={formik.errors.dateOfBitrh}
            />
          }
        />
      </DatePickerWrapper>

      <MobileInput
        type="text"
        label="ZIP code"
        placeholder="012345"
        name="zip"
        value={formik.values.zip}
        error={formik.errors.zip}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <MobileInput
        type="password"
        label="Password"
        placeholder="Create your password"
        name="password"
        passwordIcon
        value={formik.values.password}
        error={formik.errors.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <MobileInput
        type="password"
        label="Confirm password"
        name="passwordConfirmation"
        placeholder="Confirm your password"
        passwordIcon
        value={formik.values.passwordConfirmation}
        error={formik.errors.passwordConfirmation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <CheckboxContainer>
        <CustomCheckbox
          value={formik.values.privacyPolicy}
          name="privacyPolicy"
          label={
            <SignUpText>
              I accept the <SignUpLinkText>Terms of use</SignUpLinkText> and{" "}
              <SignUpLinkText>Privacy policy</SignUpLinkText>
            </SignUpText>
          }
          setFieldValue={formik.setFieldValue}
        />
      </CheckboxContainer>

      <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
        Sign Up
      </FullButton>
      <SignUpText>
        Already have an account? <SignUpLinkText>Login</SignUpLinkText>
      </SignUpText>
    </SignUpContainer>
  );
};

export default SignUp;
