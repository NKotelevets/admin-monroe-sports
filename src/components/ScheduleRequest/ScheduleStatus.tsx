import styled from '@emotion/styled'

export const ScheduleStatus = (props: { availability: number }) => {
  const { availability } = props
  const status = availability <= 0.9 ? 'red' : (availability <= 1.9 ? 'yellow' : 'green')
  const valueMap = {
    red: {
      border: '#FF7E75', bg: '#FFD9D6'
    },
    yellow: {
      border: '#D59B07', bg: '#FFE194'
    },
    green: {
      border: '#1A790B', bg: '#9EE094'
    }
  }

  return (
    <StatusBox bg={valueMap[status].bg} border={valueMap[status].border}>
      {availability}
    </StatusBox>
  )

}

const StatusBox = styled.div<{ bg: string, border: string }>`
    width: 30px;
    height: 30px;
    background-color: ${({ bg }) => bg};
    border: 2px solid ${({ border }) => border};
    border-radius: 2px;
    text-align: center;
    line-height: 26px;
    font-weight: 500;
`
