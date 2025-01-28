import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

import { MonroeBlueText, MonroeDeleteButton, PageContainer, ProtectedPageTitle, ViewText } from '@/components/Elements'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useBulkDeleteLocationsMutation, useGetLocationQuery } from '@/redux/locations/locations.api'

import { PATH_TO_LOCATIONS, PATH_TO_LOCATIONS_EDIT } from '@/common/constants/paths.ts'

const LocationDetails = () => {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetLocationQuery(
    { id: params?.id || '' },
    {
      skip: !params?.id,
      refetchOnMountOrArgChange: true,
    },
  )
  const [deleteLocation] = useBulkDeleteLocationsMutation()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    if (data) {
      deleteLocation([data.id]).then(() => {
        navigate(PATH_TO_LOCATIONS)
      })
    }
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_LOCATIONS}>Locations</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  if (!data && isLoading) return <Loader />

  return (
    <>
      <Helmet>Admin Panel | Location Details</Helmet>

      <BaseLayout>
        {!data && isLoading && <Loader />}

        {showDeleteModal && (
          <MonroeModal
            okText="Delete"
            onCancel={() => setShowDeleteModal(false)}
            onOk={handleDelete}
            title="Delete location?"
            type="warn"
            content={<p>Are you sure you want to delete this location?</p>}
          />
        )}

        {data && (
          <PageContainer>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <Flex justify="space-between">
              <ProtectedPageTitle>{data?.name}</ProtectedPageTitle>

              <Flex>
                <MonroeDeleteButton
                  danger
                  icon={<DeleteOutlined />}
                  iconPosition="start"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </MonroeDeleteButton>

                <MonroeButton
                  label="Edit"
                  type="primary"
                  icon={<EditOutlined />}
                  iconPosition="start"
                  onClick={() => navigate(`${PATH_TO_LOCATIONS_EDIT}/${data!.id}`)}
                  className="h-32"
                />
              </Flex>
            </Flex>

            <Flex vertical>
              <Flex className="mb-16">
                <ViewText>State:</ViewText>

                <ViewText className="color-dark-blue">{data.state}</ViewText>
              </Flex>

              <Flex className="mb-16">
                <ViewText>City:</ViewText>
                <ViewText className="color-dark-blue">{data.city}</ViewText>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Address:</ViewText>
                <ViewText className="color-dark-blue">{data.address}</ViewText>
              </Flex>

              <Flex className="mb-16">
                <ViewText>Zip Code:</ViewText>
                <ViewText className="color-dark-blue">{data.zipCode}</ViewText>
              </Flex>
            </Flex>
          </PageContainer>
        )}
      </BaseLayout>
    </>
  )
}

export default LocationDetails
