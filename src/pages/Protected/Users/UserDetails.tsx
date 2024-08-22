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
  MonroeLightBlueText,
  MonroeLinkText,
  PageContainer,
  ProtectedPageTitle,
  ViewText,
} from '@/components/Elements'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

import { PATH_TO_EDIT_USER, PATH_TO_USERS } from '@/constants/paths'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'

import CopyIcon from '@/assets/icons/copy.svg'
import LockIcon from '@/assets/icons/small-lock.svg'

const UserDetails = () => {
  useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showBlockModal, setShowBlockModal] = useState(false)
  const { setAppNotification } = useAppSlice()

  const handleCopyContent = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)

      setAppNotification({
        message: 'Phone successfully copied',
        timestamp: new Date().getTime(),
        type: 'success',
      })
    } catch {
      // TODO: think about this issue
    }
  }

  const mockedUserData = {
    id: '123ds123d',
    name: 'Joe Doe',
    birthDate: '1999-10-07',
    email: 'joedoe@example.com',
    phoneNumber: '(405) 555-0128',
    zipCode: '8502',
    roles: [
      {
        name: 'Player',
        linkedEntities: [
          {
            name: 'Team name 1',
          },
          {
            name: 'Team name 2',
          },
          {
            name: 'Team name 3',
          },
        ],
      },
      {
        name: 'Guardian',
        linkedEntities: [
          {
            name: 'Lily Colins',
          },
        ],
      },
    ],
    gender: 0,
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_USERS}>Users</a>,
    },
    {
      title: <MonroeBlueText>{mockedUserData?.name}</MonroeBlueText>,
    },
  ]

  const handleBlock = () => {}

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

        {!!mockedUserData && (
          <PageContainer>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <Flex justify="space-between">
              <ProtectedPageTitle>{mockedUserData?.name}</ProtectedPageTitle>

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
                  onClick={() => navigate(`${PATH_TO_EDIT_USER}/${mockedUserData.id}`)}
                  style={{ height: '32px' }}
                />
              </Flex>
            </Flex>

            <Flex vertical>
              <Flex className="mb-16">
                <ViewText>Gender:</ViewText>
                <DetailValue>{FULL_GENDER_NAMES[mockedUserData.gender as TGender]}</DetailValue>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Birth Date:</ViewText>
                <DetailValue>{format(new Date(mockedUserData.birthDate), 'MMM d, yyyy')}</DetailValue>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Email:</ViewText>
                <MonroeLightBlueText>{mockedUserData.email}</MonroeLightBlueText>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Phone:</ViewText>

                <Flex align="center">
                  <ViewText style={{ width: 'auto' }}>{mockedUserData.phoneNumber}</ViewText>

                  <div onClick={() => handleCopyContent(mockedUserData.phoneNumber)}>
                    <ReactSVG src={CopyIcon} />
                  </div>
                </Flex>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Zip Code:</ViewText>
                <ViewText>{mockedUserData.zipCode}</ViewText>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Roles:</ViewText>

                <Flex vertical>
                  {mockedUserData.roles.map((role) => (
                    <Flex key={role.name} vertical style={{ marginBottom: '8px' }}>
                      <ViewText>{role.name}</ViewText>
                      <Flex>
                        {role.linkedEntities.map((entity, idx) => (
                          <>
                            <MonroeLinkText key={entity.name} style={{ marginRight: '4px' }}>
                              {entity.name}
                              {role.linkedEntities.length - 1 === idx ? '' : ','}
                            </MonroeLinkText>
                          </>
                        ))}
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </PageContainer>
        )}
      </BaseLayout>
    </>
  )
}

export default UserDetails

