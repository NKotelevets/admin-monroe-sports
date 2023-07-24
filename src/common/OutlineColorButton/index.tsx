import Upload from "../../assets/svg/Upload";

import { OutlineColorButtonContainer, OutlineColorButtonTitle } from "./style"

interface OutlineColorButtonI {
  title: string;
}

const OutlineColorButton = ({title}: OutlineColorButtonI) => {
  return (
    <OutlineColorButtonContainer>
      <Upload />
      <OutlineColorButtonTitle>{title}</OutlineColorButtonTitle>
    </OutlineColorButtonContainer>
  )
}

export default OutlineColorButton
