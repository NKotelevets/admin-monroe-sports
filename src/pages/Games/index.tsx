import ArrowLeft from "../../assets/svg/ArrowLeft";
import ArrowRight from "../../assets/svg/ArrowRight";
import EditIcon from "../../assets/svg/Edit";
import SortingIcon from "../../assets/svg/SortingIcon";
import ColoredPlugLogo from "../../common/ColoredPlugLogo";
import FullColorButton from "../../common/FullColorButton";
import OutlineColorButton from "../../common/OutlineColorButton";
import {
  SectionContainer,
  SectionContainerTitle,
  TableBodyContainer,
  TableCenterCellContainer,
  TableContainer,
  TableHeaderTitle,
  HeaderFilterContainer,
  SectionHeader,
} from "../../common/styles";

import {
  TeamLogo,
  ScrolledTableWrapper,
  GamesTableCell,
  ScrolledGameTableContainer,
  GameTableRow,
  PaginationContainer,
  PaginationArrowContainer,
  PaginationItemContainer,
} from "./style";

const Games = () => {
  const data = [
    {
      id: 1,
      date: "May 23, 5:30 PM",
      location: "Madison Square Benjamin Thompson",
      homeTeamImage: null,
      homeTeamName: "Atlanta Hawks",
      homeTeamCoach: "Benjamin Thompson",
      awayTeamImage: null,
      awayTeamName: "Atlanta Hawks",
      awayTeamCoach: "Benjamin Thompson",
      referee: "Daniel Harris",
      score: "53-29",
    },
    {
      id: 2,
      date: "May 23, 5:30 PM",
      location: "Madison Square Benjamin Thompson",
      homeTeamImage: null,
      homeTeamName: "Atlanta Hawks",
      homeTeamCoach: "Benjamin Thompson",
      awayTeamImage: null,
      awayTeamName: "Atlanta Hawks",
      awayTeamCoach: "Benjamin Thompson",
      referee: "Daniel Harris",
      score: "53-29",
    },
    {
      id: 3,
      date: "May 23, 5:30 PM",
      location: "Madison Square Benjamin Thompson",
      homeTeamImage: null,
      homeTeamName: "Atlanta Hawks",
      homeTeamCoach: "Benjamin Thompson",
      awayTeamImage: null,
      awayTeamName: "Atlanta Hawks",
      awayTeamCoach: "Benjamin Thompson",
      referee: "Daniel Harris",
      score: "53-29",
    },
    {
      id: 4,
      date: "May 23, 5:30 PM",
      location: "Madison Square Benjamin Thompson",
      homeTeamImage: null,
      homeTeamName: "Atlanta Hawks",
      homeTeamCoach: "Benjamin Thompson",
      awayTeamImage: null,
      awayTeamName: "Atlanta Hawks",
      awayTeamCoach: "Benjamin Thompson",
      referee: "Daniel Harris",
      score: "53-29",
    },
    {
      id: 5,
      date: "May 23, 5:30 PM",
      location: "Madison Square Benjamin Thompson",
      homeTeamImage: null,
      homeTeamName: "Atlanta Hawks",
      homeTeamCoach: "Benjamin Thompson",
      awayTeamImage: null,
      awayTeamName: "Atlanta Hawks",
      awayTeamCoach: "Benjamin Thompson",
      referee: "Daniel Harris",
      score: "53-29",
    },
  ];

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionContainerTitle>Games</SectionContainerTitle>

        <HeaderFilterContainer>
          <OutlineColorButton title="Upload schedule cSV" icon="upload" />
          <FullColorButton title="Add new game" margin="0 0 0 20px" />
        </HeaderFilterContainer>
      </SectionHeader>

      <ScrolledGameTableContainer>
        <ScrolledTableWrapper>
          <TableContainer>
            <thead>
              <tr>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Day/Time <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Location <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Home team <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Coach <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Away team <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Coach <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Referee <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle>
                  <TableCenterCellContainer>
                    Score <SortingIcon />
                  </TableCenterCellContainer>
                </TableHeaderTitle>
                <TableHeaderTitle center>Action</TableHeaderTitle>
              </tr>
            </thead>
            <TableBodyContainer>
              {data.map((item) => (
                <GameTableRow key={item.id}>
                  <GamesTableCell>
                    <span>{item.date}</span>
                  </GamesTableCell>
                  <GamesTableCell>
                    <span>{item.location}</span>
                  </GamesTableCell>
                  <GamesTableCell>
                    <TableCenterCellContainer>
                      <TeamLogo>
                        {item.homeTeamImage ? (
                          <img src={item.homeTeamImage} alt="team logo" />
                        ) : (
                          <ColoredPlugLogo
                            name={item.homeTeamName}
                            width={32}
                            height={32}
                          />
                        )}
                      </TeamLogo>
                      <div>
                        <span>{item.homeTeamName}</span>
                      </div>
                    </TableCenterCellContainer>
                  </GamesTableCell>
                  <GamesTableCell>
                    <span>{item.homeTeamCoach}</span>
                  </GamesTableCell>
                  <GamesTableCell>
                    <TableCenterCellContainer>
                      <TeamLogo>
                        {item.awayTeamImage ? (
                          <img src={item.awayTeamImage} alt="team logo" />
                        ) : (
                          <ColoredPlugLogo
                            name={item.awayTeamName}
                            width={32}
                            height={32}
                          />
                        )}
                      </TeamLogo>
                      <div>
                        <span>{item.awayTeamName}</span>
                      </div>
                    </TableCenterCellContainer>
                  </GamesTableCell>
                  <GamesTableCell>
                    <span>{item.awayTeamCoach}</span>
                  </GamesTableCell>
                  <GamesTableCell>
                    <span>{item.referee}</span>
                  </GamesTableCell>
                  <GamesTableCell style={{ width: "80px" }}>
                    {item.score}
                  </GamesTableCell>
                  <GamesTableCell center style={{ width: "80px" }}>
                    <EditIcon />
                  </GamesTableCell>
                </GameTableRow>
              ))}
            </TableBodyContainer>
          </TableContainer>
        </ScrolledTableWrapper>
      </ScrolledGameTableContainer>
      <PaginationContainer>
        <PaginationArrowContainer disabled>
          <ArrowLeft color={true ? "#E4E5E5" : "#FFFFFF"} />
        </PaginationArrowContainer>
        <PaginationItemContainer active>1</PaginationItemContainer>
        <PaginationItemContainer>2</PaginationItemContainer>
        <PaginationItemContainer>...</PaginationItemContainer>
        <PaginationItemContainer>9</PaginationItemContainer>
        <PaginationItemContainer>10</PaginationItemContainer>
        <PaginationArrowContainer>
          <ArrowRight color={false ? "#E4E5E5" : "#FFFFFF"} />
        </PaginationArrowContainer>
      </PaginationContainer>
    </SectionContainer>
  );
};

export default Games;
