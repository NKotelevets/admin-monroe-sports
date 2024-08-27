import Typography from 'antd/es/typography'
import { FC, ReactNode } from 'react'

interface PropsWithChildren {
  children: ReactNode
  isLink?: boolean
  onClick?: () => void
}

const CellText: FC<PropsWithChildren> = ({ children, isLink = false, onClick }) => (
  <Typography.Text
    style={{
      color: isLink ? 'rgba(62, 52, 202, 1)' : 'rgba(26, 22, 87, 0.85)',
      fontSize: '14px',
      cursor: isLink ? 'pointer' : 'default',
    }}
    onClick={onClick}
  >
    {children}
  </Typography.Text>
)

export default CellText
