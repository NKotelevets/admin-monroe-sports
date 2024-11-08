import { ReactNode, useState } from 'react'
import { TableContext } from '@/hooks/useTableContext.ts'
import { showTotal } from '@/components/Table/utils.tsx'
import { ITableParams } from '@/common/interfaces'

interface TableProviderProps {
  children: ReactNode
}

export const TableProvider = <T,>({ children }: TableProviderProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [singleDeleting, setSingleDeleting] = useState<boolean>(false)
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const [showAdditionalHeader, setShowAdditionalHeader] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tableParams, setTableParams] = useState<ITableParams<T>>({
    pagination: {
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal,
    },
  })

  return (
    <TableContext.Provider
      value={{
        selectedIds,
        setSelectedIds,
        singleDeleting,
        setSingleDeleting,
        isAllSelected,
        setIsAllSelected,
        showAdditionalHeader,
        setShowAdditionalHeader,
        isLoading,
        setIsLoading,
        tableParams,
        setTableParams,
      }}
    >
      {children}
    </TableContext.Provider>
  )
}
