import { Button } from '../Button.tsx'
import { Dropdown as Dropd } from 'antd'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { DropdownProvider } from '@/components/Dropdown/DropdownProvider.tsx'
import { DropdownContent } from '@/components/Dropdown/DropdownContent.tsx'
import { useContext } from 'react'
import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'

export interface IDropdownProps {
  items: { label: string, value: string }[]
  value?: string | null
  loading: boolean

  onSearch?(value: string): void

  onLoadMore(): void

  onValueChange?(value: string | null): void
}

export const Dropdown = (props: IDropdownProps) => {
  const {
    items,
    loading,
    value = null,
    onLoadMore,
    onSearch,
    onValueChange
  } = props

  return (
    <DropdownProvider
      items={items}
      loading={loading}
      value={value}
      onLoadMore={onLoadMore}
      onSearch={onSearch}
      onValueChange={onValueChange}
    >
      <DropdownButton />
    </DropdownProvider>

  )
}

const DropdownButton = () => {
  const { isDropdownOpen, setIsDropdownOpen } = useContext(DropdownContext)

  return (
    <Dropd
      placement="bottomRight"
      overlayClassName="dropdown"
      open={isDropdownOpen}
      dropdownRender={() => <DropdownContent />}
    >
      <Button icon={<PlusOutlined />} onClick={() => setIsDropdownOpen(true)}>Add team</Button>
    </Dropd>
  )
}
