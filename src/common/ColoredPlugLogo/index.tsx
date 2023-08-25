import { memo } from "react";
import { getRandomColor } from "../../utils/getRandomColor";
import { RandomTeamName } from "./style";

interface ColoredPlugLogoI {
  width: number;
  height: number;
  name: string;
  smallText?: boolean;
}

const ColoredPlugLogo = ({
  width,
  height,
  name,
  smallText,
}: ColoredPlugLogoI) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = getRandomColor();

  return (
    <RandomTeamName
      width={width}
      height={height}
      background={randomColor}
      smallText={smallText}
    >
      {firstLetter}
    </RandomTeamName>
  );
};

export default memo(ColoredPlugLogo);
