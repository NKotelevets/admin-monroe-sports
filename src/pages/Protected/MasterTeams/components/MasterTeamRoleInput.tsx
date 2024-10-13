import styled from '@emotion/styled'
import { Flex } from 'antd'
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

  const getData = async () => {
    if (data && data?.count > users.length) {
      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)

      const response = await getUsers({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        first_name: value || undefined,
      }).unwrap()

      if (response?.data) setUsers((prev) => [...prev, ...response.data])
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
    const response = await getUsers({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      first_name: value || undefined,
    }).unwrap()

    setUsers(() => response.data)

    if (users.length) {
      setOffset(0)
    } else {
      setOffset(20)
    }
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
            <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
              {userOptions.length ? (
                userOptions.map((user) => (
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
                ))
              ) : (
                <div className="p12">
                  <Subtext>There's no match. Try a different name.</Subtext>
                </div>
              )}
            </List>
          </Container>
        )}
      </div>
    </Flex>
  )
}

export default MasterTeamRoleInput

