import styled from '@emotion/styled'
import { Flex } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { CSSProperties, ChangeEvent, FC, RefObject, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { SearchLeagueInput, SearchSelectIconWrapper } from '@/components/Elements'

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

const defaultPadding: CSSProperties = {
  padding: '5px 12px',
}

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
  const [getLeagues, { data }] = useLazyGetUsersQuery()
  const [users, setUsers] = useState<IFEUser[]>([])
  const userOptions: DefaultOptionType[] = users.map((user) => ({
    label: user.firstName + ' ' + user.lastName,
    value: user.id,
  }))

  const getData = async () => {
    if (data && data?.count > users.length) {
      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)

      const response = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        // filter by user
      }).unwrap()

      if (response?.data) setUsers((prev) => [...prev, ...response.data])
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getLeagues({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
      }).unwrap()

      if (response?.data) setUsers((prev) => [...prev, ...response.data])
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedName && !value) setValue(selectedName)
  }, [selectedName])

  useEffect(() => {
    if (!isComponentVisible && selectedName) setValue(selectedName)
  }, [isComponentVisible])

  const handleChange = async (leagueName: string) => setValue(leagueName)

  const getDataWithNewName = async () => {
    const response = await getLeagues({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
    }).unwrap()

    setUsers((prev) => [...prev, ...response.data])
  }

  useDebounceEffect(getDataWithNewName, [value])

  return (
    <Flex vertical style={{ width: '100%' }}>
      <div ref={ref} style={{ width: '100%' }}>
        <Container>
          <SearchLeagueInput
            name="search"
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
            value={value}
            placeholder="Select user"
            style={{ height: '32px' }}
            is_error={`${isError}`}
            onBlur={handleBlur}
          />

          <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
            <ReactSVG src={ShowAllIcon} />
          </SearchSelectIconWrapper>
        </Container>

        {isComponentVisible && (
          <Container style={defaultPadding}>
            {users.length && (
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
              </List>
            )}
          </Container>
        )}
      </div>
    </Flex>
  )
}

export default MasterTeamRoleInput

