import { Link } from 'react-router-dom';

import { NavigationItemTitles } from '../../interfaces/index.ts'
import Logout from '../../assets/svg/Logout.tsx'

import Logo from '../Logo/index.tsx'

import NavigationItem from './components/NavigationItem.tsx'
import {SideBarContainer, NavigationMenu, LogoutContainer, LogoutText} from './styles.ts'

const SideBar = () => {
  return (
    <SideBarContainer>
      <Logo />
      <NavigationMenu>
        <Link to="/"><NavigationItem title={NavigationItemTitles.home} /></Link>
        <Link to="/teams"><NavigationItem title={NavigationItemTitles.teams} /></Link>
        <Link to="/games"><NavigationItem title={NavigationItemTitles.games} /></Link>
        <Link to="/availability"><NavigationItem title={NavigationItemTitles.availability} /></Link>
      </NavigationMenu>

      <LogoutContainer>
        <Logout />
        <LogoutText>Log Out</LogoutText>
      </LogoutContainer>
    </SideBarContainer>
  )
}

export default SideBar
