import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import { ChangeEvent, useRef, useState } from 'react'

import { Button } from '@/components/Button.tsx'

interface IUseImportFileProps {
  buttonTitle: string
  accept: '.csv' | '.xlsx'
}

export const useImportFile = (props?: IUseImportFileProps) => {
  const inputRef = useRef<HTMLInputElement | null>()
  const [fileKey, setFileKey] = useState('')

  /**
   * Import button component
   * @param innerProps
   * @constructor
   */
  const ButtonComponent = (innerProps: { onChange(event: ChangeEvent<HTMLInputElement>): Promise<void> }) => {
    if (!props) {
      throw new Error('Missing props to display import button')
    }

    const { buttonTitle, accept } = props!
    return (
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
          onChange={innerProps.onChange}
          className="d-n"
          key={fileKey}
        />
      </>
    )
  }

  return {
    Button: ButtonComponent,
    setFileKey,
    fileKey,
    inputRef,
  }
}
