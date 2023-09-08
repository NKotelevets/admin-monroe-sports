import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Check, CircledPlus, Athlete, Ball } from "../../assets/svg";
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
  IconContainer,
  WelcomePageContainer,
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

type NeverUsedAppUserRole = "User" | "Athlete";

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

  // if user has already used app before
  const [athleteList, setAthleteList] = useState(data);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(
    null
  );
  const [isCreateAthleteModalOpen, setIsCreateAthleteModalOpen] =
    useState(false);

  // if user has never used app before
  const [definiteUserSelected, setDefiniteUserSelected] =
    useState<NeverUsedAppUserRole | null>(null);

  const isUsedAppBefore = true;

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
      state: {
        ...(definiteUserSelected
          ? { isNeverUsedAppBefore: true }
          : { isParentOrGuardianFlow: false }),
      },
    });

  return (
    <WelcomeContainer>
      <WelcomeTitle>Welcome to [Team Name]</WelcomeTitle>
      <WelcomeDescription>
        Please submit the info for the player who is being added to [Team Name]
      </WelcomeDescription>
      <WelcomePageContainer>
        {isUsedAppBefore ? (
          <>
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
          </>
        ) : (
          <>
            <AthleteCard
              selected={definiteUserSelected === "User"}
              onClick={() => setDefiniteUserSelected("User")}
            >
              <AthleteCheckBoxContainer
                checked={definiteUserSelected === "User"}
              >
                {definiteUserSelected === "User" && <Check />}
              </AthleteCheckBoxContainer>

              <IconContainer>
                <Ball />
              </IconContainer>
              <AthleteName>John Appleseed</AthleteName>
            </AthleteCard>
            <AthleteCard
              selected={definiteUserSelected === "Athlete"}
              onClick={() => setDefiniteUserSelected("Athlete")}
            >
              <AthleteCheckBoxContainer
                checked={definiteUserSelected === "Athlete"}
              >
                {definiteUserSelected === "Athlete" && <Check />}
              </AthleteCheckBoxContainer>

              <IconContainer>
                <Athlete />
              </IconContainer>
              <AthleteName>My athlete</AthleteName>
            </AthleteCard>
          </>
        )}

        <FixedContainer>
          <FullButton
            disabled={
              isUsedAppBefore
                ? selectedAthleteId === null
                : definiteUserSelected === null
            }
            onClick={handleContinue}
          >
            Continue
          </FullButton>
        </FixedContainer>
      </WelcomePageContainer>
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
