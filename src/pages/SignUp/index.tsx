import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import { CustomCheckbox, MobileInput } from "../../common";

import {
  DatePickerWrapper,
  FullButton,
  PageContainer,
} from "../../common/styles";

import {
  SignUpContainer,
  SignUpTitle,
  SignUpDescription,
  SignUpText,
  SignUpLinkText,
  CheckboxContainer,
} from "./style";
import { SignUpSchema } from "../../constants/validationSchemas";
import Dropdown from "../../common/Dropdown";
import { useAppDispatch } from "../../hooks/redux";
import { register } from "../../store/asyncActions/users";
import { genderDropdown } from "../../constants/common";

interface SignUpFormI {
  firstName: string;
  lastName: string;
  dateOfBirth: null | string;
  gender: null | number;
  zip: string;
  password: string;
  passwordConfirmation: string;
  privacyPolicy: boolean;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useAppDispatch();

  const { email } = state;

  const formik = useFormik<SignUpFormI>({
    initialValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      gender: null,
      zip: "",
      password: "",
      passwordConfirmation: "",
      privacyPolicy: false,
    },
    onSubmit(values) {
      dispatch(
        register({
          email: email,
          password: values.password,
          first_name: values.firstName,
          last_name: values.lastName,
          birth_date: values.dateOfBirth || "",
          zip_code: values.zip,
          gender: values.gender || 0,
        })
      );
    },
    validationSchema: SignUpSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);
  const genderValue = genderDropdown.find(
    (v) => v.id === formik.values.gender
  )?.value;

  const handleSelectDropdownValue = (value: string | number) =>
    formik.setFieldValue("gender", value);

  const handleSelectDateOfBirth = (date: Date) =>
    formik.setFieldValue("dateOfBirth", format(date, "yyyy-MM-dd"));

  return (
    <SignUpContainer>
      <SignUpTitle>Welcome to Schedule World!</SignUpTitle>
      <SignUpDescription>Create your account</SignUpDescription>
      <PageContainer>
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
          value={genderValue}
          error={formik.errors.gender}
          dropdownList={genderDropdown}
          onSelectDropdownValue={handleSelectDropdownValue}
        />
        <DatePickerWrapper>
          <DatePicker
            selected={
              formik.values.dateOfBirth
                ? new Date(formik.values.dateOfBirth)
                : null
            }
            onChange={handleSelectDateOfBirth}
            dateFormat="MM.dd.yyyy"
            placeholderText="MM.DD.YYYY"
            showPopperArrow={false}
            showYearDropdown
            scrollableYearDropdown
            isClearable={false}
            customInput={
              <MobileInput
                type="text"
                label="Date of birth"
                placeholder="MM.DD.YYYY"
                name="dateOfBirth"
                dateIcon
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
      </PageContainer>
    </SignUpContainer>
  );
};

export default SignUp;
