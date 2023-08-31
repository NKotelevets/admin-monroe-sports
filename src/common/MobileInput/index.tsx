import { DatePickerIcon, PasswordHideIcon } from "../../assets/svg";

import { Container, Wrapper, Input, Label } from "./style";

interface InputI {
  label: string;
  type: string;
  placeholder: string;
  passwordIcon?: boolean;
  dateIcon?: boolean;
}

const MobileInput = ({
  label,
  type,
  placeholder,
  passwordIcon,
  dateIcon,
}: InputI) => {
  return (
    <Container>
      <Label>{label}</Label>

      <Wrapper>
        <Input placeholder={placeholder} type={type} />
        {passwordIcon && <PasswordHideIcon />}
        {dateIcon && <DatePickerIcon />}
      </Wrapper>
    </Container>
  );
};

export default MobileInput;
