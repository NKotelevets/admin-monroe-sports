import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { ITableParams } from '@/common/interfaces'

/**
 * Interface representing the structure and methods of the Table context.
 *
 * @template T - The generic type parameter for table data.
 */
interface ITableContextType<T> {
  /**
   * Array of selected IDs within the table.
   */
  selectedIds: string[]

  /**
   * Indicates if a single item is currently being deleted.
   */
  singleDeleting: boolean

  /**
   * Flag indicating if all items in the table are selected.
   */
  isAllSelected: boolean

  /**
   * Determines whether an additional header should be shown in the table.
   */
  showAdditionalHeader: boolean

  /**
   * Loading state of the table, typically used for data fetching or processing.
   */
  isLoading: boolean

  /**
   * Table parameters such as sorting, filtering, and pagination.
   */
  tableParams: ITableParams<T>

  /**
   * Updates the array of selected IDs in the table.
   *
   * @param ids - Array of IDs to be set as selected.
   */
  setSelectedIds(ids: string[]): void

  /**
   * Sets the state of whether a single item is being deleted.
   *
   * @param value - Boolean value indicating the deletion state.
   */
  setSingleDeleting(value: boolean): void

  /**
   * Toggles the selection of all items in the table.
   *
   * @param value - Boolean value indicating whether all items should be selected.
   */
  setIsAllSelected(value: boolean): void

  /**
   * Controls the visibility of an additional header in the table.
   *
   * @param value - Boolean value indicating whether to show the additional header.
   */
  setShowAdditionalHeader(value: boolean): void

  /**
   * Updates the loading state of the table.
   *
   * @param value - Boolean value indicating the loading state.
   */
  setIsLoading(value: boolean): void

  /**
   * Sets the table parameters, like sorting, filtering, or pagination.
   *
   * @param action - A function that receives the previous state and returns the new state.
   */
  setTableParams: Dispatch<SetStateAction<ITableParams<T>>>

  showCreatedRecords: boolean
  setShowCreatedRecords(value: boolean): void
  onShowSchedule?(ids: string[], start: string, end: string): void

}

/**
 * The context for the Table, providing state and methods for table management.
 */
export const TableContext = createContext<ITableContextType<never> | undefined>(undefined)

/**
 * Custom hook for accessing the Table context. Ensures the context is used within a valid provider.
 *
 * @template T - The generic type parameter for table data.
 * @returns {ITableContextType<T>} - The Table context with state and methods.
 * @throws Will throw an error if used outside a TableProvider.
 */
export const useTableContext = <T,>(): ITableContextType<T> => {
  const context = useContext(TableContext) as ITableContextType<T> | undefined

  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider')
  }

  return context
}
