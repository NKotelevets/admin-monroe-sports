import { memo } from "react";

import { getRandomColor } from "../../utils/getRandomColor";

import { RandomTeamName } from "./style";

interface ColoredPlugLogoI {
  width: number;
  height: number;
  name: string;
  background?: string;
  smallText?: boolean;
  isBorder?: boolean;
}

const ColoredPlugLogo = ({
  width,
  height,
  name,
  background,
  smallText,
  isBorder,
}: ColoredPlugLogoI) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = background || getRandomColor();

  return (
    <RandomTeamName
      width={width}
      height={height}
      background={randomColor}
      smallText={smallText}
      isBorder={isBorder}
    >
      {firstLetter}
    </RandomTeamName>
  );
};

export default memo(ColoredPlugLogo);
