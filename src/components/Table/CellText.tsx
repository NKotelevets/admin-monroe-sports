import styled from '@emotion/styled'
import Typography from 'antd/es/typography'
import { FC, ReactNode } from 'react'

interface PropsWithChildren {
  children: ReactNode
  isLink?: boolean
  onClick?: () => void
}

const StyledTypography = styled(Typography)<{ isLink: boolean }>`
  font-size: 14px;
  color: ${(props) => props.isLink ? 'rgba(62, 52, 202, 1)' : 'rgba(26, 22, 87, 0.85)'};
  cursor: ${(props) => props.isLink? 'pointer' : 'default'};

  //@media (width > 1660px) {
  //  font-size: 16px;
  //}
`

const CellText: FC<PropsWithChildren> = ({ children, isLink = false, onClick }) => (
  <StyledTypography isLink={isLink} onClick={onClick}>
    {children}
  </StyledTypography>
)

export default CellText
