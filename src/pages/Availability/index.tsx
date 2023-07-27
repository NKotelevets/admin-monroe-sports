import ColoredPlugLogo from "../../common/ColoredPlugLogo"
import Input from "../../common/Input"
import OutlineColorButton from "../../common/OutlineColorButton"
import { SectionContainer, SectionContainerTitle, TableBodyContainer, TableCell, TableCenterCellContainer, TableContainer, TableHeaderTitle, TableRow, HeaderFilterContainer,
  SectionHeader } from "../../common/styles"

import { TeamLogo, AvailabilityButton, SearchContainer } from "./style"

const Availability = () => {
  const data = [
    { id: 1, teamLogo: '', teamName: 'Atlanta Hawks', league: 'Adult', season: 'Summer 2023' },
    { id: 2, teamLogo: '', teamName: 'Atlanta Hawks', league: 'Adult', season: 'Summer 2023' },
    { id: 3, teamLogo: '', teamName: 'Atlanta Hawks', league: 'Adult', season: 'Summer 2023' },
    { id: 4, teamLogo: '', teamName: 'Atlanta Hawks', league: 'Adult', season: 'Summer 2023' }
  ];
  return (
    <SectionContainer>
    <SectionHeader>
      <SectionContainerTitle>Availability</SectionContainerTitle>

      <HeaderFilterContainer>
        <SearchContainer>
          <Input type="text" placeholder="Search here" icon />
        </SearchContainer>
        <OutlineColorButton title='Export' icon='export' />
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
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <TableCenterCellContainer>
                  <TeamLogo>
                    {item.teamLogo ? <img src={item.teamLogo} alt='team logo' /> :
                    <ColoredPlugLogo name={item.teamName} width={32} height={32} />}
                  </TeamLogo>
                  <div>{item.teamName}</div>
                </TableCenterCellContainer>
              </TableCell>
              <TableCell>
                {item.league}
              </TableCell>
              <TableCell>
                {item.season}
              </TableCell>
              <TableCell>
                <AvailabilityButton>See availability</AvailabilityButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBodyContainer>
      </TableContainer>
    </div>
    </SectionContainer>
  )
}

export default Availability
