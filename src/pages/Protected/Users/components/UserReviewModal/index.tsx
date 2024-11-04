import { IExtendedFEUser, IFENew, IRole } from '@/common/interfaces/user.ts'
import { useCallback, useEffect, useMemo } from 'react'
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
  current: IExtendedFEUser
  duplicate: IFENew
  amount?: number

  type?: 'Imported' | 'Created'
  title: string
  index?: number

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

export const UserReviewModal = (props: IUserReviewModal) => {
  const {
    type = 'Imported',
    current,
    duplicate,
    amount,
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

  const objectsDifferences: Record<Partial<keyof IFENew>, boolean> = compareObjects(current, duplicate)

  const hasMany = useMemo(() => ((amount || 0) > 1), [amount])
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
              newRoles={duplicate.roles as (IRole & {teamName: string})[]}
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

          <Flex justify={hasMany ? undefined : 'flex-end'} flex={1}>
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
const ButtonSized = styled(DefaultButton)<{ minWidth?: number}>`
    min-width: ${({minWidth}) => minWidth !== undefined ? minWidth : 0}px;
`
