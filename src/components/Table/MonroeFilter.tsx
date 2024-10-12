import { Checkbox, Flex, List } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { FC } from 'react'

import { ConfirmButton, ResetButton, StyledListItem, TextWrapper } from '@/components/Table/Elements'

const MonroeFilter: FC<FilterDropdownProps> = ({ confirm, selectedKeys, setSelectedKeys, clearFilters, filters }) => (
  <Flex vertical>
    <List
      dataSource={filters}
      renderItem={(item) => {
        const isSelected = selectedKeys.includes(item.value as string)

        const handleChange = () => {
          if (isSelected) {
            const filteredKeys = selectedKeys.filter((selectedKey) => selectedKey !== (item.value as string))

            setSelectedKeys(filteredKeys)
          } else {
            setSelectedKeys([...selectedKeys, item.value as string])
          }
        }

        return (
          <StyledListItem is_selected={`${isSelected}`}>
            <Checkbox checked={selectedKeys.includes(item.value as string)} onChange={handleChange} className="mg-r8" />
            <TextWrapper is_selected={`${isSelected}`}>{item.text}</TextWrapper>
          </StyledListItem>
        )
      }}
    />

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

export default MonroeFilter
