import { ReactElement, useCallback } from 'react'
import { useNotification } from '@/hooks/useNotification.ts'
import { ReactSVG } from 'react-svg'
import CopyIcon from '@/assets/icons/copy.svg'
import styled from '@emotion/styled'

interface ICopyButtonProps {
  content: string
  type: 'phone' | 'email'
}

export const CopyButton = (props: ICopyButtonProps): ReactElement => {
  const { content, type } = props
  const { notify } = useNotification()

  const handleCopyContent = useCallback(async () => {
    await navigator.clipboard.writeText(content)
    notify(`${type.replace(/^./, type[0].toUpperCase())} successfully copied`,'success')
  }, [content, type])

  return (
    <Copy onClick={handleCopyContent}>
      <ReactSVG src={CopyIcon} />
    </Copy>
  )
}

const Copy = styled.div`
    margin-left: 4px;
    cursor: pointer;
`
