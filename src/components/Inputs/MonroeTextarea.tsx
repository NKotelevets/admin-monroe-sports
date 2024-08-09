import { ChangeEventHandler, FC } from 'react'

import { StyledTextArea } from '@/components/Inputs/InputElements'

interface IMonroeTextareaProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  placeholder: string
  resize: 'vertical' | 'none' | 'block' | 'inline' | 'both' | 'horizontal'
  initialHeight?: number
  name: string
  value: string
}

const MonroeTextarea: FC<IMonroeTextareaProps> = ({ resize, initialHeight = 120, ...rest }) => (
  <StyledTextArea {...rest} style={{ height: initialHeight, resize }} />
)

export default MonroeTextarea
