import { IEvent } from '@/common/interfaces/event.ts'
import { Flex } from 'antd'
import { ReactSVG } from 'react-svg'
import yesIcon from '@/assets/icons/rsvp/yes.svg'
import noIcon from '@/assets/icons/rsvp/no.svg'
import maybeIcon from '@/assets/icons/rsvp/maybe.svg'
import styled from '@emotion/styled'

type TRSVPStatusProps = {
  rsvp: IEvent['rsvpAnswers']
}

export const RSVPStatus = (props: TRSVPStatusProps) => {
  const { rsvp } = props

  return (
    <Box align="center" justify="space-between">
      <Flex align="center">{rsvp.going} <ReactSVG style={svgStyle} src={yesIcon} /></Flex>
      <Flex align="center">{rsvp.notGoing} <ReactSVG style={svgStyle} src={noIcon} /></Flex>
      <Flex align="center">{rsvp.maybe} <ReactSVG style={svgStyle} src={maybeIcon} /></Flex>
    </Box>
  )
}

// Styled Components
const svgStyle = {
  width: 12,
  marginLeft: 2
}
const Box = styled(Flex)`
    padding: 0 4px
`
