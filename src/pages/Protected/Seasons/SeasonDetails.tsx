import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import Typography from 'antd/es/typography'
import { format } from 'date-fns'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useDeleteSeasonMutation, useGetSeasonDetailsQuery } from '@/redux/seasons/seasons.api'

import { PATH_TO_LEAGUE_TOURNAMENT_PAGE, PATH_TO_SEASONS_EDIT_DETAILS, PATH_TO_SEASONS_PAGE } from '@/constants/paths'

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
        navigate(PATH_TO_SEASONS_PAGE)
      })
    }
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_SEASONS_PAGE}>Seasons</a>,
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
                  type="primary"
                  icon={<EditOutlined />}
                  iconPosition="start"
                  onClick={() => navigate(`${PATH_TO_SEASONS_EDIT_DETAILS}/${data!.id}`)}
                  style={{ height: '32px' }}
                />
              </Flex>
            </Flex>

            <Flex vertical>
              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Linked League:</Typography.Text>

                <Typography.Text
                  style={{
                    color: 'rgba(62, 52, 202, 1)',
                    textDecoration: data.league?.name ? 'underline' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`${PATH_TO_LEAGUE_TOURNAMENT_PAGE}/${data.league.id}`)}
                >
                  {data.league?.name || '-'}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Start Date:</Typography.Text>
                <Typography.Text className="view-text" style={{ width: '180px', color: '#1A1657' }}>
                  {format(new Date(data?.startDate), 'dd MMM yyyy')}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Expected End Date:</Typography.Text>
                <Typography.Text className="view-text" style={{ width: '180px', color: '#1A1657' }}>
                  {format(new Date(data?.expectedEndDate), 'dd MMM yyyy')}
                </Typography.Text>
              </Flex>

              <Flex className="field-wrapper">
                <Typography.Text className="view-text">Division/Pool:</Typography.Text>

                <Flex vertical>
                  {data.divisions.map((division) => (
                    <Flex key={division.id} vertical style={{ width: '400px' }}>
                      <Typography.Text
                        style={{
                          color: 'rgba(62, 52, 202, 1)',
                          textDecoration: 'underline',
                          marginBottom: '4px',
                          marginRight: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {division.name}:
                      </Typography.Text>
                      <Typography
                        style={{
                          color: '#1A1657',
                        }}
                      >
                        {division.sub_division?.name ? division.sub_division?.name + '.' : '-'}
                      </Typography>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        )}
      </BaseLayout>
    </>
  )
}
