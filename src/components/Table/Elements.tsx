import styled from '@emotion/styled'
import { List, Typography } from 'antd'
import Button from 'antd/es/button/button'

export const StyledListItem = styled(List.Item)<{ is_selected: string }>`
  padding: 5px 12px !important;
  justify-content: flex-start !important;
  border-block-end: 0;
  background-color: ${(props) => (props.is_selected === 'true' ? '#F1F0FF' : 'transparent')};
`

export const ConfirmButton = styled(Button)`
  padding: 0 7px;
  height: auto;
  color: rgb(255, 255, 255);
`

export const ResetButton = styled(Button)<{ has_length: string }>`
  padding: 0 7px;
  border: 0;
  height: auto;
  color: ${(props) => (props.has_length === 'true' ? 'rgb(188, 38, 27)' : 'rgb(189, 188, 194)')};
`

export const TextWrapper = styled(Typography)<{ is_selected: string }>`
  color: ${(props) => (props.is_selected === 'true' ? '#3E34CA' : 'rgba(26, 22, 87, 0.85)')};
`

