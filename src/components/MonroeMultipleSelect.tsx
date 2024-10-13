import styled from '@emotion/styled'
import { Checkbox, Select } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FC } from 'react'
import { ReactSVG } from 'react-svg'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

interface IMonroeMultipleSelectProps {
  defaultValue?: string
  options: DefaultOptionType[]
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  value: string[]
  renderInside?: boolean
  onBlur?: () => void
  className?: string
}

const CustomSelect: FC<IMonroeMultipleSelectProps> = ({ options, value, renderInside = false, onBlur, ...props }) => (
  <Select
    suffixIcon={<ReactSVG src={ArrowDownIcon} />}
    mode="multiple"
    value={value as unknown as string}
    getPopupContainer={(trigger) => (renderInside ? trigger.parentNode : undefined)}
    onDropdownVisibleChange={(isOpen) => {
      if (!isOpen && !value.length && onBlur) onBlur()
    }}
    {...props}
  >
    {options.map((option) => (
      <Select.Option key={option.value} value={option.value}>
        <Checkbox checked={value.includes(option.value as string)}>{option.label}</Checkbox>
      </Select.Option>
    ))}
  </Select>
)

const MonroeMultipleSelect = styled(CustomSelect)<{ is_error?: string }>`
  & .ant-select-selector {
    border-color: ${(props) => (props.is_error === 'true' ? '#BC261B !important' : '#d8d7db !important')};
  }

  @media (width > 1660px) {
    & .ant-checkbox-wrapper span {
      font-size: 18px !important;
    }

    &.ant-select .ant-select-selector {
      min-height: 40px !important;
    }
  }
`

export default MonroeMultipleSelect
