import styled from '@emotion/styled'
import { Space } from 'antd'
import Typography from 'antd/es/typography/Typography'
import { FC } from 'react'

import { TErrorDuplicate } from '@/common/types'

const ErrorTagType = styled(Space)`
  border: 1px solid #ff594d;
  background-color: #fff1f0;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
`

const DuplicateTagType = styled(Space)`
  border: 1px solid #ffd770;
  background-color: #fff9eb;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
`

const TagType: FC<{ text?: TErrorDuplicate }> = ({ text = 'Error' }) => (
  <>
    {text === 'Error' ? (
      <ErrorTagType>
        <Typography style={{ color: '#BC261B' }}>{text}</Typography>
      </ErrorTagType>
    ) : (
      <DuplicateTagType>
        <Typography style={{ color: 'rgba(243, 178, 9, 1)' }}>{text}</Typography>
      </DuplicateTagType>
    )}
  </>
)

export default TagType

