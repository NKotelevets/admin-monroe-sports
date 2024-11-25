import styled from '@emotion/styled'
import Typography from 'antd/es/typography'
import { FC, ReactNode } from 'react'

interface PropsWithChildren {
  children: ReactNode
  isLink?: boolean
  onClick?: () => void
}

const StyledTypography = styled(Typography)<{ is_link: string }>`
  font-size: 14px;
  color: ${(props) => (props.is_link === 'true' ? 'rgba(62, 52, 202, 1)' : 'rgba(26, 22, 87, 0.85)')};
  cursor: ${(props) => (props.is_link === 'true' ? 'pointer' : 'default')};

  @media (width > 1660px) {
    font-size: 16px;
  }
`

const CellText: FC<PropsWithChildren> = ({ children, isLink = false, onClick }) => (
  <StyledTypography is_link={`${isLink}`} onClick={onClick}>
    {children}
  </StyledTypography>
)

export default CellText
