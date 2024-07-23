import Space from 'antd/es/space'
import Typography from 'antd/es/typography'
import { CSSProperties, FC } from 'react'

const tournTagStyles: CSSProperties = { border: '1px solid #A49EFF', backgroundColor: '#F1F0FF' }

const leagueTagStyles: CSSProperties = { border: '1px solid #FF594D', backgroundColor: '#FFF1F0' }

const TagType: FC<{ text: string }> = ({ text }) => {
  const style = text === 'Tourn' || text === 'Tournament' ? tournTagStyles : leagueTagStyles

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
          color: text === 'Tourn' || text === 'Tournament' ? '#4C41E6' : '#BC261B',
        }}
      >
        {text}
      </Typography.Text>
    </Space>
  )
}

export default TagType
