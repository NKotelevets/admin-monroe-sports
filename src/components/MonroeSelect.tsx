import styled from '@emotion/styled'
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
  disabled?: boolean
  renderInside?: boolean
}

const CustomSelect: FC<IMonroeSelectProps> = ({ styles, renderInside = false, ...props }) => (
  <Select
    showSearch
    suffixIcon={<ReactSVG src={ArrowDownIcon} />}
    style={styles}
    {...props}
    getPopupContainer={(trigger) => (renderInside ? trigger.parentNode : undefined)}
  />
)

const MonroeSelect = styled(CustomSelect)`
  & .ant-select-selection-item {
    color: #1a1657;
  }

  &.ant-select-disabled .ant-select-selection-item {
    color: rgba(189, 188, 194, 1);
  }

  @media (width > 1660px) {
    & .ant-select-selection-item {
      font-size: 18px !important;
    }

    min-height: 40px !important;
  }
`

export default MonroeSelect
