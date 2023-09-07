import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { MobileInput } from "../../common";
import { FixedContainer, FullButton, PageContainer } from "../../common/styles";
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
      navigate(routesConstant.success, {
        state: { isParentOrGuardianFlow: true },
      });
    },
    validationSchema: JoinTeamSchema,
    validateOnBlur: true,
  });

  const isDisabledButton = !(formik.dirty && formik.isValid);

  return (
    <JoinTeamContainer>
      <JoinTeamTitle>Who is joining Team [Team Name]?</JoinTeamTitle>
      <JoinTeamDescription>
        You are under 16 years old. Please submit your Parent/Guardian’s email
      </JoinTeamDescription>

      <PageContainer>
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
      </PageContainer>
    </JoinTeamContainer>
  );
};

export default JoinTeam;
