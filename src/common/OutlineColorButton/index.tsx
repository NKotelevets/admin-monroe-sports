import { Export, Upload } from "../../assets/svg";

import { OutlineColorButtonContainer, OutlineColorButtonTitle } from "./style";

type IconT = "export" | "upload";

interface OutlineColorButtonI {
  title: string;
  icon?: IconT;
}

const OutlineColorButton = ({ title, icon }: OutlineColorButtonI) => {
  const getButtonIcon = () => {
    switch (icon) {
      case "export":
        return <Export />;
      case "upload":
        return <Upload />;
      default:
        return null;
    }
  };

  return (
    <OutlineColorButtonContainer>
      {getButtonIcon()}
      <OutlineColorButtonTitle>{title}</OutlineColorButtonTitle>
    </OutlineColorButtonContainer>
  );
};

export default OutlineColorButton;
