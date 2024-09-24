import { Button, Flex, List, Radio, Typography } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { CSSProperties, FC } from 'react'

const getListItemStyles = (isSelected: boolean): CSSProperties => ({
  padding: '5px 12px',
  justifyContent: 'normal',
  backgroundColor: isSelected ? '#F1F0FF' : 'transparent',
  borderBlockEnd: 0,
})

const resetButtonStyles: CSSProperties = {
  padding: '0 7px',
  border: 0,
  height: 'auto',
}

const okButtonStyles: CSSProperties = {
  color: 'rgba(255, 255, 255, 1)',
  padding: '0 7px',
  height: 'auto',
}

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
            <List.Item style={getListItemStyles(isSelected)}>
              <Radio value={item.value} style={{ marginRight: '8px' }} />

              <Typography
                style={{
                  color: isSelected ? '#3E34CA' : 'rgba(26, 22, 87, 0.85)',
                }}
              >
                {item.text}
              </Typography>
            </List.Item>
          )
        }}
      />
    </Radio.Group>

    <Flex
      style={{
        padding: '8px',
      }}
      justify="space-around"
    >
      <Button
        type="default"
        onClick={() => clearFilters && clearFilters()}
        style={{
          ...resetButtonStyles,
          color: selectedKeys.length ? 'rgba(188, 38, 27, 1)' : 'rgba(189, 188, 194, 1)',
        }}
      >
        Reset
      </Button>

      <Button type="primary" onClick={() => confirm()} style={okButtonStyles}>
        OK
      </Button>
    </Flex>
  </Flex>
)

export default MonroeFilterRadio

