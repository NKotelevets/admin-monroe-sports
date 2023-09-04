import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Check, MobileLogo, CircledPlus } from "../../assets/svg";
import { FixedContainer, FullButton } from "../../common/styles";
import { ColoredPlugLogo } from "../../common";

import CreateAthleteModal from "./components/CreateAthleteModal";

import {
  AthleteCard,
  AthleteName,
  AthleteCheckBoxContainer,
  AddAthleteButton,
  AddAthleteButtonText,
  WelcomeContainer,
  WelcomeDescription,
  WelcomeTitle,
} from "./style";
import { routesConstant } from "../../constants/appRoutesConstants";

export interface AthleteI {
  id: number;
  name: string;
  image: null | string;
  dateOfBirth: string;
  zip: string;
  email: string | undefined;
}

const data = [
  {
    id: 0,
    name: "John Appleseed",
    image: null,
    dateOfBirth: "",
    zip: "",
    email: "",
  },
  {
    id: 1,
    name: "Anna Appleseed",
    image: null,
    dateOfBirth: "",
    zip: "",
    email: undefined,
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [athleteList, setAthleteList] = useState(data);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
    null
  );
  const [isCreateAthleteModalOpen, setIsCreateAthleteModalOpen] =
    useState(false);

  const handleAddAthlete = () => setIsCreateAthleteModalOpen(true);

  const handleCloseCreateAthleteModal = () =>
    setIsCreateAthleteModalOpen(false);

  const handleCreateAthlete = ({
    name,
    dateOfBirth,
    zip,
    email,
  }: Pick<AthleteI, "name" | "dateOfBirth" | "zip" | "email">) => {
    setAthleteList([
      ...athleteList,
      {
        id: athleteList[athleteList.length - 1].id + 1,
        name,
        dateOfBirth,
        zip,
        email,
        image: null,
      },
    ]);
    setSelectedAthleteId(athleteList[athleteList.length - 1].id + 1);
    setIsCreateAthleteModalOpen(false);
  };

  const handleSelectAthlete = (id: number) => () => setSelectedAthleteId(id);

  const handleContinue = () =>
    navigate(routesConstant.success, {
      state: { isParentOrGuardianFlow: false },
    });

  console.log(selectedAthleteId);

  return (
    <WelcomeContainer>
      <MobileLogo />
      <WelcomeTitle>Welcome to [Team Name]</WelcomeTitle>
      <WelcomeDescription>
        Please submit the info for the player who is being added to [Team Name]
      </WelcomeDescription>

      {athleteList.map(({ id, name, image }) => {
        const isSelected = selectedAthleteId === id;
        return (
          <AthleteCard
            selected={isSelected}
            key={id}
            onClick={handleSelectAthlete(id)}
          >
            <AthleteCheckBoxContainer checked={isSelected}>
              {isSelected && <Check />}
            </AthleteCheckBoxContainer>

            <div>
              {image ? (
                <img src={image} alt="athlete image" />
              ) : (
                <ColoredPlugLogo
                  name={name}
                  width={40}
                  height={40}
                  background="#BC261B"
                  smallText
                />
              )}
            </div>
            <AthleteName>{name}</AthleteName>
          </AthleteCard>
        );
      })}

      <AddAthleteButton onClick={handleAddAthlete}>
        <CircledPlus />
        <AddAthleteButtonText>Add Athlete</AddAthleteButtonText>
      </AddAthleteButton>

      <FixedContainer>
        <FullButton
          disabled={selectedAthleteId === null}
          onClick={handleContinue}
        >
          Continue
        </FullButton>
      </FixedContainer>

      {isCreateAthleteModalOpen && (
        <CreateAthleteModal
          onClose={handleCloseCreateAthleteModal}
          onContinue={handleCreateAthlete}
        />
      )}
    </WelcomeContainer>
  );
};

export default Welcome;
