import { EditOutlined } from '@ant-design/icons'
import Breadcrumb from 'antd/es/breadcrumb/Breadcrumb'
import Flex from 'antd/es/flex'
import { format } from 'date-fns'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import {
  DetailValue,
  MonroeBlueText,
  MonroeDeleteButton,
  MonroeLinkText,
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
import { useBulkBlockUsersMutation, useBulkEditMutation, useGetUserDetailsQuery } from '@/redux/user/user.api'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_EDIT_USER, PATH_TO_MASTER_TEAMS, PATH_TO_USERS } from '@/common/constants/paths'
import { TGender } from '@/common/types'

import CopyIcon from '@/assets/icons/copy.svg'
import LockIcon from '@/assets/icons/small-lock.svg'
import UnblockSilverIcon from '@/assets/icons/unblock-silver.svg'

const UserDetails = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setAppNotification } = useAppSlice()
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showUnblockModal, setShowUnblockModal] = useState(false)
  const { data, isLoading, isFetching } = useGetUserDetailsQuery(
    { id: params?.id || '' },
    { skip: !params.id, refetchOnMountOrArgChange: true },
  )
  const [bulkBlockUser] = useBulkBlockUsersMutation()
  const [bulkEdit] = useBulkEditMutation()

  const handleCopyContent = async (text: string, type: 'email' | 'phone') =>
    navigator.clipboard.writeText(text).then(() =>
      setAppNotification({
        message: `${type === 'phone' ? 'Phone' : 'Email'} successfully copied`,
        timestamp: new Date().getTime(),
        type: 'success',
      }),
    )

  const handleBlock = () =>
    bulkBlockUser([data?.id as string])
      .unwrap()
      .then((response) => {
        if (response.status === 'green') {
          setAppNotification({
            message: 'User successfully blocked.',
            timestamp: new Date().getTime(),
            type: 'success',
          })
          setShowBlockModal(false)
        } else {
          setAppNotification({
            message: response.items[0].warning,
            timestamp: new Date().getTime(),
            type: 'error',
          })
          setShowBlockModal(false)
        }
      })

  const handleUnblockSingleUser = () => {
    bulkEdit([
      {
        id: data?.id as string,
        is_active: true,
      },
    ])
      .unwrap()
      .then((response) => {
        if (response.status === 'green') {
          setAppNotification({
            message: 'User have been successfully unblocked.',
            timestamp: new Date().getTime(),
            type: 'success',
          })
        } else {
          setAppNotification({
            message: 'Something went wrong',
            timestamp: new Date().getTime(),
            type: 'error',
          })
        }
      })
      .catch(() => {
        setAppNotification({
          message: 'Something went wrong',
          timestamp: new Date().getTime(),
          type: 'error',
        })
      })
      .finally(() => {
        setShowUnblockModal(false)
      })
  }

  if (!data || isLoading || isFetching) return <Loader />

  const userFullName = data.firstName + ' ' + data.lastName

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_USERS}>Users</a>,
    },
    {
      title: <MonroeBlueText>{userFullName}</MonroeBlueText>,
    },
  ]

  return (
    <>
      <Helmet>Admin Panel | Season Details</Helmet>

      <BaseLayout>
        {showBlockModal && (
          <MonroeModal
            okText="Block"
            onCancel={() => setShowBlockModal(false)}
            onOk={handleBlock}
            title="Block user?"
            type="warn"
            content={<p>Are you sure you want to block this user?</p>}
          />
        )}

        {showUnblockModal && (
          <MonroeModal
            okText="Unblock"
            onCancel={() => setShowUnblockModal(false)}
            onOk={handleUnblockSingleUser}
            title="Unblock user?"
            type="warn"
            content={<p>Are you sure you want to unblock this user?</p>}
          />
        )}

        <PageContainer>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Flex justify="space-between">
            <ProtectedPageTitle>{userFullName}</ProtectedPageTitle>

            <Flex>
              {data.isActive && (
                <MonroeDeleteButton
                  icon={<ReactSVG src={LockIcon} />}
                  iconPosition="start"
                  onClick={() => setShowBlockModal(true)}
                >
                  Block
                </MonroeDeleteButton>
              )}

              {!data.isActive && (
                <MonroeSecondaryButton
                  iconPosition="start"
                  icon={<ReactSVG src={UnblockSilverIcon} />}
                  onClick={() => setShowUnblockModal(true)}
                >
                  Unblock
                </MonroeSecondaryButton>
              )}

              <MonroeButton
                label="Edit"
                type="primary"
                icon={<EditOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_USER}/${data.id}`)}
                className="h-32"
              />
            </Flex>
          </Flex>

          <Flex vertical>
            <Flex className="mb-16">
              <ViewText>Gender:</ViewText>
              <DetailValue>{FULL_GENDER_NAMES[data.gender as TGender]}</DetailValue>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Birth Date:</ViewText>
              <DetailValue>{data.birthDate ? format(new Date(data.birthDate), 'MMM d, yyyy') : '-'}</DetailValue>
            </Flex>

            <Flex className="c-p mb-16" align="center">
              <ViewText>Email:</ViewText>
              <ViewText className="w-auto mg-r4">{data.email || '-'}</ViewText>

              {data.email && (
                <div className="c-p mg-l8" onClick={() => handleCopyContent(data.email, 'email')}>
                  <ReactSVG src={CopyIcon} />
                </div>
              )}
            </Flex>

            <Flex className="mb-16">
              <ViewText>Phone:</ViewText>

              <Flex align="center">
                <ViewText className="w-auto">{data.phoneNumber || '-'}</ViewText>

                {data.phoneNumber && (
                  <div className="c-p" onClick={() => handleCopyContent(data.phoneNumber, 'phone')}>
                    <ReactSVG src={CopyIcon} />
                  </div>
                )}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Zip Code:</ViewText>
              <ViewText>{data.zipCode || '-'}</ViewText>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Roles:</ViewText>

              <Flex vertical>
                {data.isSuperuser && <ViewText className="mg-b8 w-250">Master Admin</ViewText>}

                {!!data.operator && (
                  <Flex vertical className="mg-b8">
                    <ViewText>Operator</ViewText>
                    <ViewText className="mg-r4">{data.operator.name}</ViewText>
                  </Flex>
                )}

                {!!data.asTeamAdmin?.length && (
                  <Flex vertical className="mg-b8">
                    <ViewText>Team Admin</ViewText>
                    <Flex>
                      {data.asTeamAdmin.map((team, idx, arr) => (
                        <MonroeLinkText
                          key={team.name}
                          className="mg-r4"
                          onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + team.id)}
                        >
                          {team.name}
                          {arr.length - 1 === idx ? ';' : ','}
                        </MonroeLinkText>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {!!data.asHeadCoach?.length && (
                  <Flex vertical className="mg-b8">
                    <ViewText>Head Coach</ViewText>
                    <Flex>
                      {data.asHeadCoach.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText
                            key={team.name}
                            className="mg-r4"
                            onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + team.id)}
                          >
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {!!data.asCoach?.teams.length && (
                  <Flex vertical className="mg-b8">
                    <ViewText>Coach</ViewText>
                    <Flex>
                      {data.asCoach.teams.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText
                            key={team.name}
                            className="mg-r4"
                            onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + team.id)}
                          >
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {!!data.asPlayer?.teams.length && (
                  <Flex vertical className="mg-b8">
                    <ViewText>Player</ViewText>
                    <Flex>
                      {data.asPlayer.teams.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText
                            key={team.name}
                            className="mg-r4"
                            onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + team.id)}
                          >
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {!!data.asParent && (
                  <Flex className="mg-b8" vertical>
                    <ViewText>Guardian</ViewText>
                    <Flex>
                      {data.asParent.map((child, idx, arr) => (
                        <>
                          <MonroeLinkText
                            key={child.id}
                            className="mg-r4"
                            onClick={() => navigate(PATH_TO_USERS + '/' + child.id)}
                          >
                            {child.firstName} {child.lastName}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {data.isChild && <ViewText>Child</ViewText>}
              </Flex>
            </Flex>
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default UserDetails

