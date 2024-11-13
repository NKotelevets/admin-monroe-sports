import { Flex, Table, Typography } from 'antd'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal.tsx'
import styled from '@emotion/styled'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useUsersImportInfoTableParams } from '@/pages/Protected/Users/hooks/useUsersImportInfoTableParams.tsx'
import { IExtendedFEUser, IFENew } from '@/common/interfaces/user.ts'
import { IDuplicate } from '@/common/interfaces'
import { FULL_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'
import { formatPhoneNumber } from '@/utils'
import { TLinkedRole, useLinkedRoles } from '@/pages/Protected/Users/hooks/useLinkedRoles.ts'
import { TNewUser, useNewRoles } from '@/pages/Protected/Users/hooks/useNewRoles.ts'
import { compareObjects } from '@/utils/compareObjects.ts'
import { useBulkEditMutation } from '@/redux/user/user.api.ts'
import { RoleList } from '@/pages/Protected/Users/components/RoleList.tsx'

interface IDuplicateReviewProps {
  index: number
  duplicates: TUserDuplicate[]
  linkedRoles: TLinkedRole[]
  newRoles: TLinkedRole[]
}

type TUserDuplicate = Omit<IDuplicate<IFENew, IExtendedFEUser>, 'differences'>

export const UserImportTable = () => {
  const [bulkEdit, { isLoading, isError, status, reset }] = useBulkEditMutation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const { linkedRoles, setLinkedRolesUser } = useLinkedRoles()
  const { newRoles, setNewRolesUser } = useNewRoles()

  const {
    importCSVTableRecords: records,
    duplicates,
    removeDuplicate
  } = useUserSlice()

  const {
    columns,
    tableParams,
    handleTableChange
  } = useUsersImportInfoTableParams({
    setSelectedIndex,
    records
  })


  const onSkip = (index: number) => {
    removeDuplicate(index)
  }

  const onClose = () => setSelectedIndex(null)

  const onChange = (index: number) => {
    setSelectedIndex(index)
    setLinkedRolesUser(duplicates[index].existing)
    setNewRolesUser(duplicates[index].new as TNewUser)
    reset()
  }

  const onUpdate = useCallback(async (index: number) => {
    if (!duplicates[index]) return

    const updateUserAsAdminBody = {
      id: duplicates[index].existing.id,
      roles: [...linkedRoles, ...newRoles]
    }

    await bulkEdit([updateUserAsAdminBody])
  }, [duplicates, linkedRoles, newRoles])

  return (
    <>
      {selectedIndex !== null && (
        createPortal((
          <DuplicateReviewModal<IFENew, IExtendedFEUser>
            duplicates={duplicates}
            isLoading={isLoading}
            error={isError || status === 'rejected'}
            success={status === 'fulfilled'}
            idx={selectedIndex}
            onClose={onClose}
            onChange={onChange}
            handleUpdate={onUpdate}
            removeDuplicateByIndex={onSkip}
          >
            {(index: number) => (
              <UserDuplicateReview
                index={index}
                duplicates={duplicates}
                linkedRoles={linkedRoles}
                newRoles={newRoles}
              />
            )}
          </DuplicateReviewModal>
        ), document.getElementById('page-portal')!)
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.idx}
        dataSource={records}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </>
  )
}


/**
 * List duplicate users side by side for comparison
 * @param props
 * @constructor
 */
const UserDuplicateReview = (props: IDuplicateReviewProps) => {
  const { duplicates, index, linkedRoles, newRoles } = props
  const { existing, 'new': newUser } = duplicates[index]

  const differences: Record<Partial<keyof IFENew>, boolean> = compareObjects(newUser, existing)

  const renderImmutableInfo = useCallback(() => (
    <>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Name:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.firstName} {existing.lastName}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Gender:</ItemTitle>
        <ItemValueStyle
          is_changed={`false`}>{existing.gender ? FULL_GENDER_NAMES[existing.gender as TGender] : '-'}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Email:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.email || '-'}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Birth Date:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.birthDateFormatted}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Phone:</ItemTitle>
        <ItemValueStyle
          is_changed={`false`}>{existing.phoneNumber ? formatPhoneNumber(existing.phoneNumber) : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Zip Code:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.zipCode || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Current Roles:</ItemTitle>
        {!existing.roles?.length && (
          <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>
        )}
        <RoleList roles={linkedRoles} />
      </Flex>
    </>
  ), [duplicates, existing, linkedRoles, newRoles])

  return (
    <Flex className="w-790">
      <Container is_newUser={`false`}>
        <Title>Current</Title>

        {renderImmutableInfo()}
      </Container>

      <Container is_newUser={`true`}>
        <Title>Imported</Title>

        {renderImmutableInfo()}

        {differences.roles && !!newRoles?.length && (
          <Flex className="mg-b16" vertical>
            <ItemTitle is_changed={`true`}>New Roles:</ItemTitle>
            {!!newRoles?.length && <RoleList roles={newRoles} isNew={true} />}
          </Flex>
        )}
      </Container>
    </Flex>
  )
}


const Container = styled(Flex)<{ is_newUser: string }>`
    flex: 1 1 50%;
    flex-direction: column;
    border-right: ${(props) => (props.is_newUser === 'true' ? '0' : '2px solid #F4F4F5')};
    padding-left: ${(props) => (props.is_newUser !== 'true' ? '0' : '16px')};
    padding-right: ${(props) => (props.is_newUser !== 'true' ? '16px' : '0')};
`
const Title = styled(Typography)`
    color: #888791;
    font-size: 14px;
    margin-bottom: 8px;
`
const ItemTitle = styled(Typography)<{ is_changed: string }>`
    margin-bottom: 4px;
    margin-right: 20px;
    color: ${({ is_changed }) => (is_changed === 'true' ? 'rgba(26, 22, 87, 0.85)' : '#888791')};
    font-weight: 500;
`
const ItemValueStyle = styled(Typography)<{ is_changed: string }>`
    color: ${({ is_changed }) => (is_changed === 'true' ? '#333' : '#888791')};
`
