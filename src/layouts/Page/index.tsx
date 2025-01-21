import { Helmet } from 'react-helmet'
import { PageContainer, ProtectedPageTitle } from '@/components/Elements'
import { Flex } from 'antd'
import BaseLayout from '@/layouts/BaseLayout'
import { FC, ReactElement, useState } from 'react'
import styled from '@emotion/styled'
import { PageContext } from './context'
import Breadcrumb from 'antd/es/breadcrumb'
import { Description } from '@/components/Elements/deletingBlockingInfoElements.tsx'
import { IBreadcrumbs } from '@/common/types'


/**
 * Interface representing the props for the Page component.
 *
 * @property {string} title - The title of the page, displayed in the header and the HTML document's title.
 * @property {ReactElement} children - The main content of the page, rendered within a flexible container.
 * @property {() => ReactElement} [controls] - An optional function that returns a React element for additional controls
 *                                            (e.g., buttons or actions) displayed in the header.
 */
export interface IPageProps {
  title: string
  children: ReactElement

  subtitle?: string
  breadcrumbs?: IBreadcrumbs

  className?: string

  controls?(): ReactElement
}

/**
 * A Page component that provides a consistent layout for pages in the Admin Panel.
 * It wraps the content in a `BaseLayout` and includes a header with the page title and optional controls.
 *
 * @param {IPageProps} props - The props for the Page component, including the title, content, and optional controls.
 * @returns {ReactElement} The rendered Page component.
 *
 * @example
 * <Page title="Page Title">
 *  <YourComponent />
 * </Page>
 */
export const Page: FC<IPageProps> = (props: IPageProps): ReactElement => {
  const {
    title,
    children,
    subtitle,
    className,
    breadcrumbs: initialBreadcrumbs,
    controls
  } = props

  const [pageTitle, setPageTitle] = useState(title)
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbs>(initialBreadcrumbs)

  return (
    <PageContext.Provider value={{
      pageTitle,
      breadcrumbs,
      setPageTitle,
      setBreadcrumbs
    }}>
      <>
        <div id="page-portal"></div>
        <BaseLayout>
          <>
            <Helmet>
              <title>Admin Panel | {pageTitle}</title>
            </Helmet>

            <PageContainer className={className}>
              {!!breadcrumbs && <Breadcrumb items={breadcrumbs} />}

              <Header justify="space-between" align="center" vertical={false}>
                <PageInfo vertical>
                  <Title>{pageTitle}</Title>
                  {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
                </PageInfo>

                <Controls>
                  {!!controls && controls()}
                </Controls>
              </Header>

              <Flex flex="1 1 auto" vertical>
                {children}
              </Flex>
            </PageContainer>
          </>
        </BaseLayout>
      </>
    </PageContext.Provider>
  )
}

const Header = styled(Flex)`
  margin-bottom: 24px
`
const Controls = styled(Flex)`
    margin-top: 0;
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
`
const PageInfo = styled(Flex)`
    margin: 0
`
const Title = styled(ProtectedPageTitle)`
    margin: 0 !important;
`
const Subtitle = styled(Description)`
    margin: 8px 0 0;
`
