import { useState } from 'react'

import { NavigationItemTitles } from '../../../interfaces/index.ts'

import Basketball from '../../../assets/svg/Basketball.tsx'
import Home from '../../../assets/svg/Home.tsx'
import Availability from '../../../assets/svg/Availability.tsx'
import Users from '../../../assets/svg/Users.tsx'

import {NavigationItemContainer, NavigationItemTitle} from '../styles.ts'

interface NavigationItemPropsI {
  title: string;
}

const NavigationItem = ({title}: NavigationItemPropsI) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => setIsHovered(true);

  const handleLeave = () => setIsHovered(false);

  const getIconFromName = (iconName: string) => {
    switch (iconName) {
      case NavigationItemTitles.home:
        return <Home hovered={isHovered} />;
      case NavigationItemTitles.availability:
        return <Availability hovered={isHovered} />;
      case NavigationItemTitles.teams:
        return <Users hovered={isHovered} />;
      case NavigationItemTitles.games:
        return <Basketball hovered={isHovered} />;
    }
  }

  return (
    <NavigationItemContainer onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      {getIconFromName(title)}
      <NavigationItemTitle>{title}</NavigationItemTitle>
    </NavigationItemContainer>
  )
}

export default NavigationItem
