import { ColoredPlugLogo, Input } from "../../common";
import { ArrowDown, Bell } from "../../assets/svg";

import avatarExample from "../../assets/avatar-example.png";

import {
  AccountContainer,
  Avatar,
  HeaderContainer,
  SearchContainer,
  ReminderContainer,
  UserContainer,
  UserDescription,
  UserName,
  UserRole,
} from "./style";

const Header = () => {
  return (
    <HeaderContainer>
      <SearchContainer>
        <Input type="text" placeholder="Search team" icon />
      </SearchContainer>
      <AccountContainer>
        <ReminderContainer reminderExists={true}>
          <Bell />
        </ReminderContainer>

        <UserContainer>
          {avatarExample ? (
            <Avatar>
              <img src={avatarExample} alt="avatar" />
            </Avatar>
          ) : (
            <ColoredPlugLogo
              name="Matt Damon"
              width={52}
              height={52}
              isBorder
            />
          )}
          <UserDescription>
            <UserName>Matt Damon</UserName>
            <UserRole>Admin</UserRole>
          </UserDescription>
          <ArrowDown />
        </UserContainer>
      </AccountContainer>
    </HeaderContainer>
  );
};

export default Header;
