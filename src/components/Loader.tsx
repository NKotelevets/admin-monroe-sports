import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import styled from '@emotion/styled'
import { Flex, Spin, Typography } from 'antd'
import { FC } from 'react'

const Overlay = styled(Flex)`
  position: fixed;
  z-index: 9999;
  height: 100vh;
  width: 100vw;
  background-color: rgba(41, 41, 48, 0.3);
  align-items: center;
  justify-content: center;
`

const Modal = styled(Flex)`
  padding: 40px 32px;
  background-color: #ffffff;
  flex-direction: column;
`

const Indicator = styled(LoadingOutlined)`
  font-size: 32px;
  color: rgba(26, 22, 87, 0.85);
`

const TextWrapper = styled(Typography)`
  color: rgb(29, 30, 34);
  font-size: 16px;
  margin-top: 8px;
`

const Loader: FC<{ text?: string }> = ({ text }) => (
  <Overlay>
    <Modal>
      <Spin indicator={<Indicator spin />} />
      {text && <TextWrapper>{text}</TextWrapper>}
    </Modal>
  </Overlay>
)

export default Loader
