import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Typography } from 'antd'
import Flex from 'antd/es/flex'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import TagType from '@/pages/Protected/LeaguesAndTournaments/components/TagType'

import { MonroeBlueText, MonroeSecondaryButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useDeleteLeagueMutation, useGetLeagueQuery } from '@/redux/leagues/leagues.api'

import { PATH_TO_CREATE_SEASON, PATH_TO_EDIT_LEAGUE, PATH_TO_LEAGUES, PATH_TO_SEASON_DETAILS } from '@/constants/paths'

import { IIdName } from '@/common/interfaces'

import './league-details.styles.css'

import WhiteTShirtIcon from '@/assets/icons/white-team.svg'

const STANDING_FORMAT_WINNING_INFO = 'Wins (info only), Losses (info only), Winning %'
const STANDING_FORMAT_POINTS_INFO =
  'Wins, Losses, Draws, Points (3 for a win, 1 for a draw, 0 for a loss), Goals For [GF], Goals Against [GA], Goal Differential [GD]'
const TIEBREAKERS_FORMAT_POINTS_INFO = 'Head to Head, Goal Differential, Goals Allowed'
const TIEBREAKERS_FORMAT_WINNING_INFO =
  'Head to Head (Winning % between all teams), Winning % vs common opponents, Winning % vs all subdivision teams, Winning % vs all division teams'

const LeagueDetails = () => {
  const params = useParams<{ id: string }>()
  const leagueId = params.id || ''
  const {
    isError,
    isLoading,
    currentData: data,
    isFetching,
  } = useGetLeagueQuery(leagueId, {
    skip: !leagueId,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: true,
  })
  const navigate = useNavigate()
  const [deleteLeague] = useDeleteLeagueMutation()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { setSelectedLeague } = useSeasonSlice()

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_LEAGUES}>League & Tourn</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  const goToEditPage = () => navigate(`${PATH_TO_EDIT_LEAGUE}/${leagueId}`)

  const handleDelete = () =>
    deleteLeague({ id: leagueId })
      .unwrap()
      .then(() => {
        setShowDeleteModal(false)
        navigate(PATH_TO_LEAGUES)
      })

  useEffect(() => {
    if (!data && !isLoading && !isFetching) navigate(PATH_TO_LEAGUES)
  }, [isError, isLoading, data, isFetching])

  return (
    <BaseLayout>
      <>
        {showDeleteModal && (
          <MonroeModal
            okText="Delete"
            onCancel={() => setShowDeleteModal(false)}
            onOk={handleDelete}
            title="Delete league/tournament?"
            type="warn"
            content={<p>Are you sure you want to delete this league/tournament?</p>}
          />
        )}

        {!data && (isLoading || isFetching) && <Loader />}

        {data && (
          <PageContainer>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <Flex justify="space-between">
              <ProtectedPageTitle>{data?.name}</ProtectedPageTitle>

              <Flex>
                <MonroeButton
                  isDisabled={false}
                  label="Delete"
                  type="default"
                  icon={<DeleteOutlined />}
                  iconPosition="start"
                  onClick={() => setShowDeleteModal(true)}
                  className="view-delete-button"
                />

                <MonroeSecondaryButton
                  type="default"
                  icon={<EditOutlined />}
                  iconPosition="start"
                  onClick={goToEditPage}
                >
                  Edit
                </MonroeSecondaryButton>

                <MonroeSecondaryButton
                  type="default"
                  icon={<PlusOutlined />}
                  iconPosition="start"
                  onClick={() => {
                    setSelectedLeague({
                      id: data.id,
                      name: data.name,
                    })
                    navigate(PATH_TO_CREATE_SEASON)
                  }}
                >
                  Create season
                </MonroeSecondaryButton>

                <MonroeButton
                  isDisabled={false}
                  label="Connect team"
                  type="primary"
                  icon={<ReactSVG src={WhiteTShirtIcon} />}
                  iconPosition="start"
                  onClick={() => {}}
                  style={{
                    height: '32px',
                  }}
                />
              </Flex>
            </Flex>

            <Flex vertical>
              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Type:</Typography.Text>
                <TagType text={data!.type} />
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Playoff format:</Typography.Text>
                <Typography.Text className="view-text" style={{ width: '180px' }}>
                  {data?.playoffFormat}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Standings format:</Typography.Text>

                <Flex vertical>
                  <Typography.Text className="view-text">{data?.standingsFormat}</Typography.Text>

                  <Typography.Text className="view-text-info field-value-container">
                    {data?.standingsFormat === 'Winning %' ? STANDING_FORMAT_WINNING_INFO : STANDING_FORMAT_POINTS_INFO}
                  </Typography.Text>
                </Flex>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Tiebreakers format:</Typography.Text>

                <Flex vertical>
                  <Typography.Text className="view-text">{data?.tiebreakersFormat}</Typography.Text>

                  <Typography.Text className="view-text-info field-value-container">
                    {data?.tiebreakersFormat === 'Winning %'
                      ? TIEBREAKERS_FORMAT_WINNING_INFO
                      : TIEBREAKERS_FORMAT_POINTS_INFO}
                  </Typography.Text>
                </Flex>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Description:</Typography.Text>
                <Typography.Text className="view-text field-value-container">
                  {data?.description || '-'}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Welcome Note:</Typography.Text>
                <Typography.Text className="view-text field-value-container">
                  {data?.welcomeNote || '-'}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Connected seasons:</Typography.Text>

                <div className="field-value-container">
                  {data?.seasons.length
                    ? (data?.seasons as IIdName[]).map((season, idx) => (
                        <Fragment key={season.id}>
                          <Typography.Text
                            className="view-season-text"
                            onClick={() => navigate(`${PATH_TO_SEASON_DETAILS}/${season.id}`)}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            {season.name}
                          </Typography.Text>

                          {idx === data.seasons.length - 1 ? (
                            ''
                          ) : (
                            <Typography
                              style={{
                                color: 'rgba(62, 52, 202, 1)',
                                fontSize: '14px',
                              }}
                            >
                              ,
                            </Typography>
                          )}
                        </Fragment>
                      ))
                    : '-'}
                </div>
              </Flex>
            </Flex>
          </PageContainer>
        )}
      </>
    </BaseLayout>
  )
}

export default LeagueDetails
