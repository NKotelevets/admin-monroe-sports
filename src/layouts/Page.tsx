import { Helmet } from 'react-helmet'
import { PageContainer, ProtectedPageTitle } from '@/components/Elements'
import { Flex } from 'antd'
import BaseLayout from '@/layouts/BaseLayout'
import { FC, ReactElement } from 'react'
import styled from '@emotion/styled'

export interface IPageProps {
  title: string
  children: ReactElement

  controls?(): ReactElement
}

export const Page: FC<IPageProps> = (props) => {
  const {
    title,
    children,
    controls
  } = props

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | {title} </title>
        </Helmet>

        <PageContainer>
          <Header justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>{title}</ProtectedPageTitle>

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
  )
}

const Header = styled(Flex)`
`
const Controls = styled(Flex)`
`
