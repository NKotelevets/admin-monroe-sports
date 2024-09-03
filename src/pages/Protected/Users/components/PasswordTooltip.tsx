import styled from '@emotion/styled'
import { Progress } from 'antd'
import { FC } from 'react'
import { ReactSVG } from 'react-svg'

import ActiveCheckIcon from '@/assets/icons/check-circle.svg'
import NotActiveCheckIcon from '@/assets/icons/close-circle.svg'

interface IPasswordErrors {
  haveLetter: boolean
  haveCapitalLetter: boolean
  haveNumber: boolean
  haveEnoughCharacters: boolean
  haveOneSpecialCharacter: boolean
}

const StyledBox = styled.div`
  margin-top: 4px;
  background: #ffffff;
  width: 100%;
`

const getIcon = (isError: boolean) => (!isError ? NotActiveCheckIcon : ActiveCheckIcon)

const PasswordTooltipHeader = styled.p<{
  is_title?: string
}>(({ is_title: is_title = '' }) => ({
  color: is_title ? '#1D1E22' : '#696163',
  fontSize: is_title ? '14px' : '12px',
  fontWeight: '400',
}))

const TooltipItem: FC<{ isActive: boolean; itemTitle: string }> = ({ isActive, itemTitle }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginTop: '8px',
    }}
  >
    <ReactSVG src={getIcon(isActive)} />
    <PasswordTooltipHeader style={{ marginLeft: '4px' }}>{itemTitle}</PasswordTooltipHeader>
  </div>
)

const passwordRulesTitleOptions: Record<keyof IPasswordErrors, string> = {
  haveEnoughCharacters: 'at least 8 characters',
  haveLetter: 'at least one lowercase letter',
  haveCapitalLetter: 'at least one uppercase letter',
  haveOneSpecialCharacter: 'at least one special character',
  haveNumber: 'at least one digit',
}

const PasswordTooltip: FC<{ passwordErrors: IPasswordErrors }> = ({ passwordErrors }) => {
  const percentage =
    Object.keys(passwordErrors).filter((key) => !!passwordErrors[key as keyof IPasswordErrors]).length * 20

  const getColors = (percentage: number) => {
    if (percentage < 60) return '#BC261B'

    if (percentage < 100) return 'rgba(243, 178, 9, 1)'

    return 'rgba(26, 121, 11, 1)'
  }

  return (
    <StyledBox>
      <Progress percent={percentage} strokeColor={getColors(percentage)} showInfo={false} />

      <PasswordTooltipHeader is_title="true">Password requirements:</PasswordTooltipHeader>
      {Object.keys(passwordErrors).map((key) => (
        <TooltipItem
          key={key}
          isActive={passwordErrors[key as keyof IPasswordErrors]}
          itemTitle={passwordRulesTitleOptions[key as keyof IPasswordErrors]}
        />
      ))}
    </StyledBox>
  )
}

export default PasswordTooltip

