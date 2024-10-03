import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import styled from '@emotion/styled'
import { Flex } from 'antd'
import { Button } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { CSSProperties, ChangeEvent, FC, RefObject, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { SearchLeagueInput, SearchSelectIconWrapper } from '@/components/Elements'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useLazyGetOperatorsQuery } from '@/redux/user/user.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const DEFAULT_LIMIT_RECORDS = 20

const ListItem = styled.li<{ is_add_operator?: string }>`
  padding: ${(props) => (props.is_add_operator === 'true' ? '0' : '5px 12px')};
  color: rgba(26, 22, 87, 0.85);
  border-bottom: 0;
  cursor: pointer;
`

const List = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  background-color: white;
  height: auto;
  max-height: 160px;
  width: 100%;
  box-shadow:
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 20;
  overflow: scroll;
  padding: 0 4px;
`

const Container = styled.div`
  position: relative;
`

const defaultPadding: CSSProperties = {
  padding: '5px 12px',
}

const AddOperatorButton = styled(Button)`
  border: none;
  background: transparent;
  font-size: 14px;
  color: #3e34ca;
  box-shadow: none;

  &:hover {
    background: transparent !important;
    color: #3e34ca !important;
  }
`

interface IOperatorsInputProps {
  setOperator: (data: [{ id: string; name: string }]) => void
  selectedOperator: { id: string; name: string }
  isError: boolean
  handleBlur?: () => void
  isHideAddOperatorBtn?: boolean
  isDisabled?: boolean
}

const OperatorsInput: FC<IOperatorsInputProps> = ({
  setOperator,
  handleBlur,
  selectedOperator,
  isError,
  isHideAddOperatorBtn = false,
  isDisabled = false,
}) => {
  const [value, setValue] = useState(selectedOperator.name || '')
  const { isComponentVisible, ref, onClose } = useIsActiveComponent(false)
  const [offset, setOffset] = useState(0)
  const [getOperators, { data }] = useLazyGetOperatorsQuery()
  const { setIsCreateOperatorScreen } = useUserSlice()
  const ADD_OPERATOR_PROPERTY: DefaultOptionType = {
    label: (
      <Flex style={{ borderBottom: '1px solid rgba(189, 188, 194, 1)', margin: '4px 0 0 0 ' }}>
        <AddOperatorButton
          type="default"
          icon={<PlusOutlined />}
          iconPosition="start"
          onClick={() => setIsCreateOperatorScreen(true)}
        >
          Add Operator
        </AddOperatorButton>
      </Flex>
    ),
    value: '',
  }
  const [operatorsList, setOperatorsList] = useState<DefaultOptionType[]>(
    isHideAddOperatorBtn ? [ADD_OPERATOR_PROPERTY] : [],
  )

  const getData = async () => {
    if (data && data?.count > operatorsList.length) {
      const response = await getOperators({
        limit: DEFAULT_LIMIT_RECORDS,
        offset: offset + DEFAULT_LIMIT_RECORDS,
        search: value,
      }).unwrap()

      const options: DefaultOptionType[] = response.data.map((operator) => ({
        label: operator.name,
        value: operator.id,
      }))

      if (response?.data) setOperatorsList((prev) => [...prev, ...options])

      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const response = await getOperators({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
      }).unwrap()

      const options: DefaultOptionType[] = response.data.map((operator) => ({
        label: operator.name,
        value: operator.id,
      }))

      if (isHideAddOperatorBtn) {
        setOperatorsList(options)
      } else {
        setOperatorsList(() => [ADD_OPERATOR_PROPERTY, ...options])
      }
    })()
  }, [])

  useEffect(() => {
    if (selectedOperator && !value) setValue(selectedOperator.name)
  }, [selectedOperator])

  const handleChange = async (operatorName: string) => setValue(operatorName)

  const getDataWithNewName = async () => {
    const response = await getOperators({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      search: value === selectedOperator.name ? '' : value,
    }).unwrap()

    const options: DefaultOptionType[] = response.data.map((operator) => ({
      label: operator.name,
      value: operator.id,
    }))

    if (isHideAddOperatorBtn) {
      setOperatorsList(options)
    } else {
      setOperatorsList(() => [ADD_OPERATOR_PROPERTY, ...options])
    }
  }

  useDebounceEffect(getDataWithNewName, [value])

  useEffect(() => {
    if (!isComponentVisible && selectedOperator) setValue(selectedOperator.name)
  }, [isComponentVisible])

  return (
    <Flex vertical style={{ width: '100%' }}>
      <div ref={ref} style={{ width: '100%' }}>
        <Container>
          <SearchLeagueInput
            name="search"
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
            value={value}
            placeholder="Select operator"
            style={{ height: '32px' }}
            is_error={`${isError}`}
            onBlur={handleBlur}
            disabled={isDisabled}
          />

          <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
            <ReactSVG src={ShowAllIcon} />
          </SearchSelectIconWrapper>
        </Container>

        {isComponentVisible && (
          <Container style={defaultPadding}>
            {operatorsList.length && (
              <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
                {operatorsList.map((operator, idx) => (
                  <ListItem
                    is_add_operator={`${!isHideAddOperatorBtn && idx === 0 ? 'true' : 'false'}`}
                    key={operator.value}
                    onClick={() => {
                      setOperator([
                        {
                          id: operator.value as string,
                          name: operator.label as string,
                        },
                      ])
                      onClose()
                    }}
                  >
                    {operator.label}
                  </ListItem>
                ))}
              </List>
            )}
          </Container>
        )}
      </div>
    </Flex>
  )
}

export default OperatorsInput

