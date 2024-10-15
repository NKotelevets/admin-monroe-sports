import UsersDetailsColumn from './components/UsersDetailsColumn'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'
import { FC, useState } from 'react'

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
import { useGetUserDetailsQuery } from '@/redux/user/user.api'

import { compareObjects } from '@/utils/compareObjects'

import { IFEDuplicateWithIdx, IFENew } from '@/common/interfaces/user'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = "Record can't be updated. Please try again."

const UsersReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({ idx, onClose }) => {
  const { duplicates, removeDuplicate } = useUserSlice()
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const currentDuplicate = duplicates.find((duplicate) => duplicate.idx === currentIdx)
  const actualIndex = duplicates.indexOf(currentDuplicate as IFEDuplicateWithIdx)
  const newData = currentDuplicate?.new
  const { data } = useGetUserDetailsQuery(
    { id: currentDuplicate?.existing.id || '' },
    { skip: !currentDuplicate?.existing.id },
  )
  const [isUpdatedSeason, setIsUpdatedSeason] = useState(false)
  const [isError] = useState(false)

  if (!data || !newData) return <Loader />

  const objectsDifferences: Record<Partial<keyof IFENew>, boolean> = compareObjects(newData, data)

  const handleNextDuplicate = () => setCurrentIdx((prev) => prev + 1)

  const handlePrevDuplicate = () => setCurrentIdx((prev) => prev - 1)

  const handleSkipForThis = () => {
    if (actualIndex === duplicates.length - 1) {
      onClose()
      return
    }

    handleNextDuplicate()
  }

  const handleUpdate = () => {}

  const handleNextRecord = () => {
    if (duplicates.length === 1) {
      onClose()
      setIsUpdatedSeason(false)
      removeDuplicate(currentIdx)

      return
    }

    if (actualIndex === duplicates.length - 1) {
      setCurrentIdx(0)
    } else {
      const newIndex = currentIdx + 1

      if (newIndex > duplicates.length - 2) {
        setCurrentIdx(0)
      } else {
        setCurrentIdx((prev) => prev + 1)
      }
    }

    setIsUpdatedSeason(false)
    setTimeout(() => {
      removeDuplicate(currentIdx)
    }, 500)
  }

  const handleClose = () => {
    if (isUpdatedSeason) {
      setIsUpdatedSeason(false)
      removeDuplicate(currentIdx)
    }

    onClose()
  }

  return (
    <Container>
      <ContentWrapper>
        <Flex className="p24" vertical>
          <Title>Review update</Title>

          <Flex className="w-790">
            <UsersDetailsColumn
              address={null}
              children={[]}
              parents={[]}
              {...data}
              title="Current"
              isNew={false}
              differences={objectsDifferences}
            />

            <UsersDetailsColumn {...newData} title="Imported" isNew differences={objectsDifferences} />
          </Flex>

          {isUpdatedSeason && (
            <Message type={isError ? 'error' : 'success'} text={!isError ? SUCCESS_MESSAGE : ERROR_MESSAGE} />
          )}
        </Flex>

        <Footer>
          <Flex align="center">
            <ArrowButton disabled={actualIndex === 0 || isUpdatedSeason} onClick={handlePrevDuplicate}>
              <LeftOutlined />
            </ArrowButton>
            <ArrowButton
              disabled={actualIndex + 1 === duplicates.length || isUpdatedSeason}
              onClick={handleNextDuplicate}
            >
              <RightOutlined />
            </ArrowButton>

            <MonroeDarkBlueText>
              {actualIndex + 1} of {duplicates.length} duplicate
            </MonroeDarkBlueText>
          </Flex>

          <Flex>
            <DefaultButton type="default" onClick={handleClose}>
              Close
            </DefaultButton>

            {duplicates.length > 1 && !isUpdatedSeason && (
              <DefaultButton type="default" onClick={handleSkipForThis}>
                Skip for this
              </DefaultButton>
            )}

            {isUpdatedSeason ? (
              <>
                {duplicates.length > 1 && (
                  <Button type="primary" className="br-4" onClick={handleNextRecord}>
                    Next record
                  </Button>
                )}
              </>
            ) : (
              <Button type="primary" className="br-4" onClick={handleUpdate}>
                Update current
              </Button>
            )}
          </Flex>
        </Footer>
      </ContentWrapper>
    </Container>
  )
}

export default UsersReviewUpdateModal
