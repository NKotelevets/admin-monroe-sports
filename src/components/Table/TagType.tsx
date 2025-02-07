import styled from '@emotion/styled'
import { Space } from 'antd'
import Typography from 'antd/es/typography/Typography'
import { FC } from 'react'

import { TErrorDuplicate } from '@/common/types'

/**
 * A functional component that represents a TagType.
 * Displays a text label wrapped inside a `Tag` and `TextWrapper` component.
 *
 * @property {string} [text='Error'] - Text content to be displayed.
 */
const TagType: FC<{ text?: TErrorDuplicate }> = ({ text = 'Error' }) => (
  <Tag text={text}>
    <TextWrapper text={text}>{text}</TextWrapper>
  </Tag>
)

export default TagType

// Styled components
const Tag = styled(Space)<{ text: TErrorDuplicate }>`
  border: ${(props) => (props.text === 'Error' ? '1px solid #ff594d' : '1px solid #ffd770')};
  background-color: ${(props) => (props.text === 'Error' ? '#fff1f0' : '#fff9eb')};
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px !important;
`
const TextWrapper = styled(Typography)<{ text: TErrorDuplicate }>`
  color: ${(props) => (props.text === 'Error' ? '#BC261B' : 'rgb(243, 178, 9)')};
  font-size: 12px !important;
`
