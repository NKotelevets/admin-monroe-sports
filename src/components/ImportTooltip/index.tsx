import { Flex, Tooltip } from 'antd'
import Typography from 'antd/es/typography'
import { FC, useState } from 'react'
import { ReactSVG } from 'react-svg'

import classes from './import-modal.module.css'

import CloseIcon from '@/assets/icons/close.svg'
import ErrorIcon from '@/assets/icons/import-modal/error.svg'
import SuccessIcon from '@/assets/icons/import-modal/success.svg'
import WarningIcon from '@/assets/icons/import-modal/warning.svg'
import PaperClipIcon from '@/assets/icons/paper-clip.svg'
import SpinIcon from '@/assets/icons/spin.svg'

type TImportModalStatus = 'loading' | 'red' | 'green' | 'yellow'

const CLASS_OPTIONS: Record<TImportModalStatus, string> = {
  loading: '',
  red: 'red-text',
  green: '',
  yellow: 'red-text',
}

interface IImportModalProps {
  title: string
  filename: string
  status: TImportModalStatus
  errorMessage?: string
  showInList: () => void
  redirectToImportInfo: () => void
  onClose: () => void
}

const ImportModal: FC<IImportModalProps> = ({
  filename,
  title,
  status,
  errorMessage = '',
  showInList,
  redirectToImportInfo,
  onClose,
}) => {
  const [isHoveredContent, setIsHoveredContent] = useState(false)

  return (
    <Flex className={classes['import-modal']} vertical>
      <Flex justify="space-between">
        <Typography.Title level={5} className={classes['import-modal-title']}>
          {title}
        </Typography.Title>

        <ReactSVG src={CloseIcon} onClick={onClose} />
      </Flex>

      <Tooltip title={errorMessage} color="rgba(62, 62, 72, 0.75)">
        <Flex
          className={classes['import-modal-content']}
          align="center"
          justify="space-between"
          onMouseEnter={() => setIsHoveredContent(true)}
          onMouseLeave={() => setIsHoveredContent(false)}
        >
          <Flex className={classes[CLASS_OPTIONS[status]]} align="center">
            <ReactSVG className={classes['paper-clip']} src={PaperClipIcon} />
            <Typography className={classes['import-modal-filename']}>{filename}</Typography>
          </Flex>

          {status === 'loading' && <ReactSVG className={classes['spin']} src={SpinIcon} />}

          {status === 'green' &&
            (isHoveredContent ? (
              <Typography style={{ color: 'rgba(62, 52, 202, 1)', cursor: 'pointer' }} onClick={showInList}>
                Show in list
              </Typography>
            ) : (
              <ReactSVG src={SuccessIcon} />
            ))}

          {status === 'red' && <ReactSVG src={ErrorIcon} />}

          {status === 'yellow' &&
            (isHoveredContent ? (
              <Typography style={{ color: 'rgba(62, 52, 202, 1)', cursor: 'pointer' }} onClick={redirectToImportInfo}>
                Import info
              </Typography>
            ) : (
              <ReactSVG src={WarningIcon} />
            ))}
        </Flex>
      </Tooltip>
    </Flex>
  )
}

export default ImportModal
