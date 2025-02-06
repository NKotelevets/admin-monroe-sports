import { Button, Flex, InputRef } from 'antd'
import Input from 'antd/es/input/Input'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { FC, useCallback } from 'react'

interface IFilterDropDownProps extends FilterDropdownProps {
  handleSearch: (confirm: FilterDropdownProps['confirm']) => void
  searchInput: React.RefObject<InputRef>
  handleReset: (clearFilters: () => void) => void
}

const FilterDropDown: FC<IFilterDropDownProps> = (props) => {
  const {
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    handleSearch,
    searchInput,
  } = props

  const onClean = useCallback(() => {
    setSelectedKeys([])

    !!clearFilters && clearFilters()
    confirm()
    close()
  }, [setSelectedKeys])

  return (
    <Flex vertical className="p8" onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder="Search name"
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(confirm)}
        className="mg-b8 d-b"
      />
      <Flex justify="space-between">
        <Button className="mg-r8 f-full" type="primary" onClick={() => handleSearch(confirm)}>
          Search
        </Button>
        <Button
          className="f-full"
          onClick={onClean}
          style={{
            color: selectedKeys.length ? 'rgb(188, 38, 27)' : 'rgb(189, 188, 194)',
          }}
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  )
}

export default FilterDropDown
