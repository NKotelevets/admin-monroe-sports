import { ImportButton } from '@/components/Elements'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import { ChangeEvent, useRef, useState } from 'react'

interface IUseImportFileProps {
  buttonTitle: string
  accept: '.csv' | '.xlsx'
}

export const useImportFile = (props: IUseImportFileProps) => {
  const { buttonTitle, accept } = props

  const inputRef = useRef<HTMLInputElement | null>()
  const [fileKey, setFileKey] = useState('')

  /**
   * Import button component
   * @param props
   * @constructor
   */
  const Button = (props: { onChange(event: ChangeEvent<HTMLInputElement>): Promise<void> }) => (
    <>
      <ImportButton
        icon={<DownloadOutlined />}
        iconPosition="start"
        type="default"
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        {buttonTitle}
      </ImportButton>
      <input
        ref={(ref) => {
          inputRef.current = ref
        }}
        type="file"
        name="import-files-input"
        accept={accept}
        onChange={props.onChange}
        className="d-n"
        key={fileKey}
      />
    </>
  )

  return {
    Button,
    setFileKey,
    fileKey,
    inputRef
  }
}
