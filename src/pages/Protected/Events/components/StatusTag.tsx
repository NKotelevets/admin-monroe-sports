import { CheckCircleOutlined, QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

import { Tag } from '@/components/Tag.tsx'

type TStatusTagProps = {
  title: string
  type: 'No' | 'Yes' | 'Maybe'
}
export const StatusTag = (props: TStatusTagProps) => {
  const { type } = props

  const colorMap: Record<string, { color: string; icon: ReactElement; title: string }> = {
    No: {
      color: 'red',
      icon: <WarningOutlined />,
      title: 'No'
    },
    Yes: { color: 'green', icon: <CheckCircleOutlined />, title: 'Yes' },
    Maybe: { color: 'yellowVibrant', icon: <QuestionCircleOutlined />, title: 'Pending' },
  }

  const value = colorMap[type] || colorMap['Maybe']
  return <TagStyled icon={value.icon} title={value.title} color={value.color} bordered={false} />
}

const TagStyled = styled(Tag)`
  border-radius: 50px;
`
