import { ChangeEvent, useState } from "react";

import GreenCheck from "../../assets/svg/GreenCheck";
import { CoachI } from "../../pages/Games";

import ColoredPlugLogo from "../ColoredPlugLogo";

import {
  DropdownSearchContainer,
  InputContainer,
  ListContainer,
  ListItemContainer,
  ListItemText,
  CheckContainer,
} from "./style";
import OutsideClickContainer from "../OutsideClickContainer";

interface DropdownSearchI {
  id: number;
  name: string;
  isOpen: boolean;
  list: CoachI[];
  handleOpen(): void;
  handleClose(): void;
  handleChangeCoach?(gameId: number, coachName: string): void;
}

const DropdownSearch = ({
  id,
  name,
  isOpen,
  list,
  handleOpen,
  handleClose,
  handleChangeCoach,
}: DropdownSearchI) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (coach: CoachI) => {
    handleChangeCoach && handleChangeCoach(id, coach.name);
    setSearchTerm("");
  };

  const filteredList = searchTerm
    ? list.filter((coach) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : list;

  return (
    <DropdownSearchContainer opened={isOpen} onClick={handleOpen}>
      <InputContainer
        value={searchTerm || name}
        onChange={handleSearchChange}
      />
      {isOpen && (
        <OutsideClickContainer onOutsideClick={handleClose}>
          <ListContainer>
            {filteredList.map((item: CoachI) => (
              <ListItemContainer
                key={item.id}
                onClick={() => handleSelect(item)}
              >
                <div>
                  {item.image ? (
                    <img src={item.image} alt="coach image" />
                  ) : (
                    <ColoredPlugLogo
                      name={item.name}
                      width={20}
                      height={20}
                      smallText
                    />
                  )}
                </div>
                <ListItemText>{item.name}</ListItemText>
                {name === item.name && (
                  <CheckContainer>
                    <GreenCheck />
                  </CheckContainer>
                )}
              </ListItemContainer>
            ))}
          </ListContainer>
        </OutsideClickContainer>
      )}
    </DropdownSearchContainer>
  );
};

export default DropdownSearch;
