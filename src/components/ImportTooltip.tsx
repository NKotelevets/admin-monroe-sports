import styled from '@emotion/styled'
import { Flex, Tooltip } from 'antd'
import Typography from 'antd/es/typography'
import { FC, useState } from 'react'
import { ReactSVG } from 'react-svg'

import CloseIcon from '@/assets/icons/close.svg'
import ErrorIcon from '@/assets/icons/import-modal/error.svg'
import SuccessIcon from '@/assets/icons/import-modal/success.svg'
import WarningIcon from '@/assets/icons/import-modal/warning.svg'
import PaperClipIcon from '@/assets/icons/paper-clip.svg'
import SpinIcon from '@/assets/icons/spin.svg'

type TImportModalStatus = 'loading' | 'red' | 'green' | 'yellow'

interface IImportModalProps {
  title: string
  filename: string
  status: TImportModalStatus
  errorMessage?: string
  showInList: () => void
  redirectToImportInfo: () => void
  onClose: () => void
}

const ImportModalWrapper = styled(Flex)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow:
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 500;
  width: 500px;
  flex-direction: column;
`

const ImportModalTitle = styled(Typography)`
  color: rgba(26, 22, 87, 1) !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  line-height: 24px;
  margin-bottom: 16px;
`

const ImportModalContent = styled(Flex)`
  align-items: center;
  justify-content: space-between;

  padding: 9px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;

  &:hover {
    background-color: #f4f4f5;
  }
`

const ImportModalFileName = styled(Typography)<{ isError: boolean }>`
  color: ${(props) => (props.isError ? '#BC261B' : 'rgba(26, 22, 87, 1)')};
  font-size: 14px;
  margin-left: 8px;
`

const Wrapper = styled(Flex)<{ isError: boolean }>`
  align-items: center;

  & svg path {
    fill: ${(props) => (props.isError ? '#BC261B' : '#1A1657')};
  }
`

const Spin = styled.div<{ isError: boolean }>`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`

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
  const isError = status === 'red' || status === 'yellow'

  return (
    <ImportModalWrapper>
      <Flex justify="space-between">
        <ImportModalTitle>{title}</ImportModalTitle>

        <ReactSVG src={CloseIcon} onClick={onClose} style={{ cursor: 'pointer' }} />
      </Flex>

      <Tooltip title={errorMessage} color="rgba(62, 62, 72, 0.75)">
        <ImportModalContent
          onMouseEnter={() => setIsHoveredContent(true)}
          onMouseLeave={() => setIsHoveredContent(false)}
        >
          <Wrapper isError={isError}>
            <ReactSVG src={PaperClipIcon} />
            <ImportModalFileName isError={isError}>{filename}</ImportModalFileName>
          </Wrapper>

          {status === 'loading' && (
            <Spin isError={isError}>
              <ReactSVG src={SpinIcon} />
            </Spin>
          )}

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
        </ImportModalContent>
      </Tooltip>
    </ImportModalWrapper>
  )
}

export default ImportModal
