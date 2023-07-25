import Approve from "../../assets/svg/Approve"
import Cancel from "../../assets/svg/Cancel"
import Doubt from "../../assets/svg/Doubt"
import EditIcon from "../../assets/svg/Edit"
import SortingIcon from "../../assets/svg/SortingIcon"
import ColoredPlugLogo from "../../common/ColoredPlugLogo"
import FullColorButton from "../../common/FullColorButton"
import OutlineColorButton from "../../common/OutlineColorButton"
import { SectionContainer, SectionContainerTitle, TableBodyContainer, TableCell, TableCenterCellContainer, TableContainer, TableHeaderTitle, TableRow } from "../../common/styles"

import { GameHeader, GameHeaderFilterContainer, TeamLogo, ScoreText } from "./style"

const Games = () => {
  const data = [
    { id: 1, date: 'May 23, 5:30 PM', homeTeamImage: null, homeTeamName: 'Atlanta Hawks', homeScore: {win: 12, doubt: 0, cancel: 0}, awayTeamImage: null, awayScore: {win: 12, doubt: 0, cancel: 0}, awayTeamName: 'Atlanta Hawks', },
    { id: 2, date: 'May 23, 5:30 PM', homeTeamImage: null, homeTeamName: 'Atlanta Hawks', homeScore: {win: 12, doubt: 0, cancel: 0}, awayTeamImage: null, awayScore: {win: 12, doubt: 0, cancel: 0}, awayTeamName: 'Atlanta Hawks', },
    { id: 3, date: 'May 23, 5:30 PM', homeTeamImage: null, homeTeamName: 'Atlanta Hawks', homeScore: {win: 12, doubt: 0, cancel: 0}, awayTeamImage: null, awayScore: {win: 12, doubt: 0, cancel: 0}, awayTeamName: 'Atlanta Hawks', },
    { id: 4, date: 'May 23, 5:30 PM', homeTeamImage: null, homeTeamName: 'Atlanta Hawks', homeScore: {win: 12, doubt: 0, cancel: 0}, awayTeamImage: null, awayScore: {win: 12, doubt: 0, cancel: 0}, awayTeamName: 'Atlanta Hawks', },
    { id: 5, date: 'May 23, 5:30 PM', homeTeamImage: null, homeTeamName: 'Atlanta Hawks', homeScore: {win: 12, doubt: 0, cancel: 0}, awayTeamImage: null, awayScore: {win: 12, doubt: 0, cancel: 0}, awayTeamName: 'Atlanta Hawks', }
  ];
  
  return (
    <SectionContainer>
    <GameHeader>
      <SectionContainerTitle>Games</SectionContainerTitle>

      <GameHeaderFilterContainer>
        <OutlineColorButton title='Upload schedule cSV' />
        <FullColorButton title='Add new game' margin='0 0 0 20px' />
      </GameHeaderFilterContainer>
      
    </GameHeader>

    <div>
      <TableContainer>
        <thead>
          <tr>
          <TableHeaderTitle><TableCenterCellContainer>Day/Time <SortingIcon /></TableCenterCellContainer></TableHeaderTitle>
          <TableHeaderTitle>Home team</TableHeaderTitle>
          <TableHeaderTitle>RSVP home team</TableHeaderTitle>
          <TableHeaderTitle>Away team</TableHeaderTitle>
          <TableHeaderTitle>RSVP away team</TableHeaderTitle>
          <TableHeaderTitle>Action</TableHeaderTitle>
          </tr>
        </thead>
        <TableBodyContainer>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <TableCenterCellContainer>
                  <TeamLogo>
                    {item.homeTeamImage ? <img src={item.homeTeamImage} alt='team logo' /> :
                    <ColoredPlugLogo name={item.homeTeamName} width={32} height={32} />}
                  </TeamLogo>
                  <div>{item.homeTeamName}</div>
                </TableCenterCellContainer>
              </TableCell>
              <TableCell>
                <TableCenterCellContainer>
                  <Cancel />
                  <ScoreText>{item.homeScore.cancel}</ScoreText>
                  <Doubt />
                  <ScoreText>{item.homeScore.doubt}</ScoreText>
                  <Approve />
                  <ScoreText>{item.homeScore.win}</ScoreText>
                </TableCenterCellContainer>
              </TableCell>
              <TableCell>
                <TableCenterCellContainer>
                  <TeamLogo>
                    {item.awayTeamImage ? <img src={item.awayTeamImage} alt='team logo' /> :
                     <ColoredPlugLogo name={item.awayTeamName} width={32} height={32} />}
                  </TeamLogo>
                  <div>{item.awayTeamName}</div>
                </TableCenterCellContainer>
              </TableCell>
              <TableCell>
                <TableCenterCellContainer>
                  <Cancel />
                  <ScoreText>{item.awayScore.cancel}</ScoreText>
                  <Doubt />
                  <ScoreText>{item.awayScore.doubt}</ScoreText>
                  <Approve />
                  <ScoreText>{item.awayScore.win}</ScoreText>
                </TableCenterCellContainer>
              </TableCell>
              <TableCell><EditIcon /></TableCell>
            </TableRow>
          ))}
        </TableBodyContainer>
      </TableContainer>
    </div>
    </SectionContainer>
  )
}

export default Games
