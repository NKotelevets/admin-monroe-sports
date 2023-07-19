import ArrowDown from "../../assets/svg/ArrowDown"
import Bell from "../../assets/svg/Bell"
import Search from "../../assets/svg/Search"

import avatarExample from '../../assets/avatar-example.png'

import { AccountContainer, Avatar, HeaderContainer, Input, InputContainer, ReminderContainer, UserContainer, UserDescription, UserName, UserRole } from "./style"

const Header = () => {
  return (
    <HeaderContainer>
      <InputContainer>
        <Search />
        <Input type="text" placeholder="Search team" />
      </InputContainer>
      <AccountContainer>
        <ReminderContainer reminderExists={true}>
          <Bell />
        </ReminderContainer>

        <UserContainer>
          <Avatar>
            <img src={avatarExample} alt='avatar' />
          </Avatar>
          <UserDescription>
            <UserName>Matt Damon</UserName>
            <UserRole>Admin</UserRole>
          </UserDescription>
          <ArrowDown />
        </UserContainer>
      </AccountContainer>
    </HeaderContainer>
  )
}

export default Header
