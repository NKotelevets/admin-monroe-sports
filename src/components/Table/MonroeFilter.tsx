import { Button, Checkbox, Flex, List } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { FC, useCallback } from 'react'

import { TextWrapper } from '@/components/Table/Elements'
import styled from '@emotion/styled'

const MonroeFilter: FC<FilterDropdownProps> = (props) => {
  const {
    confirm,
    selectedKeys,
    setSelectedKeys,
    clearFilters,
    filters
  } = props

  const onClean = useCallback(() => {
    setSelectedKeys([])

    !!clearFilters && clearFilters()
    confirm()
    close()
  }, [setSelectedKeys])

  return (
    <Flex vertical className="p8">
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
            <Item>
              <Checkbox checked={selectedKeys.includes(item.value as string)} onChange={handleChange} className="mg-r8" />
              <TextWrapper is_selected={`${isSelected}`}>{item.text}</TextWrapper>
            </Item>
          )
        }}
      />

      <Footer align="center" justify="space-between">
        <Button
          disabled={selectedKeys.length === 0}
          size="small"
          type='link'
          onClick={onClean}
        >
          Reset
        </Button>

        <Button
          type="primary"
          size='small'
          onClick={() => confirm()}
        >
          OK
        </Button>
      </Footer>
    </Flex>
  )
}

export default MonroeFilter

const Footer = styled(Flex)`
    margin-top: 12px
`
const Item = styled(Flex)`
    padding: 4px
`
