import { Button } from '../Button.tsx'
import { Dropdown as Dropd } from 'antd'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { DropdownProvider } from '@/components/Dropdown/DropdownProvider.tsx'
import { DropdownContent } from '@/components/Dropdown/DropdownContent.tsx'
import { useContext } from 'react'
import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'

/**
 * Props for the `Dropdown` component.
 * This component renders a button that opens a dropdown with a list of items.
 */
export interface IDropdownProps {
  /** List of items to be displayed in the dropdown. Each item has a label and value. */
  items: { label: string, value: string }[]

  /** The currently selected value in the dropdown, or null if no value is selected. */
  value?: string | null

  /** Indicates whether the dropdown is in a loading state. */
  loading: boolean

  /** Title displayed on the dropdown button. */
  buttonTitle: string

  /**
   * Optional callback triggered when the search input value changes.
   * @param value - The current search input value.
   */
  onSearch?(value: string): void

  /**
   * Optional callback triggered to load more items, typically used for infinite scrolling.
   */
  onLoadMore?(): void

  /**
   * Optional callback triggered when the selected value changes.
   * @param value - The selected value, or null if selection is cleared.
   */
  onValueChange?(value: string | null): void

  /**
   * Callback triggered when the submit action is performed.
   * @param value - The value being submitted.
   */
  onSubmit(value: string): void
}

/**
 * Dropdown component that manages the rendering of the dropdown button and its contents.
 * Wraps the `DropdownProvider` to manage dropdown state and context.
 *
 * @param props - The properties to configure the dropdown behavior.
 * @returns The rendered dropdown button and context provider.
 */
export const Dropdown = (props: IDropdownProps) => {
  const {
    items,
    loading,
    value = null,
    onLoadMore,
    onSearch,
    onValueChange,
    onSubmit,
    buttonTitle
  } = props

  return (
    <DropdownProvider
      items={items}
      loading={loading}
      value={value}
      onLoadMore={onLoadMore}
      onSearch={onSearch}
      onValueChange={onValueChange}
      onSubmit={onSubmit}
    >
      <DropdownButton buttonTitle={buttonTitle} />
    </DropdownProvider>
  )
}

/**
 * Button component that triggers the dropdown to open.
 * Displays a button with an icon, and toggles the dropdown state when clicked.
 *
 * @param buttonTitle - The title to be displayed on the dropdown button.
 * @returns The rendered dropdown button.
 */
const DropdownButton = ({ buttonTitle }: Pick<IDropdownProps, 'buttonTitle'>) => {
  const { isDropdownOpen, setIsDropdownOpen } = useContext(DropdownContext)

  return (
    <Dropd
      placement="bottomRight"
      overlayClassName="dropdown"
      open={isDropdownOpen}
      dropdownRender={() => <DropdownContent buttonTitle={buttonTitle} />}
      destroyPopupOnHide={false}
    >
      <Button icon={<PlusOutlined />} onClick={() => setIsDropdownOpen(true)}>{buttonTitle}</Button>
    </Dropd>
  )
}
