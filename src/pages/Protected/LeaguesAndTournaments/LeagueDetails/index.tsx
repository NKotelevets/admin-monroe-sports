import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Typography } from 'antd'
import Flex from 'antd/es/flex'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import TagType from '@/pages/Protected/LeaguesAndTournaments/components/TagType'

import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useDeleteLeagueMutation, useGetLeagueQuery } from '@/redux/leagues/leagues.api'

import {
  PATH_TO_EDIT_LEAGUE_TOURNAMENT,
  PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
  PATH_TO_SEASONS_DETAILS,
} from '@/constants/paths'

import { IIdName } from '@/common/interfaces'

import './league-details.styles.css'

import TeamsIcon from '@/assets/icons/sidebar/t-shirt.svg'

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

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>League & Tourn</a>,
    },
    {
      title: (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {data?.name}
        </Typography.Text>
      ),
    },
  ]

  const goToEditPage = () => navigate(`${PATH_TO_EDIT_LEAGUE_TOURNAMENT}/${leagueId}`)

  const handleDelete = () =>
    deleteLeague({ id: leagueId })
      .unwrap()
      .then(() => {
        setShowDeleteModal(false)
        navigate(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE)
      })

  useEffect(() => {
    if (!data && !isLoading && !isFetching) navigate(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE)
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
            content={
              <>
                <p>Are you sure you want to delete this league/tournament?</p>
              </>
            }
          />
        )}

        {!data && (isLoading || isFetching) && <Loader />}

        {data && (
          <Flex className="view-container" vertical>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <Flex justify="space-between">
              <Typography.Title level={1} className="title">
                {data?.name}
              </Typography.Title>

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

                <MonroeButton
                  isDisabled={false}
                  label="Edit"
                  type="default"
                  icon={<EditOutlined />}
                  iconPosition="start"
                  onClick={goToEditPage}
                  className="view-edit-button"
                />

                <MonroeButton
                  isDisabled={false}
                  label="Create season"
                  type="default"
                  icon={<PlusOutlined />}
                  iconPosition="start"
                  onClick={() => {}}
                  className="view-edit-button"
                />

                <MonroeButton
                  isDisabled={false}
                  label="Connect team"
                  type="primary"
                  icon={<ReactSVG src={TeamsIcon} />}
                  iconPosition="start"
                  onClick={() => {}}
                  className="view-connect-team-button"
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
                            onClick={() => navigate(`${PATH_TO_SEASONS_DETAILS}/${season.id}`)}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            {season.name}
                          </Typography.Text>

                          {idx === data.seasons.length - 1 ? (
                            ''
                          ) : (
                            <Typography.Text className="view-season-divider">,</Typography.Text>
                          )}
                        </Fragment>
                      ))
                    : '-'}
                </div>
              </Flex>
            </Flex>
          </Flex>
        )}
      </>
    </BaseLayout>
  )
}

export default LeagueDetails
