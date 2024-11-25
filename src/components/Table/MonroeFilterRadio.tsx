import { Flex, List, Radio } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { FC } from 'react'

import { ConfirmButton, ResetButton, StyledListItem, TextWrapper } from '@/components/Table/Elements'

const MonroeFilterRadio: FC<FilterDropdownProps> = ({
  confirm,
  selectedKeys,
  setSelectedKeys,
  clearFilters,
  filters,
}) => (
  <Flex vertical>
    <Radio.Group onChange={(e) => setSelectedKeys([e.target.value])} value={selectedKeys[0]}>
      <List
        dataSource={filters}
        renderItem={(item) => {
          const isSelected = selectedKeys.includes(item.value as string)

          return (
            <StyledListItem is_selected={`${isSelected}`}>
              <Radio value={item.value} className="mg-r8" />
              <TextWrapper is_selected={`${isSelected}`}>{item.text}</TextWrapper>
            </StyledListItem>
          )
        }}
      />
    </Radio.Group>

    <Flex className="p8" justify="space-around">
      <ResetButton
        onClick={() => {
          clearFilters && clearFilters()
          confirm()
        }}
        has_length={`${!!selectedKeys.length}`}
      >
        Reset
      </ResetButton>

      <ConfirmButton type="primary" onClick={() => confirm()}>
        OK
      </ConfirmButton>
    </Flex>
  </Flex>
)

export default MonroeFilterRadio

