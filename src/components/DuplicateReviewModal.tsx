import {
  useDuplicateModalControls
} from '@/pages/Protected/Users/components/UsersReviewUpdateModal/hooks/useDuplicateModalControls.ts'
import {
  ArrowButton,
  Container,
  ContentWrapper,
  DefaultButton,
  Footer,
  Title
} from '@/pages/Protected/Users/components/UsersReviewUpdateModal/Elements.tsx'
import { Button, Flex, Spin } from 'antd'
import Message from '@/components/Message.tsx'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { MonroeDarkBlueText } from '@/components/Elements'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { IDuplicate } from '@/common/interfaces'
import { compareObjects } from '@/utils/compareObjects.ts'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = `Record can't be updated. Please try again.`

interface IDuplicateReviewModalProps<T, Y> {
  idx?: number
  duplicates: IDuplicate<T, Y>[]
  isLoading: boolean
  error: boolean
  success: boolean

  children(index: number, setPayload: (payload: unknown) => void): ReactElement

  handleUpdate(index: number): void

  removeDuplicateByIndex(index: number): void

  onChange?(index: number): void

  onClose?(): void
}

export const DuplicateReviewModal = <T, Y>(props: IDuplicateReviewModalProps<T, Y>) => {
  const {
    children,
    idx = 1,
    duplicates,
    isLoading = false,
    success = false,
    error = false,
    handleUpdate,
    removeDuplicateByIndex,
    onChange,
    onClose
  } = props

  const {
    actualIndex,
    handleNext,
    handlePrev,
    handleSkip,
    handleClose,
    currentIdx
  } = useDuplicateModalControls<IDuplicate<T, Y>>({ idx, duplicates, removeDuplicateByIndex, onClose })

  const [payload, setPayload] = useState<unknown>()
  const total = useMemo(() => duplicates.length, [duplicates])
  const current = duplicates[currentIdx]
  const difference = current.differences || compareObjects(current.new as object, current.existing as object) || {}
  const hasDifferences = !!Object.keys(difference).length

  useEffect(() => {
    !!onChange && onChange(actualIndex)
  }, [actualIndex, payload])

  const onUpdate = useCallback(() => {
    handleUpdate(actualIndex)
  }, [actualIndex])

  return (
    <Container>
      <ContentWrapper>
        <Flex className="p24" vertical>
          <Title>Review update</Title>

          <Flex className="w-790">
            {children(actualIndex, setPayload)}
          </Flex>

          {error && <Message type="error" text={ERROR_MESSAGE} />}
          {success && <Message type="success" text={SUCCESS_MESSAGE} />}
        </Flex>

        <Footer>
          <Flex align="center">
            <ArrowButton disabled={actualIndex === 0 || isLoading} onClick={handlePrev}>
              <LeftOutlined />
            </ArrowButton>
            <ArrowButton
              disabled={actualIndex + 1 === total || isLoading}
              onClick={handleNext}
            >
              <RightOutlined />
            </ArrowButton>

            <MonroeDarkBlueText>
              {actualIndex + 1} of {total} duplicate
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

            {hasDifferences && (
              <ButtonSized
                type="primary"
                className="br-4"
                onClick={!isLoading ? onUpdate : undefined}
              >
                {isLoading ? <Spin indicator={<Indicator spin />} size="small" /> : 'Update current'}
              </ButtonSized>
            )}
          </Flex>
        </Footer>
      </ContentWrapper>
    </Container>
  )
}

const Indicator = styled(LoadingOutlined)`
    font-size: 24px;
    color: white;
`
const ButtonSized = styled(Button)`
    width: 130px
`
