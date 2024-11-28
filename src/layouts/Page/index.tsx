import { Helmet } from 'react-helmet'
import { PageContainer, ProtectedPageTitle } from '@/components/Elements'
import { Flex } from 'antd'
import BaseLayout from '@/layouts/BaseLayout'
import { FC, ReactElement, useState } from 'react'
import styled from '@emotion/styled'
import { PageContext } from './context'
import Breadcrumb from 'antd/es/breadcrumb'
import { Description } from '@/components/Elements/deletingBlockingInfoElements.tsx'


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
  breadcrumbs?: { title: ReactElement }[]
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
  const { title, children, subtitle, breadcrumbs, controls } = props
  const [pageTitle, setPageTitle] = useState(title)

  return (
    <PageContext.Provider value={{
      setPageTitle,
      pageTitle
    }}>
    <>
      <div id="page-portal"></div>
      <BaseLayout>
        <>
          <Helmet>
            <title>Admin Panel | {pageTitle}</title>
          </Helmet>

          <PageContainer>
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
`
const Controls = styled(Flex)`
`
const PageInfo = styled(Flex)`
    margin: 8px 0 24px;
`
const Title = styled(ProtectedPageTitle)`
    margin: 0;
`
const Subtitle = styled(Description)`
    margin: 0;
    margin-top: 8px
`
