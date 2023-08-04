import EditIcon from "../../assets/svg/Edit";
import Trash from "../../assets/svg/Trash";
import FullColorButton from "../../common/FullColorButton";
import {
  SectionContainer,
  SectionContainerTitle,
  HeaderFilterContainer,
  SectionHeader,
} from "../../common/styles";

import {
  ActionContainer,
  RoleContainer,
  RoleTitle,
  RolesContainer,
} from "./style";

const Roles = () => {
  const data = [
    { id: 0, roleTitle: "Admin" },
    { id: 1, roleTitle: "Coach" },
    { id: 2, roleTitle: "Assistant Coach" },
    { id: 3, roleTitle: "Player" },
    { id: 4, roleTitle: "Referee" },
    { id: 5, roleTitle: "Parent" },
  ];

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionContainerTitle>Roles</SectionContainerTitle>

        <HeaderFilterContainer>
          <FullColorButton title="Add new Role" margin="0 0 0 20px" />
        </HeaderFilterContainer>
      </SectionHeader>

      <RolesContainer>
        {data.map((role) => (
          <RoleContainer key={role.id}>
            <RoleTitle>{role.roleTitle}</RoleTitle>
            <ActionContainer>
              <Trash />
              <EditIcon />
            </ActionContainer>
          </RoleContainer>
        ))}
      </RolesContainer>
    </SectionContainer>
  );
};

export default Roles;
