import styled from '@emotion/styled'
import { Input, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'

export const StyledTextArea = styled(TextArea)`
  background-color: #ffffff !important;
  border-color: #d8d7db;
  border-radius: 2px;
  box-shadow: none;
  color: rgba(26, 22, 87, 0.85) !important;
  padding: 8px 12px;

  &:hover,
  &:focus,
  &:focus-within {
    border-color: rgba(136, 135, 145, 1);
    box-shadow: none;
  }

  & svg {
    fill: #1a1657d9;
    width: 16px;
    height: 16px;
  }

  @media (width > 1660px) {
    font-size: 18px !important;
    min-height: 40px !important;
  }
`

export const StyledInput = styled(Input)<{ is_error?: string }>`
  background-color: #ffffff !important;
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};
  border-radius: 2px;
  box-shadow: none;
  color: rgba(26, 22, 87, 0.85) !important;
  padding: 8px 12px;

  &:hover,
  &:focus,
  &:focus-within {
    border-color: rgba(136, 135, 145, 1);
    box-shadow: none;
  }

  &:disabled {
    background-color: #f4f4f5 !important;
    color: rgba(189, 188, 194, 1) !important;
  }

  & svg {
    fill: #1a1657d9;
    width: 16px;
    height: 16px;
  }

  @media (width > 1660px) {
    font-size: 18px !important;
    min-height: 40px !important;
  }
`

export const StyledPasswordInput = styled(Input.Password)<{ is_error?: string }>`
  background-color: #ffffff !important;
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};
  border-radius: 2px;
  box-shadow: none;
  color: rgba(26, 22, 87, 0.85) !important;
  padding: 8px 12px;
  height: 32px;

  &:hover,
  &:focus,
  &:focus-within {
    border-color: rgba(136, 135, 145, 1);
    box-shadow: none;
  }

  & svg {
    fill: #1a1657d9;
    width: 16px;
    height: 16px;
  }

  @media (width > 1660px) {
    font-size: 18px !important;
    min-height: 40px !important;

    & input {
    }
  }
`

export const InputError = styled(Typography)`
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #bc261b !important;

  @media (width > 1660px) {
    font-size: 16px !important;
  }
`

export const InputLabel = styled(Typography)`
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(26, 22, 87, 0.85) !important;

  @media (width > 1660px) {
    font-size: 20px !important;
  }
`
