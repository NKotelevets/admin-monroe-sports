import styled from '@emotion/styled'

interface NotFoundContentList {
  message: string
  hidden: boolean
}
export const NotFoundContentList = (props: NotFoundContentList) => {
  const {message, hidden} = props

  if (hidden) {
    return <></>
  }

  return <Text>{message}</Text>
}

const Text = styled.div`
    padding: 8px
`
