import {
  IDuplicateModalControlsProps,
  useDuplicateModalControls
} from '@/components/DuplicateReviewModal/hooks/useDuplicateModalControls.ts'
import {
  ArrowButton,
  Container,
  ContentWrapper,
  DefaultButton,
  Footer,
  Title
} from '@/components/DuplicateReviewModal/components'
import { Button, Flex, Spin } from 'antd'
import Message from '@/components/Message.tsx'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { MonroeDarkBlueText } from '@/components/Elements'
import { ReactElement, useEffect, useMemo } from 'react'
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
  removeDuplicateByIndex?: IDuplicateModalControlsProps<T>['removeDuplicateByIndex']
  hideSkipButton?: boolean
  mainButtonText?: string
  buttonSize?: number

  children(index: number): ReactElement

  customButton?(): ReactElement

  handleUpdate(index: number): void

  onChange?(index: number): void

  onClose?(): void
}

export const DuplicateReviewModal = <T, Y>(props: IDuplicateReviewModalProps<T, Y>) => {
  const {
    idx = 1,
    duplicates,
    isLoading = false,
    success = false,
    error = false,
    hideSkipButton = false,
    mainButtonText = 'Replace',
    buttonSize,
    removeDuplicateByIndex,
    children,
    customButton,
    handleUpdate,
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

  const total = useMemo(() => duplicates.length, [duplicates])
  const current = duplicates[currentIdx]
  const difference = current.differences || compareObjects(current.new as object, current.existing as object) || {}
  const hasDifferences = !!Object.keys(difference).length

  useEffect(() => {
    !!onChange && onChange(actualIndex)
  }, [actualIndex])

  const onUpdate = () => {
    handleUpdate(actualIndex)
  }

  return (
    <Container>
      <ContentWrapper>
        <Flex className="p24" vertical>
          <Title>Review update</Title>

          <Flex className="w-790">
            {children(actualIndex)}
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

            {!!customButton && customButton()}

            {!hideSkipButton && (
              <DefaultButton
                type="default"
                disabled={isLoading}
                onClick={handleSkip}
              >
                Skip
              </DefaultButton>
            )}

            {hasDifferences && (
              <ButtonSized
                type="primary"
                className="br-4"
                width={buttonSize}
                onClick={!isLoading ? onUpdate : undefined}
              >
                {isLoading ? <Spin indicator={<Indicator spin />} size="small" /> : mainButtonText}
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
const ButtonSized = styled(Button)<{ width?: number }>`
    width: ${({ width }) => width ?? 90}px;
`
