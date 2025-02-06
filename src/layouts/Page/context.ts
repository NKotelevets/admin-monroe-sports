import React, { createContext, ReactElement, useContext } from 'react'
import { IBreadcrumbs } from '@/common/types'

export interface IPageContext {
  setBreadcrumbs: React.Dispatch<React.SetStateAction<IBreadcrumbs>>
  setPageTitle: React.Dispatch<React.SetStateAction<string>>
  pageTitle: string
  breadcrumbs: { title: ReactElement }[] | undefined
  controls?: (() => ReactElement) | ReactElement
  setControls: (control: ReactElement) => ReactElement
}

/**
 * PageContext
 *
 * A React Context for sharing page-level information, including the page title
 * and a function to update it.
 *
 * Interface:
 * - `IPageContext`:
 *   - `setPageTitle`: A React state setter function for updating the page title.
 *   - `pageTitle`: A string representing the current page title.
 *
 * Default Value:
 * - `undefined` (to enforce usage within a `PageProvider`).
 *
 * Usage:
 * - Wrap components in a provider that supplies `pageTitle` and `setPageTitle`:
 *
 * @example
 * <PageContext.Provider value={{ pageTitle, setPageTitle }}>
 *   {children}
 * </PageContext.Provider>
 *
 * @see IPageContext
 */
export const PageContext = createContext<IPageContext | undefined>(undefined)

/**
 * usePageContext Hook
 *
 * A custom hook for accessing the `PageContext` safely within a React component.
 *
 * Returns:
 * - An `IPageContext` object containing:
 *   - `pageTitle`: The current page title.
 *   - `setPageTitle`: A function to update the page title.
 *
 * Usage:
 * - Call `usePageContext` inside components wrapped in a `PageProvider`:
 * ```tsx
 * const { pageTitle, setPageTitle } = usePageContext()
 * ```
 *
 * Error Handling:
 * - Throws an error if called outside a `PageProvider`.
 *
 * @example
 * const ChildComponent = () => {
 *   const { pageTitle, setPageTitle } = usePageContext()
 *   useEffect(() => setPageTitle('New Title'), [])
 *   return <h1>{pageTitle}</h1>
 * }
 *
 * @throws {Error} If `usePageContext` is used without a `PageProvider`.
 * @see PageContext
 */
export const usePageContext = (): IPageContext => {
  const context = useContext(PageContext) as IPageContext | undefined

  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }

  return context
}
