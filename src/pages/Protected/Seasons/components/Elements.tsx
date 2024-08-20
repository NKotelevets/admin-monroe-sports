import styled from '@emotion/styled'
import { Button, Flex } from 'antd'

import { MonroeSecondaryButton } from '@/components/Elements'

export const AddBracketButton = styled(Button)`
  border: none;
  background: transparent;
  font-size: 14px;
  color: #3e34ca;
  box-shadow: none;
  width: 134px;

  &:disabled {
    color: #888791;
    background-color: transparent;
  }
`

export const AddDivisionPollButton = styled(MonroeSecondaryButton)`
  &:disabled {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02) !important;
    border-radius: 2px !important;
    border: 1px solid #d8d7db !important;
    background: #f4f4f5 !important;
    color: #bdbcc2 !important;
  }
`

export const MainContainer = styled(Flex)`
  flex-direction: column;
  width: 352px;

  @media (width > 1660px) {
    width: 600px;
  }
`

export const CreateDivisionContainer = styled.div<{ isError: boolean }>`
  background-color: white;
  border-radius: 3px;
  border: 1px solid #d8d7d8;
  border-color: ${(props) => (props.isError ? '#BC261B' : '#D8D7DB')};
  height: 100%;
`

export const TitleStyle = styled.div<{ isError: boolean }>`
  color: ${(props) => (props.isError ? '#BC261B' : '#1A1657')};
  font-size: 14px;
  font-weight: 500;
`

export const Subtext = styled.div`
  color: #888791;
  font-size: 12px;
`
