import { NavigationItemTitles } from "../../../interfaces/index.ts";

import Basketball from "../../../assets/svg/Basketball.tsx";
import Home from "../../../assets/svg/Home.tsx";
import Availability from "../../../assets/svg/Availability.tsx";
import Users from "../../../assets/svg/Users.tsx";
import Roles from "../../../assets/svg/Roles.tsx";

import { NavigationItemContainer, NavigationItemTitle } from "../styles.ts";

interface NavigationItemPropsI {
  title: string;
  selected?: boolean;
}

const NavigationItem = ({ title, selected }: NavigationItemPropsI) => {
  const getIconFromName = (iconName: string) => {
    switch (iconName) {
      case NavigationItemTitles.home:
        return <Home hovered={selected} />;
      case NavigationItemTitles.availability:
        return <Availability hovered={selected} />;
      case NavigationItemTitles.teams:
        return <Users hovered={selected} />;
      case NavigationItemTitles.games:
        return <Basketball hovered={selected} />;
      case NavigationItemTitles.roles:
        return <Roles hovered={selected} />;
    }
  };

  return (
    <NavigationItemContainer selected={selected}>
      {getIconFromName(title)}
      <NavigationItemTitle>{title}</NavigationItemTitle>
    </NavigationItemContainer>
  );
};

export default NavigationItem;
