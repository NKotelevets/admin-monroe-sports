import { useFormik } from "formik";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { MobileInput } from "../../../common";
import {
  DatePickerWrapper,
  FullButton,
  OutlineButton,
} from "../../../common/styles";

import {
  BackgroundWrapper,
  AthleteContainer,
  AthleteContainerTitle,
  NoteText,
  ButtonsContainer,
} from "../style";
import { AthleteSchema } from "../../../constants/validationSchemas";
import { useState } from "react";
import { AthleteI } from "..";

interface CreateAthleteModalI {
  onClose(): void;
  onContinue(
    athlete: Pick<AthleteI, "name" | "dateOfBirth" | "zip" | "email">
  ): void;
}

interface CreateAthleteFormI {
  name: string;
  // dateOfBitrh: string;
  zip: string;
  email?: string;
}

const CreateAthleteModal = ({ onClose, onContinue }: CreateAthleteModalI) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const formik = useFormik<CreateAthleteFormI>({
    initialValues: {
      name: "",
      // TODO: change the format
      // dateOfBitrh: "",
      zip: "",
      email: undefined,
    },
    onSubmit({ name, zip, email }) {
      onContinue({ name, dateOfBirth: "", zip, email });
    },
    validationSchema: AthleteSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  return (
    <BackgroundWrapper>
      <AthleteContainer>
        <AthleteContainerTitle>Player Info</AthleteContainerTitle>
        <MobileInput
          type="text"
          label="Full name"
          placeholder="Enter the player full name here"
          name="name"
          value={formik.values.name}
          error={formik.errors.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
