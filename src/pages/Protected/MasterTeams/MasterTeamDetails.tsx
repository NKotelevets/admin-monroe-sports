import { PlusOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
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
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_MASTER_TEAMS } from '@/constants/paths'

import CopyIcon from '@/assets/icons/copy.svg'

const MasterTeamDetails = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const { setAppNotification } = useAppSlice()

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a>,
    },
    {
      title: <MonroeBlueText>New Orleans Saints</MonroeBlueText>,
    },
  ]

  const handleDelete = () => {}

  const handleCopyContent = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text)

      setAppNotification({
        message: `${type === 'phone' ? 'Phone' : 'Email'} successfully copied`,
        timestamp: new Date().getTime(),
        type: 'success',
      })
    } catch {
      // TODO: think about this issue
    }
  }

  const mockedTeamAdministrators = [
    {
      id: '123',
      name: 'Floyd Miles',
      email: 'jackson.graham@example.com',
      phoneNumber: '123456789',
    },
    {
      id: '1234',
      name: 'Floyd Miles',
      email: 'jackson.graham@example.com',
      phoneNumber: '123456789',
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
          onOk={handleDelete}
          title={`Delete New Orleans Saints ?`}
          type="warn"
          content={
            <>
              <p>Are you sure you want to delete this master team?</p>
            </>
          }
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Flex justify="space-between">
            <ProtectedPageTitle>New Orleans Saints</ProtectedPageTitle>

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
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/:id`)}
                style={{ height: '32px' }}
              >
                Edit
              </MonroeSecondaryButton>

              <MonroeButton
                isDisabled={false}
                label="Connect to league/tourn"
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="start"
                onClick={() => navigate(`${PATH_TO_EDIT_MASTER_TEAM}/:id`)}
                style={{ height: '32px' }}
              />
            </Flex>
          </Flex>

          <Flex vertical>
            <Flex className="mb-16">
              <ViewText>Team Administrator:</ViewText>

              <Flex vertical>
                {mockedTeamAdministrators.map((teamAdministrator) => (
                  <Flex align="center">
                    <MonroeLightBlueText>{teamAdministrator.name}</MonroeLightBlueText>•
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.email}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.email, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    •
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.phoneNumber}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.phoneNumber, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Head Coach:</ViewText>

              <Flex align="center">
                <MonroeLightBlueText>{mockedTeamAdministrators[0].name}</MonroeLightBlueText>•
                <Flex align="center">
                  <DetailValue>{mockedTeamAdministrators[0].email}</DetailValue>
                  <div
                    onClick={() => handleCopyContent(mockedTeamAdministrators[0].email, 'email')}
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                  >
                    <ReactSVG src={CopyIcon} />
                  </div>
                </Flex>
                •
                <Flex align="center">
                  <DetailValue>{mockedTeamAdministrators[0].phoneNumber}</DetailValue>
                  <div
                    onClick={() => handleCopyContent(mockedTeamAdministrators[0].phoneNumber, 'email')}
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                  >
                    <ReactSVG src={CopyIcon} />
                  </div>
                </Flex>
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Coach(es):</ViewText>

              <Flex vertical>
                {mockedTeamAdministrators.map((teamAdministrator) => (
                  <Flex align="center">
                    <MonroeLightBlueText>{teamAdministrator.name}</MonroeLightBlueText>•
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.email}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.email, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    •
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.phoneNumber}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.phoneNumber, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Players:</ViewText>

              <Flex vertical>
                {mockedTeamAdministrators.map((teamAdministrator) => (
                  <Flex align="center">
                    <MonroeLightBlueText>{teamAdministrator.name}</MonroeLightBlueText>•
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.email}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.email, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                    •
                    <Flex align="center">
                      <DetailValue>{teamAdministrator.phoneNumber}</DetailValue>
                      <div
                        onClick={() => handleCopyContent(teamAdministrator.phoneNumber, 'email')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                      >
                        <ReactSVG src={CopyIcon} />
                      </div>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex className="mb-16">
              <ViewText>Linked league/tourn:</ViewText>

              <Flex vertical>
                {mockedTeamAdministrators.map(() => (
                  <Flex vertical>
                    <Flex align="center">
                      <MonroeLightBlueText>League team name</MonroeLightBlueText>•
                      <MonroeLightBlueText>League name</MonroeLightBlueText>
                    </Flex>

                    <DetailValue>Division, Subdivision</DetailValue>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default MasterTeamDetails

