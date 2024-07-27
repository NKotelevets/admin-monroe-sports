import { Flex, Modal, Typography } from 'antd'
import { FC, ReactNode } from 'react'
import { ReactSVG } from 'react-svg'

import './monroe-modal.module.css'

import WarningIcon from '@/assets/icons/warn.svg'

type TMonroeModalType = 'warn';

interface IMonroeModalProps {
  onOk: () => void;
  onCancel: () => void;
  type: TMonroeModalType;
  title: string;
  content?: ReactNode;
  okText: string;
}

const MonroeModal: FC<IMonroeModalProps> = ({
  onCancel,
  onOk,
  title,
  content,
  okText,
}) => (
  <div className="monroe-modal-overlay">
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
  </div>
)

export default MonroeModal
