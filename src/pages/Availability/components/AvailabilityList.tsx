import ColoredPlugLogo from "../../../common/ColoredPlugLogo";
import Input from "../../../common/Input";
import OutlineColorButton from "../../../common/OutlineColorButton";
import {
  SectionContainerTitle,
  TableBodyContainer,
  TableCell,
  TableCenterCellContainer,
  TableContainer,
  TableHeaderTitle,
  TableRow,
  HeaderFilterContainer,
  SectionHeader,
} from "../../../common/styles";
import { AvailabilityDataI } from "../../../interfaces";

import {
  TeamLogo,
  TableAvailabilityCell,
  AvailabilityButton,
  SearchContainer,
} from "../style";

interface AvailabilityListI {
  data: AvailabilityDataI[];
  handleSelectTeam: (item: AvailabilityDataI) => void;
}

const AvailabilityList = ({ data, handleSelectTeam }: AvailabilityListI) => {
  const onTeamSelect = (item: AvailabilityDataI) => () =>
    handleSelectTeam(item);

  return (
    <>
      <SectionHeader>
        <SectionContainerTitle>Availability</SectionContainerTitle>

        <HeaderFilterContainer>
          <SearchContainer>
            <Input type="text" placeholder="Search here" icon />
          </SearchContainer>
          <OutlineColorButton title="Export" icon="export" />
        </HeaderFilterContainer>
      </SectionHeader>

      <div>
        <TableContainer>
          <thead>
            <tr>
              <TableHeaderTitle>Team</TableHeaderTitle>
              <TableHeaderTitle>League</TableHeaderTitle>
              <TableHeaderTitle>Season</TableHeaderTitle>
              <TableHeaderTitle>Action</TableHeaderTitle>
            </tr>
          </thead>
          <TableBodyContainer>
            {data.map((item: AvailabilityDataI) => (
              <TableRow key={item.id}>
                <TableCell>
                  <TableCenterCellContainer>
                    <TeamLogo>
                      {item.teamLogo ? (
                        <img src={item.teamLogo} alt="team logo" />
                      ) : (
                        <ColoredPlugLogo
                          name={item.teamName}
                          width={32}
                          height={32}
                        />
                      )}
                    </TeamLogo>
                    <div>{item.teamName}</div>
                  </TableCenterCellContainer>
                </TableCell>
                <TableAvailabilityCell>{item.league}</TableAvailabilityCell>
                <TableAvailabilityCell>{item.season}</TableAvailabilityCell>
                <TableAvailabilityCell>
                  <AvailabilityButton onClick={onTeamSelect(item)}>
                    See availability
                  </AvailabilityButton>
                </TableAvailabilityCell>
              </TableRow>
            ))}
          </TableBodyContainer>
        </TableContainer>
      </div>
    </>
  );
};

export default AvailabilityList;
