import { Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { CSSProperties, FC } from 'react'
import { ReactSVG } from 'react-svg'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

interface IMonroeSelectProps {
  defaultValue?: string
  options: DefaultOptionType[]
  onChange: (value: string) => void
  name?: string
  styles?: CSSProperties
  placeholder?: string
  value?: string | null | undefined
  mode?: 'multiple' | 'tags' | undefined
}

const MonroeSelect: FC<IMonroeSelectProps> = ({ styles, ...props }) => (
  <Select suffixIcon={<ReactSVG src={ArrowDownIcon} />} style={styles} {...props} />
)

export default MonroeSelect
