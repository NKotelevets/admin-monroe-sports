import { Link, useLocation } from 'react-router-dom';

import { NavigationItemTitles } from '../../interfaces/index.ts'
import Logout from '../../assets/svg/Logout.tsx'

import Logo from '../Logo/index.tsx'

import NavigationItem from './components/NavigationItem.tsx'
import {SideBarContainer, NavigationMenu, LogoutContainer, LogoutText} from './styles.ts'
import { routesConstant } from '../../constants/appRoutesConstants.ts';

const SideBar = () => {
  const { pathname } = useLocation();
  
  return (
    <SideBarContainer>
      <Logo />
      <NavigationMenu>
        <Link to={routesConstant.rootPage}>
          <NavigationItem 
            selected={routesConstant.rootPage === pathname}
            title={NavigationItemTitles.home} />
        </Link>
        <Link to={routesConstant.team}>
          <NavigationItem 
            selected={routesConstant.team === pathname}
            title={NavigationItemTitles.teams} />
        </Link>
        <Link to={routesConstant.game}>
          <NavigationItem
            selected={routesConstant.game === pathname}
            title={NavigationItemTitles.games} />
        </Link>
        <Link to={routesConstant.availability}>
          <NavigationItem
            selected={routesConstant.availability === pathname}
            title={NavigationItemTitles.availability} />
        </Link>
      </NavigationMenu>

      <LogoutContainer>
        <Logout />
        <LogoutText>Log Out</LogoutText>
      </LogoutContainer>
    </SideBarContainer>
  )
}

export default SideBar
