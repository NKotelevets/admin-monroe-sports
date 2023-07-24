import FullColorButton from "../../common/FullColorButton"
import OutlineColorButton from "../../common/OutlineColorButton"
import { SectionContainer, SectionContainerTitle } from "../../common/styles"

import { GameHeader, GameHeaderFilterContainer } from "./style"

const Games = () => {
  return (
    <SectionContainer>
    <GameHeader>
      <SectionContainerTitle>Games</SectionContainerTitle>

      <GameHeaderFilterContainer>
        <OutlineColorButton title='Upload schedule cSV' />
        <FullColorButton title='Add new game' margin='0 0 0 20px' />
      </GameHeaderFilterContainer>
      
    </GameHeader>
    </SectionContainer>
  )
}

export default Games
