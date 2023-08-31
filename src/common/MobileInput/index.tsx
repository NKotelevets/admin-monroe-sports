import React, { useState } from "react";

import {
  DatePickerIcon,
  PasswordHideIcon,
  PasswordShowIcon,
} from "../../assets/svg";

import { Container, Wrapper, Input, Label, ErrorMessage } from "./style";

interface InputI extends React.HTMLProps<HTMLInputElement> {
  label: string;
  placeholder: string;
  error?: string;
  passwordIcon?: boolean;
  dateIcon?: boolean;
}

const MobileInput = ({
  label,
  type,
  passwordIcon,
  dateIcon,
  error,
  ...rest
}: InputI) => {
  const [controlledType, setControlledType] = useState(type);

  const handleChangeType = () =>
    setControlledType(controlledType === "password" ? "text" : "password");

  return (
    <Container>
      <Label>{label}</Label>

      <Wrapper isError={!!error}>
        <Input type={controlledType} {...rest} />
        {passwordIcon && (
          <div onClick={handleChangeType}>
            {controlledType === "password" ? (
              <PasswordHideIcon />
            ) : (
              <PasswordShowIcon />
            )}
          </div>
        )}
        {dateIcon && <DatePickerIcon />}
      </Wrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default MobileInput;
