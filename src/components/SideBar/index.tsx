import { NavigationItemTitles } from '../../interfaces/index.ts'
import Logo from '../Logo/index.tsx'

import NavigationItem from './components/NavigationItem.tsx'
import {SideBarContainer, NavigationMenu} from './styles.ts'

const SideBar = () => {
  return (
    <SideBarContainer>
      <Logo />
      <NavigationMenu>
        <NavigationItem title={NavigationItemTitles.home} />
        <NavigationItem title={NavigationItemTitles.teams} />
        <NavigationItem title={NavigationItemTitles.games} />
        <NavigationItem title={NavigationItemTitles.availability} />
      </NavigationMenu>
    </SideBarContainer>
  )
}

export default SideBar
