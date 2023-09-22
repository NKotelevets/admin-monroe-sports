import React, { useState } from "react";

import { ArrowDown, ArrowUp, BlueCheckIcon } from "../../assets/svg";
import OutsideClickContainer from "../OutsideClickContainer";

import {
  Container,
  Wrapper,
  Input,
  Label,
  ErrorMessage,
  DropdownList,
  DropdownListItem,
} from "./style";

export interface DropdownValue {
  id: number;
  value: string;
}

interface DropdownI extends React.HTMLProps<HTMLInputElement> {
  label: string;
  placeholder: string;
  dropdownList: DropdownValue[];
  error?: string;
  onSelectDropdownValue(val: string | number): void;
}

const Dropdown = ({
  label,
  value,
  type,
  error,
  dropdownList,
  onSelectDropdownValue,
  ...rest
}: DropdownI) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);

  const handleClose = () => setIsOpen(false);

  const handleSelectValue = (val: string | number) => () => {
    onSelectDropdownValue(val);
    setIsOpen(false);
  };

  return (
    <OutsideClickContainer onOutsideClick={handleClose}>
      <Container>
        <Label>{label}</Label>

        <Wrapper isError={!!error} onClick={handleOpen}>
          <Input readOnly value={value} {...rest} />
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </Wrapper>

        {isOpen && (
          <DropdownList>
            {dropdownList.map(({ value: title, id }, ind) => (
              <DropdownListItem key={ind} onClick={handleSelectValue(id)}>
                {title}
                {value === title ? <BlueCheckIcon /> : null}
              </DropdownListItem>
            ))}
          </DropdownList>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    </OutsideClickContainer>
  );
};

export default Dropdown;
