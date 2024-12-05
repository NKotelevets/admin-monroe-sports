import { Flex, Menu, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from '@/components/Button.tsx'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { useContext } from 'react'
import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'
import { IDropdownProps } from '.'

/**
 * DropdownContent component displays the contents of the dropdown, including a search input,
 * a list of items, loading state, and action buttons (Cancel and Submit).
 * This component is used within the `Dropdown` component and interacts with the `DropdownContext`
 * to manage state such as selected item, search input, and loading state.
 *
 * @param props - The properties to configure the dropdown content behavior.
 * @param props.buttonTitle - The title to be displayed on the submit button.
 *
 * @returns The rendered dropdown content with a search input, item list, loading indicator, and action buttons.
 */
export const DropdownContent = (props: Pick<IDropdownProps, 'buttonTitle'>) => {
  const { buttonTitle } = props
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
    onLoadMore,
    onSubmit
  } = useContext(DropdownContext)

  /**
   * Handles the submit action, calling the `onSubmit` callback with the selected item.
   */
  const onSubmitAction = () => {
    !!selectedItem && onSubmit(selectedItem)
  }

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
            <Menu.Item key={item.value} disabled={item.disabled} onClick={() => setSelectedItem(item.value)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
        {!!onLoadMore && (
          <LoadingWrapper>
            <Loading visible={loading} size="small" indicator={<LoadingOutlined />} />
          </LoadingWrapper>
        )}
      </Scroll>

      <ActionRow>
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
          onClick={onSubmitAction}
          disabled={!selectedItem}
        >
          {buttonTitle}
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
    padding-top: 8px;
`
const LoadingWrapper = styled.div`
    background-color: white;
    width: 100%;
    height: 40px;
    display: inline-block;
    position: relative;
`
const Loading = styled(Spin)<{ visible: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 12px;
    color: ${colors.secondary};
    opacity: ${({ visible }) => visible ? 1 : 0};
`
