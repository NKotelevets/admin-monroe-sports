import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import Typography from 'antd/es/typography'
import { format } from 'date-fns'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

import { MonroeBlueText, MonroeLinkText, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useDeleteSeasonMutation, useGetSeasonDetailsQuery } from '@/redux/seasons/seasons.api'

import { PATH_TO_EDIT_SEASON, PATH_TO_LEAGUE_PAGE, PATH_TO_SEASONS } from '@/constants/paths'

export const SeasonDetails = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetSeasonDetailsQuery(params?.id || '', {
    skip: !params?.id,
    refetchOnMountOrArgChange: true,
  })
  const [deleteSeason] = useDeleteSeasonMutation()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    if (data) {
      deleteSeason({ id: data.id }).then(() => {
        navigate(PATH_TO_SEASONS)
      })
    }
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_SEASONS}>Seasons</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  return (
    <>
      <Helmet>Admin Panel | Season Details</Helmet>

      <BaseLayout>
        {!data && isLoading && <Loader />}

        {showDeleteModal && (
          <MonroeModal
            okText="Delete"
            onCancel={() => setShowDeleteModal(false)}
            onOk={handleDelete}
            title="Delete season?"
            type="warn"
            content={
              <>
                <p>Are you sure you want to delete this season?</p>
              </>
            }
          />
        )}

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

                <MonroeButton
                  isDisabled={false}
                  label="Edit"
                  type="primary"
                  icon={<EditOutlined />}
                  iconPosition="start"
                  onClick={() => navigate(`${PATH_TO_EDIT_SEASON}/${data!.id}`)}
                  style={{ height: '32px' }}
                />
              </Flex>
            </Flex>

            <Flex vertical>
              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Linked League:</Typography.Text>

                <MonroeLinkText onClick={() => navigate(`${PATH_TO_LEAGUE_PAGE}/${data.league.id}`)}>
                  {data.league?.name || '-'}
                </MonroeLinkText>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Start Date:</Typography.Text>
                <Typography.Text className="view-text" style={{ color: '#1A1657' }}>
                  {format(new Date(data?.startDate), 'dd MMM yyyy')}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Expected End Date:</Typography.Text>
                <Typography.Text className="view-text" style={{ color: '#1A1657' }}>
                  {format(new Date(data?.expectedEndDate), 'dd MMM yyyy')}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Division/Pool:</Typography.Text>

                <Flex vertical>
                  {data.divisions.map((division) => (
                    <Flex key={division.name} vertical>
                      <MonroeLinkText>{division.name}:</MonroeLinkText>
                      <MonroeBlueText>
                        {division.sub_division.map(
                          (subdivision, idx) =>
                            ` ${subdivision.name}${division.sub_division.length - 1 === idx ? '' : ','}`,
                        )}
                      </MonroeBlueText>
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
