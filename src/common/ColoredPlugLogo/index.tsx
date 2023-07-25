
import { getRandomColor } from "../../utils/getRandomColor";
import { RandomTeamName } from "./style"

interface ColoredPlugLogoI {
  width: number;
  height: number;
  name: string;
}

const ColoredPlugLogo = ({width, height, name}: ColoredPlugLogoI) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = getRandomColor();

  return (
    <RandomTeamName width={width} height={height} background={randomColor} >
      {firstLetter}
    </RandomTeamName>
  )
}

export default ColoredPlugLogo
