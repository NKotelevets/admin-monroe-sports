// Styled Components
import styled from '@emotion/styled'
import { Button as Btn, Typography } from 'antd'
import { Form } from 'formik'

import { colors } from '@/utils/colors.tsx'

const Body = styled.div<{ centered?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    text-align: ${({ centered }) => (centered ? 'center' : 'left')};
    align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};
    justify-content: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  }
`
const Title = styled(Typography.Title)`
  font-size: 32px !important;
  color: rgba(29, 30, 34, 1) !important;
  font-weight: 500 !important;

  @media (max-width: 768px) {
    font-size: 24px !important;
  }
`
const Subtitle = styled(Typography.Text)<{ small?: boolean }>`
  color: ${colors.grayText} !important;
  font-size: 16px !important;
  margin-bottom: 40px;
  line-height: 22px;
  width: ${({ small }) => (small ? '80%' : 'auto')};

  @media (max-width: 768px) {
    width: ${({ small }) => (small ? '70%' : 'auto')};
  }

  @media (max-width: 400px) {
    width: ${({ small }) => (small ? '100%' : 'auto')};
  }
`
const FormStyled = styled(Form)`
  width: 100%;
  padding: 0 50px;

  @media (max-width: 768px) {
    padding: 0;
  }
`
const LargeButton = styled(Btn)<{ danger?: boolean; type?: string }>`
  padding: 16px 26px;
  height: 56px;
  width: 100%;
  border-radius: 8px !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  color: ${({ danger }) => (danger ? `${colors.primary} !important` : undefined)};
  border-color: ${({ danger }) => (danger ? `${colors.primary} !important` : undefined)};

  &:disabled {
    color: ${({ type }) => (type !== 'primary' ? colors.primary : '#fff')} !important;
    border-color: ${colors.primary} !important;
    background: ${({ type }) => (type === 'primary' ? colors.primary : '#fff')} !important;
    opacity: 0.5 !important;
  }
`
const Text = styled(Typography.Text)`
  font-size: 14px;
  margin-top: 16px;
  display: block;
  text-align: center;
  color: ${colors.grayText} !important;
  line-height: 24px;
  border-radius: 8px;
`

export const Layout = { Body, Title, Subtitle, FormStyled, LargeButton, Text }
