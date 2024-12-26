import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/Button.tsx'

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
  const ButtonComponent = (props: { onChange(event: ChangeEvent<HTMLInputElement>): Promise<void> }) => (
    <>
      <Button
        icon={<DownloadOutlined />}
        iconPosition="start"
        type="default"
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        {buttonTitle}
      </Button>
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
    Button: ButtonComponent,
    setFileKey,
    fileKey,
    inputRef
  }
}
