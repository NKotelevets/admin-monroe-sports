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
  PageContainer,
  ProtectedPageTitle,
  ViewText,
} from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useGetUserDetailsQuery } from '@/redux/user/user.api'

import { PATH_TO_EDIT_USER, PATH_TO_USERS } from '@/constants/paths'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'

import CopyIcon from '@/assets/icons/copy.svg'
import LockIcon from '@/assets/icons/small-lock.svg'

const UserDetails = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setAppNotification } = useAppSlice()
  const [showBlockModal, setShowBlockModal] = useState(false)
  const { data, isLoading, isFetching } = useGetUserDetailsQuery(
    { id: params?.id || '' },
    { skip: !params.id, refetchOnMountOrArgChange: true },
  )

  const handleCopyContent = async (text: string, type: 'email' | 'phone') =>
    navigator.clipboard.writeText(text).then(() =>
      setAppNotification({
        message: `${type === 'phone' ? 'Phone' : 'Email'} successfully copied`,
        timestamp: new Date().getTime(),
        type: 'success',
      }),
    )

  const handleBlock = () => {}

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
            okText="Delete"
            onCancel={() => setShowBlockModal(false)}
            onOk={handleBlock}
            title="Block user?"
            type="warn"
            content={
              <>
                <p>Are you sure you want to block this user?</p>
              </>
            }
          />
        )}

        <PageContainer>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Flex justify="space-between">
            <ProtectedPageTitle>{userFullName}</ProtectedPageTitle>

            <Flex>
              <MonroeDeleteButton
                icon={<ReactSVG src={LockIcon} />}
                iconPosition="start"
                onClick={() => setShowBlockModal(true)}
              >
                Delete
              </MonroeDeleteButton>

              <MonroeButton
                isDisabled={false}
                label="Edit"
                type="primary"
                icon={<EditOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_USER}/${data.id}`)}
                style={{ height: '32px' }}
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

            <Flex className="mb-16" align="center" style={{ cursor: 'pointer' }}>
              <ViewText>Email:</ViewText>
              <ViewText style={{ width: 'auto', marginRight: '0px' }}>{data.email}</ViewText>

              <div
                onClick={() => handleCopyContent(data.email, 'email')}
                style={{ marginLeft: '8px', cursor: 'pointer' }}
              >
                <ReactSVG src={CopyIcon} />
              </div>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Phone:</ViewText>

              <Flex align="center">
                <ViewText style={{ width: 'auto' }}>{data.phoneNumber || '-'}</ViewText>

                {data.phoneNumber && (
                  <div onClick={() => handleCopyContent(data.phoneNumber, 'phone')} style={{ cursor: 'pointer' }}>
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
                {data.isSuperuser && (
                  <ViewText style={{ width: '250px', marginBottom: '8px' }}>Swift Schedule Master Admin</ViewText>
                )}

                {data.operator && (
                  <Flex vertical>
                    <ViewText style={{ width: '250px', marginBottom: '8px' }}>Operator</ViewText>

                    <MonroeLinkText
                      onClick={() => navigate(PATH_TO_USERS + '/' + data.operator?.id)}
                      style={{ marginRight: '4px' }}
                    >
                      {data.operator.name}
                    </MonroeLinkText>
                  </Flex>
                )}

                {data.asTeamAdmin && (
                  <Flex key="teamAdmin" vertical style={{ marginBottom: '8px' }}>
                    <ViewText>Team Admin</ViewText>
                    <Flex>
                      {data.asTeamAdmin.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText key={team.name} style={{ marginRight: '4px' }}>
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {data.asHeadCoach && (
                  <Flex key="teamAdmin" vertical style={{ marginBottom: '8px' }}>
                    <ViewText>Head Coach</ViewText>
                    <Flex>
                      {data.asHeadCoach.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText key={team.name} style={{ marginRight: '4px' }}>
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {data.asCoach && (
                  <Flex key="coach" vertical style={{ marginBottom: '8px' }}>
                    <ViewText>Coach</ViewText>
                    <Flex>
                      {data.asCoach.teams.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText key={team.name} style={{ marginRight: '4px' }}>
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {data.asPlayer && (
                  <Flex key="player" vertical style={{ marginBottom: '8px' }}>
                    <ViewText>Player</ViewText>
                    <Flex>
                      {data.asPlayer.teams.map((team, idx, arr) => (
                        <>
                          <MonroeLinkText key={team.name} style={{ marginRight: '4px' }}>
                            {team.name}
                            {arr.length - 1 === idx ? ';' : ','}
                          </MonroeLinkText>
                        </>
                      ))}
                    </Flex>
                  </Flex>
                )}

                {data.asParent && (
                  <Flex key="player" vertical style={{ marginBottom: '8px' }}>
                    <ViewText>Guardian</ViewText>
                    <Flex>
                      {data.asParent.map((child, idx, arr) => (
                        <>
                          <MonroeLinkText
                            key={child.id}
                            style={{ marginRight: '4px' }}
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

