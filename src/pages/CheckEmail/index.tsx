import { useNavigate } from "react-router-dom";

import { PageContainer } from "../../common/styles";
import { routesConstant } from "../../constants/appRoutesConstants";

import {
  CheckEmailContainer,
  CheckEmailTitle,
  CheckEmailDescription,
  CheckEmailLinkText,
  CheckEmailFixedContainer,
} from "./style";
import { EmailLetter } from "../../assets/svg";

const CheckEmail = () => {
  const navigate = useNavigate();

  const handleNavigateToResetPassword = () =>
    navigate(routesConstant.resetPassword);

  return (
    <CheckEmailContainer>
      <EmailLetter />

      <CheckEmailTitle>Check Your Email</CheckEmailTitle>
      <CheckEmailDescription>
        We have sent a password recover instructions to your email
      </CheckEmailDescription>
      <PageContainer>
        <CheckEmailFixedContainer>
          <CheckEmailDescription>
            Did not receive the email? Check your spam <br /> filter, or try{" "}
            <CheckEmailLinkText onClick={handleNavigateToResetPassword}>
              another email address
            </CheckEmailLinkText>
          </CheckEmailDescription>
        </CheckEmailFixedContainer>
      </PageContainer>
    </CheckEmailContainer>
  );
};

export default CheckEmail;
