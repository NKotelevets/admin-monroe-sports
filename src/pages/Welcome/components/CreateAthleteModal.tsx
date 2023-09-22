import { useState } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import { MobileInput } from "../../../common";
import {
  DatePickerWrapper,
  FullButton,
  OutlineButton,
} from "../../../common/styles";
import { AthleteSchema } from "../../../constants/validationSchemas";

import {
  BackgroundWrapper,
  AthleteContainer,
  AthleteContainerTitle,
  NoteText,
  ButtonsContainer,
  AvatarWrapper,
  UpdateAvatarButton,
  UpdateAvatarButtonText,
} from "../style";

import { AthleteI } from "..";
import { AvatarMock, Camera } from "../../../assets/svg";

interface CreateAthleteModalI {
  onClose(): void;
  onContinue(
    athlete: Pick<AthleteI, "name" | "dateOfBirth" | "zip" | "email">
  ): void;
}

interface CreateAthleteFormI {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  zip: string;
  email?: string;
}

const CreateAthleteModal = ({ onClose, onContinue }: CreateAthleteModalI) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const formik = useFormik<CreateAthleteFormI>({
    initialValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      zip: "",
      email: undefined,
    },
    onSubmit({ firstName, lastName, zip, email }) {
      const name = firstName + lastName;
      onContinue({ name, dateOfBirth: "", zip, email });
    },
    validationSchema: AthleteSchema,
    validateOnBlur: true,
  });

  const handleSelectDateOfBirth = (date: Date) =>
    formik.setFieldValue("dateOfBirth", format(date, "yyyy-MM-dd"));

  const isDisabledButton = !(formik.dirty && formik.isValid);

  return (
    <BackgroundWrapper>
      <AthleteContainer>
        <AthleteContainerTitle>Player Info</AthleteContainerTitle>
        <AvatarWrapper>
          <AvatarMock />
          <UpdateAvatarButton onClick={() => console.log("image")}>
            <Camera />
            <UpdateAvatarButtonText>Update photo</UpdateAvatarButtonText>
          </UpdateAvatarButton>
        </AvatarWrapper>
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
        <DatePickerWrapper>
          <DatePicker
            selected={new Date(formik.values.dateOfBirth)}
            onChange={handleSelectDateOfBirth}
            dateFormat="MM.dd.yyyy"
            placeholderText="MM.DD.YYYY"
            showPopperArrow={false}
            showYearDropdown
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
          type="email"
          label="Email (Optional)"
          placeholder="Enter the player email here"
          name="email"
          value={formik.values.email}
          error={formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <NoteText>
          <span>Note:</span> if the player does not have an email, leave the
          input empty.
        </NoteText>

        <ButtonsContainer>
          <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
            Add Player
          </FullButton>
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
        </ButtonsContainer>
      </AthleteContainer>
    </BackgroundWrapper>
  );
};

export default CreateAthleteModal;
