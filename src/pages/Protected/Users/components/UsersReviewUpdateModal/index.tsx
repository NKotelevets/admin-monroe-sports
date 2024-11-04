import UsersDetailsColumn from './components/UsersDetailsColumn'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Spin } from 'antd'
import React, { FC, useEffect, useState } from 'react'

import {
  ArrowButton,
  Container,
  ContentWrapper,
  DefaultButton,
  Footer,
  Title,
} from '@/pages/Protected/Users/components/UsersReviewUpdateModal/Elements'

import { MonroeDarkBlueText } from '@/components/Elements'
import Loader from '@/components/Loader'
import Message from '@/components/Message'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkEditMutation } from '@/redux/user/user.api'

import { compareObjects } from '@/utils/compareObjects'

import { IExtendedFEUser, IFENew } from '@/common/interfaces/user'
import { useLinkedRoles } from '@/pages/Protected/Users/hooks/useLinkedRoles.ts'
import { TNewUser, useNewRoles } from '@/pages/Protected/Users/hooks/useNewRoles.ts'
import styled from '@emotion/styled'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import {
  useDuplicateModalControls
} from '@/pages/Protected/Users/components/UsersReviewUpdateModal/hooks/useDuplicateModalControls.ts'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = "Record can't be updated. Please try again."

const UsersReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = React.memo(({ idx, onClose }) => {
  const { duplicates } = useUserSlice()
  const {
    currentIdx,
    currentDuplicate,
    actualIndex,
    handleNext,
    handlePrev,
    handleSkip,
    handleClose
  } = useDuplicateModalControls(idx, onClose)
  const [bulkEdit, { isLoading, isError, status, reset }] = useBulkEditMutation()

  const [existingUser, setExistingUser ] = useState<IExtendedFEUser | undefined>(currentDuplicate?.existing)
  const [newUserData, setNewUserData] = useState<TNewUser | undefined>(currentDuplicate?.new as TNewUser)
  const { linkedRoles, setLinkedRolesUser } = useLinkedRoles()
  const { newRoles, setNewRolesUser } = useNewRoles()

  // resets mutation on index change
  useEffect(() => {
    reset()
  }, [currentIdx, duplicates.length])

  // updates current and new user data on duplicate change
  useEffect(() => {
    setExistingUser(currentDuplicate?.existing)
    setNewUserData(currentDuplicate?.new as TNewUser)
  }, [currentDuplicate])

  // updates linked roles for existing user
  useEffect(() => {
    existingUser && setLinkedRolesUser(existingUser)
  }, [existingUser])

  // updates new user roles
  useEffect(() => {
    newUserData && setNewRolesUser(newUserData)
  }, [newUserData])

  // wait for user data to load
  if (!existingUser || !newUserData) return <Loader />

  const objectsDifferences: Record<Partial<keyof IFENew>, boolean> = compareObjects(newUserData, existingUser)

  // updates current user roles
  const handleUpdate = async () => {
    if (!objectsDifferences.roles) return

    const updateUserAsAdminBody = {
      id: existingUser.id,
      roles: [...linkedRoles, ...newRoles],
    }

    await bulkEdit([updateUserAsAdminBody])
  }

  return (
    <Container>
      <ContentWrapper>
        <Flex className="p24" vertical>
          <Title>Review update</Title>

          <Flex className="w-790">
            <UsersDetailsColumn
              title="Current"
              {...existingUser}
              address={null}
              children={[]}
              parents={[]}
              roles={linkedRoles}
              isNew={false}
              differences={objectsDifferences}
            />
            <UsersDetailsColumn
              title="Imported"
              {...newUserData}
              roles={linkedRoles}
              newRoles={newRoles}
              isNew
              current={existingUser}
              differences={objectsDifferences}
            />
          </Flex>

          {(isError || status === 'fulfilled')  && (
            <Message
              type={isError ? 'error' : 'success'}
              text={!isError ? SUCCESS_MESSAGE : ERROR_MESSAGE}
            />
          )}
        </Flex>

        <Footer>
          <Flex align="center">
            <ArrowButton disabled={actualIndex === 0 || isLoading} onClick={handlePrev}>
              <LeftOutlined />
            </ArrowButton>
            <ArrowButton
              disabled={actualIndex + 1 === duplicates.length || isLoading}
              onClick={handleNext}
            >
              <RightOutlined />
            </ArrowButton>

            <MonroeDarkBlueText>
              {actualIndex + 1} of {duplicates.length} duplicate
            </MonroeDarkBlueText>
          </Flex>

          <Flex>
            <DefaultButton
              type="default"
              disabled={isLoading}
              onClick={handleClose}
            >
              Close
            </DefaultButton>

              <DefaultButton
                type="default"
                disabled={isLoading}
                onClick={handleSkip}
              >
                Skip
              </DefaultButton>

            {!!objectsDifferences.roles && (
              <ButtonSized
                type="primary"
                className="br-4"
                onClick={!isLoading ? handleUpdate : undefined}
              >
                {isLoading ? <Spin indicator={<Indicator spin />} size='small' /> : 'Update current'}
              </ButtonSized>
            )}
          </Flex>
        </Footer>
      </ContentWrapper>
    </Container>
  )
}, (prevProps, nextProps) => {
  return prevProps.idx === nextProps.idx
})

const Indicator = styled(LoadingOutlined)`
  font-size: 24px;
  color: white;
`
const ButtonSized = styled(Button)`
  width: 130px
`

export default UsersReviewUpdateModal
