import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { MobileLogo } from "../../assets/svg";
import { MobileInput } from "../../common";
import { FixedContainer, FullButton } from "../../common/styles";
import { routesConstant } from "../../constants/appRoutesConstants";
import { JoinTeamSchema } from "../../constants/validationSchemas";

import { JoinTeamContainer, JoinTeamTitle, JoinTeamDescription } from "./style";

interface JoinTeamFormI {
  parenOrGuardianEmail: string;
}

const JoinTeam = () => {
  const navigate = useNavigate();

  const formik = useFormik<JoinTeamFormI>({
    initialValues: {
      parenOrGuardianEmail: "",
    },
    onSubmit(values) {
      console.log(values);
      navigate(routesConstant.success);
    },
    validationSchema: JoinTeamSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  return (
    <JoinTeamContainer>
      <MobileLogo />
      <JoinTeamTitle>Who is joining Team [Team Name]?</JoinTeamTitle>
      <JoinTeamDescription>
        You are under 16 years old. Please submit your Parent/Guardian’s email
      </JoinTeamDescription>
      <MobileInput
        type="text"
        name="parenOrGuardianEmail"
        label="Parent/Guardian’s email"
        placeholder="Enter Parent/Guardian’s email here"
        value={formik.values.parenOrGuardianEmail}
        error={formik.errors.parenOrGuardianEmail}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <FixedContainer>
        <FullButton disabled={isDisabledButton} onClick={formik.handleSubmit}>
          Continue
        </FullButton>
      </FixedContainer>
    </JoinTeamContainer>
  );
};

export default JoinTeam;
