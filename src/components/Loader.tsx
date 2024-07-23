import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { Flex, Spin, Typography } from 'antd'
import { CSSProperties, FC } from 'react'

const overlayStyles: CSSProperties = {
  position: 'fixed',
  zIndex: 9999,
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgba(41, 41, 48, 0.3)',
}

const modalStyles: CSSProperties = {
  padding: '40px 32px',
  backgroundColor: '#FFFFFF',
}

const textStyle: CSSProperties = {
  color: 'rgba(29, 30, 34, 1)',
  fontSize: '16px',
  marginTop: '8px',
}

const loaderStyles: CSSProperties = {
  fontSize: 32,
  color: 'rgba(26, 22, 87, 0.85)',
}

const Loader: FC<{ text?: string }> = ({ text }) => (
  <Flex align="center" justify="center" style={overlayStyles}>
    <Flex vertical style={modalStyles}>
      <Spin indicator={<LoadingOutlined style={loaderStyles} spin />} />
      {text && <Typography style={textStyle}>{text}</Typography>}
    </Flex>
  </Flex>
)

export default Loader

