import styled from '@emotion/styled'
import { Button, Spin } from 'antd'
import { FC, ReactElement, ReactNode } from 'react'
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'

interface IMonroeButtonProps {
  label: string
  isDisabled?: boolean
  isLoading?: boolean
  spinnerColor?: string
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: ReactNode
  iconPosition?: 'start' | 'end' | undefined
}

/**
 * `MonroeButton` is the default button component with optional loading, icon features and customizable.
 *
 * @component
 *
 * @param {IMonroeButtonProps} props - The props for the `MonroeButton` component.
 * @param {string} props.label - The text displayed on the button.
 * @param {boolean} [props.isDisabled=false] - If `true`, the button is disabled.
 * @param {boolean} [props.isLoading=false] - If `true`, a loading spinner is shown, hiding the label.
 * @param {string} [props.spinnerColor] - Defines the color of the loading spinner if `isLoading` is `true`.
 * @param {'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined} props.type - Specifies the visual style of the button.
 * @param {() => void} [props.onClick] - Function to execute on button click.
 * @param {'button' | 'submit' | 'reset'} [props.htmlType='button'] - The HTML button type attribute.
 * @param {string} [props.className] - Additional CSS class names to apply to the button.
 * @param {ReactNode} [props.icon] - Optional icon displayed alongside the button label.
 * @param {'start' | 'end' | undefined} [props.iconPosition] - Position of the icon relative to the label, either `start` or `end`.
 *
 * @returns {ReactElement} Rendered `MonroeButton` component.
 *
 * @example
 * <MonroeButton
 *   label="Submit"
 *   type="primary"
 *   isLoading={true}
 *   spinnerColor="blue"
 *   onClick={() => console.log('Button clicked')}
 * />
 */
const MonroeButton: FC<IMonroeButtonProps> = (props: IMonroeButtonProps): ReactElement => {
  const {
    isDisabled = false,
    isLoading = false,
    label,
    htmlType = 'button',
    spinnerColor,
    ...rest
  } = props

  return (
    <StyledMonroeButton disabled={isDisabled} htmlType={htmlType} {...rest}>
      <Opacity hide={isLoading}>{label}</Opacity>
      <Loading
        size="small"
        hide={!isLoading}
        indicator={<Spinner color={spinnerColor} spin />}
      />
    </StyledMonroeButton>
  )
}

const StyledMonroeButton = styled(Button)`
    border: 0;
    width: 100%;
    font-size: 16px;
    position: relative;
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
const Spinner = styled(LoadingOutlined)<{ color?: string | undefined }>`
    position: absolute;
    color: ${({ color }) => color ? color : 'white'};
    transition: opacity ease-in-out .1s;
`

export default MonroeButton
