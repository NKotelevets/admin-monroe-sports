import Plus from "../../assets/svg/Plus"

import { FullColorButtonContainer, FullColorButtonTitle } from "./style"

interface FullColorButtonI {
  title: string;
  margin?: string;
}

const FullColorButton = ({title, margin}: FullColorButtonI) => {
  return (
    <FullColorButtonContainer margin={margin}>
      <Plus />
      <FullColorButtonTitle>{title}</FullColorButtonTitle>
    </FullColorButtonContainer>
  )
}

export default FullColorButton
