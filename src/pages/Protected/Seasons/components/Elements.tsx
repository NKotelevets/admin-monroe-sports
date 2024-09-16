import styled from '@emotion/styled'
import { Button } from 'antd'

import { MonroeSecondaryButton } from '@/components/Elements'

export const AddRoleButton = styled(Button)`
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

export const AddBracketButton = styled(MonroeSecondaryButton)`
  padding: 2px 12px;
  font-size: 12px;
  height: 20px;
  margin-left: 24px;
  margin-top: 5px;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  &:disabled {
    border-color: #d8d7db !important;
    background-color: #f4f4f5 !important;
    color: #bdbcc2 !important;
  }
`
