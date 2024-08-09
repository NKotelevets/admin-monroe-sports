import { Checkbox, Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { CSSProperties, FC } from 'react'
import { ReactSVG } from 'react-svg'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

interface IMonroeMultipleSelectProps {
  defaultValue?: string
  options: DefaultOptionType[]
  onChange: (value: string) => void
  name?: string
  styles?: CSSProperties
  placeholder?: string
  value: string[]
}

const MonroeMultipleSelect: FC<IMonroeMultipleSelectProps> = ({ styles, options, value, ...props }) => (
  <Select
    suffixIcon={<ReactSVG src={ArrowDownIcon} />}
    mode="multiple"
    style={styles}
    value={value as unknown as string}
    {...props}
  >
    {options.map((option) => (
      <Select.Option key={option.value} value={option.value}>
        <Checkbox checked={value.includes(option.value as string)}>{option.label}</Checkbox>
      </Select.Option>
    ))}
  </Select>
)

export default MonroeMultipleSelect

