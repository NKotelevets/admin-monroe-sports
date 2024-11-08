import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { ITableParams } from '@/common/interfaces'

interface ITableContextType<T> {
  selectedIds: string[]
  singleDeleting: boolean
  isAllSelected: boolean
  showAdditionalHeader: boolean
  isLoading: boolean
  tableParams: ITableParams<T>

  setSelectedIds(ids: string[]): void

  setSingleDeleting(value: boolean): void

  setIsAllSelected(value: boolean): void

  setShowAdditionalHeader(value: boolean): void

  setIsLoading(value: boolean): void

  setTableParams: Dispatch<SetStateAction<ITableParams<T>>>
}

export const TableContext = createContext<ITableContextType<never> | undefined>(undefined)

export const useTableContext = <T,>(): ITableContextType<T> => {
  const context = useContext(TableContext)  as ITableContextType<T> | undefined

  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider')
  }

  return context
}
