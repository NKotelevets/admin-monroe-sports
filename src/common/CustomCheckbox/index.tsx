import { useState } from "react";

import { Check } from "../../assets/svg";

import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from "./styles";

interface CustomCheckboxI {
  label: string | JSX.Element;
}

const CustomCheckbox = ({ label }: CustomCheckboxI) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    console.log("click");
    setChecked(!checked);
  };

  return (
    <CheckboxLabel>
      <CheckboxInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <CheckboxWrapper checked={checked}>
        {checked && <Check />}
      </CheckboxWrapper>

      {label}
    </CheckboxLabel>
  );
};

export default CustomCheckbox;
