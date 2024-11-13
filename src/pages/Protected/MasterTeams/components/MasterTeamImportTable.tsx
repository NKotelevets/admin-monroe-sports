import { Flex, Table, Typography } from 'antd'
import { useState } from 'react'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import {
  useMasterTeamImportInfoTableParams
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamImportInfoTableParams.tsx'
import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal.tsx'
import {
  IFEDuplicate,
  IFEExistingMasterTeamDuplicate,
  IFENewMasterTeamDuplicate
} from '@/common/interfaces/masterTeams.ts'
import styled from '@emotion/styled'


export const MasterTeamImportTable = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    importCSVTableRecords: records,
    duplicates,
    removeDuplicate
  } = useMasterTeamsSlice()

  const {
    columns,
    tableParams,
    handleTableChange
  } = useMasterTeamImportInfoTableParams({
    setSelectedIndex,
    records: duplicates
  })

  const onUpdate = () => {
    // TODO: check if is possible to get the ids from backend
    //  in the first place, so we dont need to fetch each id to update it
  }

  const onSkip = (index: number) => {
    setIsLoading(true)
    removeDuplicate(index)
    setIsLoading(false)
  }

  const onClose = () => setSelectedIndex(null)

  return (
    <>
      {selectedIndex !== null && (
        createPortal((
          <DuplicateReviewModal<IFENewMasterTeamDuplicate, IFEExistingMasterTeamDuplicate>
            duplicates={duplicates}
            isLoading={isLoading}
            error={false}
            success={false}
            idx={selectedIndex}
            onClose={onClose}
            handleUpdate={onUpdate}
            removeDuplicateByIndex={onSkip}
          >
            {(index: number) => (
              <MasterTeamDuplicateReview index={index} duplicates={duplicates} />
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

interface IDuplicateReviewProps {
  index: number
  duplicates: IFEDuplicate[]
}

const MasterTeamDuplicateReview = (props: IDuplicateReviewProps) => {
  const { duplicates, index } = props
  const current = duplicates[index]

  return (
    <Flex className="w-790">
      <Container is_new={`false`}>
        <Title>Current</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Name:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.name}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Team Administrator:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.teamAdmins.join(', ')}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Team Admin Email:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.teamAdminsEmails.join(', ')}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Head Coach:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.headCoach || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Head Coach Email:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.headCoachEmail || '-'}</ItemValueStyle>
        </Flex>
      </Container>

      <Container is_new={`true`}>
        <Title>Imported</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.masterTeamName)}`}>Name:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences.masterTeamName)}`}>{current.new.masterTeamName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.teamAdminName)}`}>Team Administrator:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences.teamAdminName)}`}>{current.new.teamAdminName || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.teamAdminEmail)}`}>Team Admin Email:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences.teamAdminEmail)}`}>{current.new.teamAdminEmail || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.headCoachName)}`}>Head Coach:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences.headCoachName)}`}>{current.new.headCoachName || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.headCoachEmail)}`}>Head Coach Email:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences.headCoachEmail)}`}>{current.new.headCoachEmail || '-'}</ItemValueStyle>
        </Flex>
      </Container>
    </Flex>
  )
}

const Container = styled(Flex)<{ is_new: string }>`
    flex: 1 1 50%;
    flex-direction: column;
    border-right: ${(props) => (props.is_new === 'true' ? '0' : '2px solid #F4F4F5')};
    padding-left: ${(props) => (props.is_new !== 'true' ? '0' : '16px')};
    padding-right: ${(props) => (props.is_new !== 'true' ? '16px' : '0')};
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
