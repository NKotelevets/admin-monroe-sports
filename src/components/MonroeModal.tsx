import styled from '@emotion/styled'
import { Flex, Modal, Typography } from 'antd'
import { FC, ReactNode } from 'react'
import { ReactSVG } from 'react-svg'

import WarningIcon from '@/assets/icons/warn.svg'

type TMonroeModalType = 'warn'

const MonroeModalOverlay = styled.div`
  position: fixed;
  background-color: rgba(41, 41, 48, 0.7);
  height: 100vh;
  width: 100vw;
`

interface IMonroeModalProps {
  onOk: () => void
  onCancel?: () => void
  type: TMonroeModalType
  title: string
  content?: ReactNode
  okText: string
}

const MonroeModal: FC<IMonroeModalProps> = ({ onCancel, onOk, title, content, okText }) => (
  <MonroeModalOverlay>
    <Modal centered open onOk={onOk} onCancel={onCancel} okText={okText}>
      <Flex style={{ width: '416px' }}>
        <div style={{ marginRight: '16px' }}>
          <ReactSVG src={WarningIcon} />
        </div>

        <div>
          <Typography.Title
            level={3}
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: 'rgba(26, 22, 87, 0.85)',
            }}
          >
            {title}
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: '14px',
              color: 'rgba(26, 22, 87, 0.85)',
            }}
          >
            {content}
          </Typography.Text>
        </div>
      </Flex>
    </Modal>
  </MonroeModalOverlay>
)

export default MonroeModal
