import Space from 'antd/es/space'
import Typography from 'antd/es/typography'
import { CSSProperties, FC } from 'react'

import { TErrorDuplicate } from '@/common/types'

const duplicateTagStyles: CSSProperties = { border: '1px solid #FFD770', backgroundColor: '#FFF9EB' }
const errorTagStyles: CSSProperties = { border: '1px solid #FF594D', backgroundColor: '#FFF1F0' }

const ErrorDuplicateTag: FC<{ text: TErrorDuplicate }> = ({ text }) => {
  const style = text === 'Duplicate' ? duplicateTagStyles : errorTagStyles

  return (
    <Space
      style={{
        ...style,
        padding: '0 8px',
        borderRadius: '2px',
        fontSize: '12px',
      }}
    >
      <Typography.Text
        style={{
          color: text === 'Duplicate' ? 'rgba(243, 178, 9, 1)' : '#BC261B',
        }}
      >
        {text}
      </Typography.Text>
    </Space>
  )
}

export default ErrorDuplicateTag

