import { OptionTitle } from '@/components/Elements'
import { Button, Flex, Select as SL, Spin } from 'antd'
import { SelectProps } from 'antd/es/select'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { NotFoundContentList } from '@/components/NotFoundContentList.tsx'
import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
export interface IDropdownProps extends SelectProps {
  label: string | ReactElement
  buttonText?: string
  error?: string
  errorPosition?: 'top' | 'bottom'
  isLast?: boolean
  loading?: boolean
  helpText?: string
  debounceSearch?: boolean
  notFoundMessage?: string

  buttonAction?(): void

  onLoadMore?(): void
}

/**
 * Drop in replacement of Ant.D Select component with debounced search
 * @param props
 * @constructor
 */
const Select = (props: IDropdownProps) => {
  const {
    label,
    error,
    isLast,
    loading = false,
    buttonText,
    onLoadMore,
    errorPosition = 'top',
    buttonAction,
    onSearch,
    helpText,
    debounceSearch = true,
    notFoundMessage = `No options available.`,
    ...rest
  } = props

  const [searchValue, setSearchValue] = useState('')

  const fieldStatus = error ? 'error' : undefined

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

  // set search value
  const onSearching = (value: string) => {
    setSearchValue(value)
  }

  // debounce search
  useDebounceEffect(() => {
    !!onSearch && onSearch(searchValue)
  }, [searchValue])

  return (
    <Content vertical isLast={isLast} className='form'>
      <InputWrapper
        label={labelComponent}
        helpText={helpText}
        error={error}
        errorPosition={errorPosition}
      >
        <SelectStyled
          virtual={false} // needed to use custom scroll bars, but might impact performance
          status={fieldStatus}
          onSearch={debounceSearch ? onSearching : onSearch}
          onPopupScroll={handleScroll}
          placeholder="Select master team"
          dropdownRender={renderCustomItems}
          suffixIcon={<div className="ant-menu-submenu-arrow"></div>}
          notFoundContent={(
            <NotFoundContentList
              hidden={loading}
              message={notFoundMessage}
            />
          )}
          {...rest}
        />
      </InputWrapper>
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
const SelectStyled = styled(SL)`
    width: 100%
`

export default Select
