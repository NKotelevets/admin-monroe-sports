import styled from '@emotion/styled'

export const ScheduleStatus = (props: { availability: 0 | 1 | 2 }) => {
  const { availability } = props
  const valueMap = {
    0: {
      border: '#FF7E75', bg: '#FFD9D6'
    },
    1: {
      border: '#D59B07', bg: '#FFE194'
    },
    2: {
      border: '#1A790B', bg: '#9EE094'
    }
  }

  return (
    <StatusBox bg={valueMap[availability].bg} border={valueMap[availability].border}>
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
