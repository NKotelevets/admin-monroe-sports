import TextArea from 'antd/es/input/TextArea'
import { ChangeEventHandler, FC } from 'react'

import './monroe-input.style.css'

interface IMonroeTextareaProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  placeholder: string
  resize: 'vertical' | 'none' | 'block' | 'inline' | 'both' | 'horizontal'
  initialHeight?: number
  name: string
  value: string
}

const MonroeTextarea: FC<IMonroeTextareaProps> = ({ resize, initialHeight = 120, ...rest }) => (
  <TextArea className="input" {...rest} style={{ height: initialHeight, resize }} />
)

export default MonroeTextarea

