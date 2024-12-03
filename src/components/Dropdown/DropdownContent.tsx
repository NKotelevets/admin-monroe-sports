import { Flex, Menu, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from '@/components/Button.tsx'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import TextInput from '../Inputs/TextInput'
import { useContext } from 'react'
import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'

export const DropdownContent = () => {
  const {
    items,
    loading,
    selectedItem,
    searchValue,
    dropdownRef,
    setSearchValue,
    setSelectedItem,
    setIsDropdownOpen,
    onSearch,
    onScroll,
    onAddTeam
  } = useContext(DropdownContext)

  return (
    <View
      className="ant-dropdown-menu ant-dropdown-menu-root"
      ref={dropdownRef}
      vertical
    >
      {!!onSearch && (
        <Input
          value={searchValue}
          name="dropdown-search"
          placeholder="Search team"
          onChange={(value) => {
            setSearchValue(value.target.value)
            onSearch(value.target.value)
          }}
        />
      )}
      <Scroll onScroll={onScroll}>
        <Menu selectedKeys={selectedItem ? [selectedItem] : []}>
          {items.map((item) => (
            <Menu.Item key={item.value} onClick={() => setSelectedItem(item.value)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
        {loading && (
          <div style={{ textAlign: 'center', padding: 8 }}>
            <Spin />
          </div>
        )}
        {loading && <Loading style={{ background: 'white' }} size="small" indicator={<LoadingOutlined />} />}
      </Scroll>

      <ActionRow
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 8
        }}
      >
        <Button
          type="link"
          onClick={() => {
            setSelectedItem(null)
            setIsDropdownOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={onAddTeam}
          disabled={!selectedItem}
        >
          Add team
        </Button>
      </ActionRow>
    </View>
  )
}

// Styled Components
const View = styled(Flex)`
    margin-top: 0 !important;
    padding: 8px !important;
    width: 278px;
    height: 352px
`
const Input = styled(TextInput)`
    line-height: 0;
    margin-bottom: 8px
`
const Scroll = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: scroll;
`
const ActionRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 8
`
const Loading = styled(Spin)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    color: ${colors.secondary}
`
