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

