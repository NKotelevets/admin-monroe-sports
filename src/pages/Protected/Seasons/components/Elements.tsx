import styled from '@emotion/styled'
import { Button } from 'antd'

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
