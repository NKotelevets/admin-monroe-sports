import { Flex, Modal } from 'antd'
import { FC, ReactNode } from 'react'
import { ReactSVG } from 'react-svg'

import './monroe-modal.module.css'

import WarningIcon from '@/assets/icons/warn.svg'

type TMonroeModalType = 'warn'

interface IMonroeModalProps {
  onOk: () => void
  onCancel: () => void
  type: TMonroeModalType
  title: string
  content?: ReactNode
  okText: string
}

const MonroeModal: FC<IMonroeModalProps> = ({ onCancel, onOk, title, content, okText }) => (
  <div className="monroe-modal-overlay">
    <Modal centered open onOk={onOk} onCancel={onCancel} okText={okText}>
      <Flex>
        <div style={{ marginRight: '16px' }}>
          <ReactSVG src={WarningIcon} />
        </div>

        <div style={{ color: '#1A1657D9' }}>
          <h3>{title}</h3>
          {content}
        </div>
      </Flex>
    </Modal>
  </div>
)

export default MonroeModal
