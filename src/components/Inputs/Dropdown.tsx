import { OptionTitle } from '@/components/Elements'
import { Button, Flex, Select, Spin } from 'antd'
import { SelectProps } from 'antd/es/select'
import { ReactElement, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { InputError } from '@/components/Inputs/InputElements.tsx'
import { colors } from '@/utils/colors.tsx'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
interface IDropdownProps extends SelectProps {
  label: string | ReactElement
  buttonText?: string
  error?: string
  errorPosition?: 'top' | 'bottom'
  isLast?: boolean
  loading?: boolean,

  buttonAction?(): void

  onLoadMore?(): void
}

const Dropdown = (props: IDropdownProps) => {
  const {
    label,
    error,
    isLast,
    loading = false,
    buttonText,
    onLoadMore,
    errorPosition = 'top',
    buttonAction,
    ...rest
  } = props

  const fieldStatus = error ? 'error' : undefined
  const errorOnTop = errorPosition === 'top'

  // label
  const labelComponent = useMemo(() => (
    typeof label === 'string' ? <OptionTitle>{label}</OptionTitle> : label
  ), [label])

  // render items with custom button and loading indicator
  const renderCustomItems = useCallback((menu: ReactElement): ReactElement => (
    <>
      {!!buttonText && !!buttonAction && (
        <ButtonWrapper>
          <ButtonItem type="text" onClick={buttonAction}>
            <Plus /> {buttonText}
          </ButtonItem>
        </ButtonWrapper>
      )}
      {menu}
      {loading && <Loading size="small" indicator={<LoadingOutlined />} />}
    </>
  ), [buttonText, loading])

  // option for handling infinite scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    if (target.scrollTop + target.clientHeight >= target.scrollHeight && !loading) {
      !!onLoadMore && onLoadMore()
    }
  }, [onLoadMore, loading])

  return (
    <Content vertical isLast={isLast}>
      <Flex vertical={false} justify="space-between" align="center">
        {labelComponent}
        {error && errorOnTop && <InputError>{error}</InputError>}
      </Flex>

      <SelectStyled
        status={fieldStatus}
        virtual={false} // needed to use custom scroll bars, but might impact performance
        onPopupScroll={handleScroll}
        placeholder="Select master team"
        suffixIcon={<div className="ant-menu-submenu-arrow"></div>}
        dropdownRender={renderCustomItems}
        {...rest}
      />

      {error && !errorOnTop && <InputError>{error}</InputError>}
    </Content>
  )
}

const Content = styled(Flex)<{ isLast?: boolean }>`
    width: 100%;
    padding-bottom: ${({ isLast }) => isLast === true ? 0 : 12}px;
`
const ButtonWrapper = styled(Flex)`
    border-bottom: 1px solid ${colors.dimLight};
    margin-bottom: 4px;
    padding: 2px 0;
`
const ButtonItem = styled(Button)`
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    color: ${colors.secondaryText};
    padding: 4px 12px;
    &:hover {
        background-color: transparent !important;
    }
    &:hover > span {
        opacity: 0.8
    }
    &>span {
        color: ${colors.secondary}
    }
`
const Plus = styled(PlusOutlined)`
    position: relative;
    top: 4px;
`
const Loading = styled(Spin)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    color: ${colors.secondary}
`
const SelectStyled = styled(Select)`
    width: 100%
`

export default Dropdown
