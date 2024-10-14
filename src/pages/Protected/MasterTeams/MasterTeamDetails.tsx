import { PlusOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import {
  DetailValue,
  MonroeBlueText,
  MonroeDeleteButton,
  MonroeLightBlueText,
  MonroeSecondaryButton,
  PageContainer,
  ProtectedPageTitle,
  ViewText,
} from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useDeleteMasterTeamMutation, useGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_MASTER_TEAMS, PATH_TO_USERS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'

import CopyIcon from '@/assets/icons/copy.svg'

const MasterTeamDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const { setAppNotification } = useAppSlice()
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useGetMasterTeamQuery({ id: params.id || '' }, { skip: !params.id })
  const [deleteMT] = useDeleteMasterTeamMutation()

  const handleDelete = (id: string) =>
    deleteMT(id)
      .unwrap()
      .then(() => navigate(PATH_TO_MASTER_TEAMS))
      .catch((error) => {
        setAppNotification({
          message: (error as IDetailedError).details,
          type: 'error',
        })
      })

  const handleCopyContent = async (text: string, type: 'email' | 'phone') => {
    await navigator.clipboard.writeText(text)

    setAppNotification({
      message: `${type === 'phone' ? 'Phone' : 'Email'} successfully copied`,
      timestamp: new Date().getTime(),
      type: 'success',
    })
  }

  const handleUserFullNameClick = (id: string) => navigate(`${PATH_TO_USERS}/${id}`)

  useEffect(() => {
    if (isError) {
      navigate(PATH_TO_MASTER_TEAMS)
      setAppNotification({
        message: (error as IDetailedError).details,
        type: 'error',
      })
    }
  }, [isError])

  if (isLoading || !data) return <Loader />

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a>,
    },
    {
      title: <MonroeBlueText>{data.name}</MonroeBlueText>,
    },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Panel | Master Team Details</title>
      </Helmet>

      {showDeleteModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => handleDelete(params.id as string)}
          title={`Delete ${data.name}?`}
          type="warn"
          content={<p>Are you sure you want to delete {data.name}?</p>}
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Flex justify="space-between">
            <ProtectedPageTitle>{data.name}</ProtectedPageTitle>

            <Flex>
              <MonroeDeleteButton
                icon={<DeleteOutlined />}
                iconPosition="start"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </MonroeDeleteButton>

              <MonroeSecondaryButton
                icon={<EditOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/${params!.id}`)}
                className="h-32"
              >
                Edit
              </MonroeSecondaryButton>

              <MonroeButton
                isDisabled
                label="Connect to league/tourn"
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/:id`)}
                className="h-32"
              />
            </Flex>
          </Flex>

          <Flex vertical>
            <Flex className="mb-16">
              <ViewText>Team Administrator:</ViewText>

              <Flex vertical>
                {data.teamsAdmins.map((teamAdministrator) => (
                  <Flex align="center">
                    <MonroeLightBlueText className="c-p" onClick={() => handleUserFullNameClick(teamAdministrator.id)}>
                      {teamAdministrator.fullName}
                    </MonroeLightBlueText>
                    •
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.email}</DetailValue>
                      <div onClick={() => handleCopyContent(teamAdministrator.email, 'email')} className="c-p mg-l8">
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    {teamAdministrator.phone ? (
                      <>
                        •
                        <Flex align="center">
                          <DetailValue>{teamAdministrator.phone}</DetailValue>
                          <div
                            onClick={() => handleCopyContent(teamAdministrator.phone as string, 'phone')}
                            className="mg-l8 c-p"
                          >
                            <ReactSVG src={CopyIcon} />
                          </div>
                        </Flex>
                      </>
                    ) : (
                      ''
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Head Coach:</ViewText>

              <Flex align="center">
                <MonroeLightBlueText className="c-p" onClick={() => handleUserFullNameClick(data.headCoach.id)}>
                  {data.headCoach.fullName}
                </MonroeLightBlueText>
                •
                <Flex align="center">
                  <DetailValue>{data.headCoach.email}</DetailValue>
                  <div onClick={() => handleCopyContent(data.headCoach.email as string, 'email')} className="c-p mg-l8">
                    <ReactSVG src={CopyIcon} />
                  </div>
                </Flex>
                {data.headCoach.phone ? (
                  <>
                    •
                    <Flex align="center">
                      <DetailValue>{data.headCoach.phone}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(data.headCoach.phone as string, 'phone')}
                        className="c-p mg-l8"
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                  </>
                ) : (
                  ''
                )}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Coach(es):</ViewText>

              <Flex vertical>
                {data.coaches.map((coach) => (
                  <Flex align="center">
                    <MonroeLightBlueText className="c-p" onClick={() => handleUserFullNameClick(coach.id)}>
                      {coach.fullName}
                    </MonroeLightBlueText>
                    •
                    <Flex align="center">
                      <DetailValue>{coach.email}</DetailValue>
                      <div onClick={() => handleCopyContent(coach.email, 'email')} className="c-p mg-l8">
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    {coach.phone ? (
                      <>
                        •
                        <Flex align="center">
                          <DetailValue>{coach.phone}</DetailValue>
                          <div onClick={() => handleCopyContent(coach.phone as string, 'phone')} className="c-p mg-l8">
                            <ReactSVG src={CopyIcon} />
                          </div>
                        </Flex>
                      </>
                    ) : (
                      ''
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Players:</ViewText>

              <Flex vertical>
                {data.players.map((player) => (
                  <Flex align="center">
                    <MonroeLightBlueText className="c-p" onClick={() => handleUserFullNameClick(player.id)}>
                      {player.fullName}
                    </MonroeLightBlueText>
                    •
                    <Flex align="center">
                      <DetailValue>{player.email}</DetailValue>
                      <div onClick={() => handleCopyContent(player.email, 'email')} className="c-p mg-l8">
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    {player.phone ? (
                      <>
                        •
                        <Flex align="center">
                          <DetailValue>{player.phone}</DetailValue>
                          <div onClick={() => handleCopyContent(player.phone as string, 'phone')} className="c-p mg-l8">
                            <ReactSVG src={CopyIcon} />
                          </div>
                        </Flex>
                      </>
                    ) : (
                      ''
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16" align="center">
              <ViewText className="w-auto">Linked league/tourn:</ViewText>

              <Flex vertical>-</Flex>
            </Flex>
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default MasterTeamDetails

