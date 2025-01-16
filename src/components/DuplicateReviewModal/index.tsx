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

interface IDuplicateReviewModalProps<NewData, ExistingData> {
  idx?: number
  duplicates: IDuplicate<NewData, ExistingData>[]
  isLoading: boolean
  error: boolean
  success: boolean
  removeDuplicateByIndex?: IDuplicateModalControlsProps<NewData>['removeDuplicateByIndex']
  hideSkipButton?: boolean
  mainButtonText?: string
  mainButtonDisabled?: boolean
  buttonSize?: number

  children(index: number): ReactElement

  customButton?(): ReactElement

  handleUpdate(index: number): void

  onChange?(index: number): void

  onClose?(): void
}

/**
 * A generic modal component for reviewing and resolving duplicate objects.
 * This component is flexible and can be used with various entities in the project.
 *
 * @template NewData - Type of the `new` object in the duplicates array.
 * @template ExistingData - Type of the `existing` object in the duplicates array.
 *
 * @param {IDuplicateReviewModalProps<NewData, ExistingData>} props - The props for the component.
 * @param {number} [props.idx=1] - Initial index of the duplicate to review.
 * @param {IDuplicate<NewData, ExistingData>[]} props.duplicates - Array of duplicate objects to review.
 * @param {boolean} [props.isLoading=false] - Indicates if an update operation is in progress.
 * @param {boolean} [props.success=false] - Indicates if the last update operation was successful.
 * @param {boolean} [props.error=false] - Indicates if the last update operation resulted in an error.
 * @param {boolean} [props.hideSkipButton=false] - Determines whether the "Skip" button should be hidden.
 * @param {string} [props.mainButtonText='Replace'] - Text for the primary action button.
 * @param {number} [props.buttonSize] - Custom size for the primary button.
 * @param {Function} [props.removeDuplicateByIndex] - Callback to remove a duplicate by its index.
 * @param {Function} props.children - Render prop to display content for the current duplicate.
 * @param {Function} [props.customButton] - Optional callback to render a custom button in the modal footer.
 * @param {Function} props.handleUpdate - Callback to handle the update action for the current duplicate.
 * @param {Function} [props.onChange] - Optional callback triggered when the index of the current duplicate changes.
 * @param {Function} [props.onClose] - Optional callback triggered when the modal is closed.
 *
 * @returns {ReactElement} The rendered modal for duplicate review.
 */
export const DuplicateReviewModal = <T, Y>(props: IDuplicateReviewModalProps<T, Y>): ReactElement => {
  const {
    idx = 1,
    duplicates,
    isLoading = false,
    success = false,
    error = false,
    hideSkipButton = false,
    mainButtonText = 'Replace',
    mainButtonDisabled = false,
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
  const difference = compareObjects(current.new as object, current.existing as object) || {}
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
            <ModalNavigation>
              <ArrowButton disabled={actualIndex === 0 || isLoading} onClick={handlePrev}>
                <LeftOutlined />
              </ArrowButton>
              <ArrowButton disabled={actualIndex + 1 === total || isLoading} onClick={handleNext}>
                <RightOutlined />
              </ArrowButton>
            </ModalNavigation>

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
                disabled={mainButtonDisabled}
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

// Styled Components
const Indicator = styled(LoadingOutlined)`
    font-size: 24px;
    color: white;
`
const ButtonSized = styled(Button)<{ width?: number }>`
    width: ${({ width }) => width ?? 90}px;
`
const ModalNavigation = styled.div`
    margin-right: 8px
`
