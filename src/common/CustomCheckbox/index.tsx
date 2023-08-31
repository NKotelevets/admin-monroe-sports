import { Check } from "../../assets/svg";

import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from "./styles";

interface CustomCheckboxI {
  label: string | JSX.Element;
  value?: boolean;
  name?: string;
  setFieldValue?(name: string, val: boolean): void;
}

const CustomCheckbox = ({
  label,
  value,
  name,
  setFieldValue,
}: CustomCheckboxI) => {
  const handleChange = () => {
    if (!(name && setFieldValue)) return;
    setFieldValue(name, !value);
  };

  return (
    <CheckboxLabel>
      <CheckboxInput
        type="checkbox"
        checked={!!value}
        onChange={handleChange}
      />
      <CheckboxWrapper checked={!!value}>{value && <Check />}</CheckboxWrapper>

      {label}
    </CheckboxLabel>
  );
};

export default CustomCheckbox;
