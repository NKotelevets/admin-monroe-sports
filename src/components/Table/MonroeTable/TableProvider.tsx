import { ReactElement, ReactNode, useState } from 'react'
import { TableContext } from '@/hooks/useTableContext.ts'
import { showTotal } from '@/components/Table/utils.tsx'
import { ITableParams } from '@/common/interfaces'

/**
 * Interface representing the props for the TableProvider component.
 */
interface TableProviderProps {
  /**
   * The child components that will have access to the Table context.
   */
  children: ReactNode;
}

/**
 * The TableProvider component that manages and provides the Table context state and methods to its children.
 *
 * @template T - The generic type parameter for table data.
 * @param {TableProviderProps} props - Props containing the children components.
 * @returns {ReactElement} The TableContext.Provider wrapping the children, providing table-related state and functions.
 *
 * @example
 * <TableProvider>
 *   <YourTableComponent />
 * </TableProvider>
 */
export const TableProvider = <T,>({ children }: TableProviderProps): ReactElement => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [singleDeleting, setSingleDeleting] = useState<boolean>(false)
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const [showAdditionalHeader, setShowAdditionalHeader] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
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
        showCreatedRecords,
        setShowCreatedRecords
      }}
    >
      {children}
    </TableContext.Provider>
  )
}
