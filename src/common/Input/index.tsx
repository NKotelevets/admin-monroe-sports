import { Search } from "../../assets/svg";

import { InputContainer, Input as InputBlock } from "./style";

interface InputI {
  type: string;
  placeholder: string;
  icon: boolean;
}

const Input = ({ type, placeholder, icon }: InputI) => {
  return (
    <InputContainer>
      {icon && <Search />}
      <InputBlock type={type} placeholder={placeholder} />
    </InputContainer>
  );
};

export default Input;
