import { IExtendedFEUser, IFENew, IRole } from '@/common/interfaces/user.ts'
import { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { compareObjects } from '@/utils/compareObjects.ts'
import {
  ArrowButton,
  Container,
  ContentWrapper,
  DefaultButton,
  Footer,
  Title
} from '@/pages/Protected/Users/components/UsersReviewUpdateModal/Elements.tsx'
import { Flex, Spin } from 'antd'
import UsersDetailsColumn
  from '@/pages/Protected/Users/components/UsersReviewUpdateModal/components/UsersDetailsColumn.tsx'
import Message from '@/components/Message.tsx'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { MonroeDarkBlueText } from '@/components/Elements'
import styled from '@emotion/styled'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { ButtonProps } from 'antd/es/button/button'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import { useLinkedRoles } from '@/pages/Protected/Users/hooks/useLinkedRoles.ts'
import { useModalControls } from '@/pages/Protected/Users/components/UsersReviewUpdateModal/hooks/useModalControls.ts'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = `Record can't be updated. Please try again.`


interface IUserReviewModal {
  existing: IExtendedFEUser[]
  duplicates: IFENew[]

  type?: 'Imported' | 'Created'
  title: string

  primaryButtonText: string
  primaryButtonLoading?: boolean
  primaryButtonDisabled?: boolean
  primaryButtonTooltip?: string

  secondaryButtonText?: string
  secondaryButtonLoading?: boolean
  secondaryButtonDisabled?: boolean
  secondaryButtonTooltip?: string

  hasError: boolean
  errorMessage?: string
  successMessage?: string

  onClose(): void

  primaryButtonAction(index: number): void

  secondaryButtonAction?(index: number): void
}

/**
 * `UserReviewModal` is a modal component designed for reviewing potential user duplications. It displays
 * user details side-by-side for comparison, supports pagination for multiple records, and provides customizable
 * primary and secondary actions.
 *
 * @component
 *
 * @param {IUserReviewModal} props - The properties for `UserReviewModal`.
 * @param {IExtendedFEUser[]} props.existing - Array of existing users for comparison.
 * @param {IFENew[]} props.duplicates - Array of potential duplicate users.
 * @param {'Imported' | 'Created'} [props.type='Imported'] - Specifies the type of duplicate records.
 * @param {string} props.title - Title of the modal.
 *
 * @param {string} props.primaryButtonText - Label for the primary action button.
 * @param {boolean} [props.primaryButtonLoading=false] - Indicates loading state for the primary button.
 * @param {boolean} [props.primaryButtonDisabled=false] - Disables the primary button when `true`.
 * @param {string} [props.primaryButtonTooltip] - Tooltip text for the primary button.
 *
 * @param {string} [props.secondaryButtonText] - Label for the secondary action button.
 * @param {boolean} [props.secondaryButtonLoading=false] - Indicates loading state for the secondary button.
 * @param {boolean} [props.secondaryButtonDisabled=false] - Disables the secondary button when `true`.
 * @param {string} [props.secondaryButtonTooltip] - Tooltip text for the secondary button.
 *
 * @param {boolean} props.hasError - If `true`, displays an error message.
 * @param {string} [props.errorMessage=ERROR_MESSAGE] - Custom error message to display when `hasError` is `true`.
 * @param {string} [props.successMessage=SUCCESS_MESSAGE] - Custom success message to display when the action succeeds.
 *
 * @param {() => void} props.onClose - Function to execute when closing the modal.
 * @param {(index: number) => void} props.primaryButtonAction - Function executed when the primary button is clicked, with the current index as an argument.
 * @param {(index: number) => void} [props.secondaryButtonAction] - Function executed when the secondary button is clicked, with the current index as an argument.
 *
 * @returns {ReactElement} Rendered `UserReviewModal` component.
 *
 * @example
 * <UserReviewModal
 *   existing={[user1, user2]}
 *   duplicates={[duplicate1, duplicate2]}
 *   title="User Duplication Review"
 *   primaryButtonText="Merge"
 *   primaryButtonAction={(index) => handleMerge(index)}
 *   onClose={() => setShowModal(false)}
 *   hasError={false}
 * />
 */
export const UserReviewModal = (props: IUserReviewModal): ReactElement => {
  const {
    type = 'Imported',
    existing,
    duplicates,
    title,
    onClose,
    primaryButtonText,
    primaryButtonAction,
    primaryButtonLoading,
    primaryButtonDisabled,
    primaryButtonTooltip,
    secondaryButtonText,
    secondaryButtonAction,
    secondaryButtonLoading,
    secondaryButtonDisabled,
    secondaryButtonTooltip,
    hasError,
    errorMessage = ERROR_MESSAGE,
    successMessage = SUCCESS_MESSAGE
  } = props

  const { linkedRoles, setLinkedRolesUser } = useLinkedRoles()
  const {
    index,
    handleNext,
    handlePrev,
    handleClose
  } = useModalControls(0, onClose)

  const amount = existing.length
  const hasMany = existing.length > 1
  const current = existing[index]
  const duplicate = duplicates[index]

  const objectsDifferences: Record<Partial<keyof IFENew>, boolean> = compareObjects(current, duplicate)

  const isLoading = useMemo(() => (
    primaryButtonLoading || secondaryButtonLoading
  ), [primaryButtonLoading, secondaryButtonLoading])

  // updates linked roles for existing user
  useEffect(() => {
    current && setLinkedRolesUser(current)
  }, [current])


  return (
    <Container>
      <ContentWrapper>
        <Flex className="p24" vertical>
          <Title>{title}</Title>

          <Flex className="w-790">
            <UsersDetailsColumn
              title="Current"
              {...current}
              address={null}
              children={[]}
              parents={[]}
              roles={linkedRoles}
              isNew={false}
              differences={objectsDifferences}
            />
            <UsersDetailsColumn
              title={type}
              {...duplicate}
              roles={linkedRoles}
              newRoles={duplicate.roles as (IRole & { teamName: string })[]}
              isNew
              current={current}
              differences={objectsDifferences}
            />
          </Flex>

          {hasError && (
            <Message
              type={hasError ? 'error' : 'success'}
              text={!hasError ? successMessage : errorMessage}
            />
          )}
        </Flex>

        <Footer>
          {hasMany && (
            <Flex align="center">
              <ArrowButton disabled={index === 0 || isLoading} onClick={handlePrev}>
                <LeftOutlined />
              </ArrowButton>
              <ArrowButton
                disabled={index + 1 === amount || isLoading}
                onClick={handleNext}
              >
                <RightOutlined />
              </ArrowButton>

              {!!amount && (
                <MonroeDarkBlueText>
                  {index + 1} of {(amount || 0)} {`duplicate${amount > 1 ? 's' : ''}`}
                </MonroeDarkBlueText>
              )}
            </Flex>
          )}

          <Flex justify='flex-end' flex={1}>
            <DefaultButton
              type="default"
              disabled={isLoading}
              onClick={handleClose}
            >
              Close
            </DefaultButton>

            {secondaryButtonAction && secondaryButtonText && (
              <ModalButton
                index={index}
                type="default"
                disabled={isLoading || secondaryButtonDisabled}
                action={secondaryButtonAction}
                tooltip={secondaryButtonTooltip}
              >
                {secondaryButtonText}
              </ModalButton>
            )}

            {!!primaryButtonAction && primaryButtonText && (
              <ModalButton
                index={index}
                type="primary"
                border={false}
                minWidth={135}
                isLoading={isLoading}
                disabled={primaryButtonDisabled}
                action={primaryButtonAction}
                tooltip={primaryButtonTooltip}
              >
                {primaryButtonText}
              </ModalButton>
            )}
          </Flex>
        </Footer>
      </ContentWrapper>
    </Container>
  )

}

interface IModalButton extends Omit<ButtonProps, 'onClick'> {
  isLoading?: boolean
  index: number
  tooltip?: string
  minWidth?: number

  action(index: number): void

}

const ModalButton = (props: IModalButton & { border?: boolean }) => {
  const {
    action,
    isLoading,
    children,
    index,
    tooltip = '',
    ...rest
  } = props

  const handleAction = useCallback(() => action(index), [index])

  return (
    <MonroeTooltip text={tooltip} width="240px">
      <ButtonSized
        {...rest}
        onClick={!isLoading ? handleAction : undefined}
      >
        {isLoading ? <Spin indicator={<Indicator spin />} size="small" /> : children}
      </ButtonSized>
    </MonroeTooltip>
  )
}

const Indicator = styled(LoadingOutlined)`
    font-size: 24px;
    color: white;
`
const ButtonSized = styled(DefaultButton)<{ minWidth?: number }>`
    min-width: ${({ minWidth }) => minWidth !== undefined ? minWidth : 0}px;
`
