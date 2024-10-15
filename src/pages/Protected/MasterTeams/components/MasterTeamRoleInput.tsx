import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import styled from '@emotion/styled'
import { Flex, Spin } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { ChangeEvent, FC, RefObject, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { SearchLeagueInput, SearchSelectIconWrapper } from '@/components/Elements'
import { Subtext } from '@/components/Elements/entity'

import { useLazyGetUsersQuery } from '@/redux/user/user.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IFEUser } from '@/common/interfaces/user'

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
  background-color: white;
  height: auto;
  max-height: 240px;
  width: 100%;
  box-shadow:
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding-right: 4px;
  z-index: 20;
  overflow: scroll;
`

const Container = styled.div`
  position: relative;
`

interface IMasterTeamRoleInputProps {
  handleClick: (data: IFEUser) => void
  selectedName: undefined | string
  isError: boolean
  handleBlur: () => void
}

const MasterTeamRoleInput: FC<IMasterTeamRoleInputProps> = ({ handleClick, handleBlur, selectedName, isError }) => {
  const [value, setValue] = useState(selectedName || '')
  const { isComponentVisible, ref, onClose } = useIsActiveComponent(false)
  const [offset, setOffset] = useState(0)
  const [getUsers, { data }] = useLazyGetUsersQuery()
  const [users, setUsers] = useState<IFEUser[]>([])
  const userOptions: DefaultOptionType[] = users.map((user) => ({
    label: user.firstName + ' ' + user.lastName,
    value: user.id,
  }))
  const [isLoading, setIsLoading] = useState(false)

  const getData = async () => {
    if (data && data?.count > users.length) {
      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)
      setIsLoading(true)

      const response = await getUsers({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        first_name: value === selectedName ? '' : value,
      }).unwrap()

      if (response?.data) setUsers((prev) => [...prev, ...response.data])
      setIsLoading(false)
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  useEffect(() => {
    if (selectedName && !value) setValue(selectedName)
  }, [selectedName])

  useEffect(() => {
    if (!isComponentVisible && selectedName) setValue(selectedName)
  }, [isComponentVisible])

  const handleChange = async (leagueName: string) => setValue(leagueName)

  const getDataWithNewName = async () => {
    setIsLoading(true)
    const response = await getUsers({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      first_name: value === selectedName ? '' : value,
    }).unwrap()

    setUsers(() => response.data)

    if (users.length) {
      setOffset(0)
    } else {
      setOffset(20)
    }
    setIsLoading(false)
  }

  useDebounceEffect(getDataWithNewName, [value])

  return (
    <Flex vertical className="w-full">
      <div ref={ref} className="w-full">
        <Container>
          <SearchLeagueInput
            name="search"
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
            value={value}
            placeholder="Select user"
            is_error={`${isError}`}
            onBlur={handleBlur}
            className="h-32"
          />

          <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
            <ReactSVG src={ShowAllIcon} />
          </SearchSelectIconWrapper>
        </Container>

        {isComponentVisible && (
          <Container className="ph-5-v-12">
            {userOptions.length ? (
              <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
                {userOptions.map((user) => (
                  <ListItem
                    key={user.value}
                    onClick={() => {
                      const selectedUser = users.find((u) => u.id === user.value)

                      if (selectedUser) {
                        handleClick(selectedUser)
                      }
                      onClose()
                    }}
                  >
                    {user.label}
                  </ListItem>
                ))}

                <Flex justify="center">
                  {isLoading && userOptions.length && (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            color: 'rgba(26, 22, 87, 0.85)',
                          }}
                          spin
                        />
                      }
                    />
                  )}
                </Flex>
              </List>
            ) : (
              <Flex className="p12" justify="center">
                {isLoading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          color: 'rgba(26, 22, 87, 0.85)',
                        }}
                        spin
                      />
                    }
                  />
                ) : (
                  <Subtext>There's no match. Try a different name.</Subtext>
                )}
              </Flex>
            )}
          </Container>
        )}
      </div>
    </Flex>
  )
}

export default MasterTeamRoleInput

