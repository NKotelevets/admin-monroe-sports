import Btn, { ButtonProps } from 'antd/es/button/button'
import styled from '@emotion/styled'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { colors } from '@/utils/colors.tsx'

/**
 * Extended Ant.Design button with different loading animation
 * @param props
 * @constructor
 */
export const Button = (props: ButtonProps & { spinnerColor?: string }) => {
  const {
    loading,
    spinnerColor,
    children,
    ...rest
  } = props

  return (
    <MButton {...rest}>
      <Opacity hide={!!loading}>
        {children}
      </Opacity>
      <Loading
        size="small"
        hide={!loading}
        indicator={<Spinner color={spinnerColor || colors.primary} spin />}
      />
    </MButton>
  )
}

const MButton = styled(Btn)`
    font-size: 14px;
    display: flex;
    flex: 1
`
const Spinner = styled(LoadingOutlined)<{ color?: string | undefined }>`
    position: absolute;
    color: ${({ color }) => color ? color : 'white'};
    transition: opacity ease-in-out .1s;
`
const Opacity = styled.div<{ hide: boolean }>`
    opacity: ${({ hide }) => hide ? 0 : 1};
    transition: opacity ease-in-out .1s;
`
const Loading = styled(Spin)<{ hide: boolean }>`
    position: absolute;
    opacity: ${({ hide }) => hide ? 0 : 1};
    transition: opacity ease-in-out .1s;
`
