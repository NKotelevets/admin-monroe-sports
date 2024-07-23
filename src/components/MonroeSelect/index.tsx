import { Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FC } from 'react'
import { ReactSVG } from 'react-svg'

import './select.css'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

interface IMonroeSelectProps {
  defaultValue: string
  options: DefaultOptionType[]
  onChange: (value: string) => void
  name: string
}

const MonroeSelect: FC<IMonroeSelectProps> = (props) => (
  <Select className="monroe-select" suffixIcon={<ReactSVG src={ArrowDownIcon} />} {...props} />
)

export default MonroeSelect

