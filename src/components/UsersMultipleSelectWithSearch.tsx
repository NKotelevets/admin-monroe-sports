import { MonroeBlueText, SearchSelectIconWrapper } from './Elements'
import { Subtext } from './Elements/entity'
import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import Checkbox from 'antd/es/checkbox/Checkbox'
import { CSSProperties, ChangeEventHandler, FC, RefObject, useRef, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { useLazyGetUsersQuery } from '@/redux/user/user.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IExtendedFEUser } from '@/common/interfaces/user'

import ShowAllIcon from '@/assets/icons/show-all.svg'
import SilverCloseIcon from '@/assets/icons/silver-close.svg'

const PageContainer = styled(Flex)`
  flex-direction: column;

  width: 352px;

  @media (width > 1660px) {
    width: 600px;
  }
`

const Wrapper = styled(Flex)<{ is_error: string }>`
  position: relative;

  border-radius: 2px;
  border: 1px solid #d8d7db;
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};
  background: #fff;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  min-height: 32px;

  padding: 1px 4px;

  @media (width > 1660px) {
    min-height: 40px;
  }
`

const ListItem = styled.li`
  padding: 5px 12px;
  color: rgba(26, 22, 87, 0.85);
  border-bottom: 0;
  cursor: pointer;

  display: flex;
`

const List = styled.ul`
  position: absolute;
  left: 0;
  background-color: white;
  height: auto;
  max-height: 120px;
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

  margin-top: 4px;
`

const defaultPadding: CSSProperties = {
  padding: '5px 12px',
}

const SearchInput = styled.input<{ width: string }>`
  border: 0;
  background-color: transparent;
  width: ${(props) => props.width};
  padding: 0;
  margin: 0;
  outline: none;

  &:focus,
  &:hover,
  &:active {
    border: 0;
    background-color: transparent;
    box-shadow: none;
  }

  @media (width > 1660px) {
    font-size: 16px;
  }
`

const TeamNameWrapper = styled.li`
  border-radius: 2px;
  border: 1px solid #d8d7db;
  background: #fafafa;

  margin: 2px;

  padding: 0 8px;

  display: flex;
  align-items: center;
`

const SelectTeamText = styled(Typography)`
  color: rgb(189, 188, 194);
  padding: 0 8px;

  @media (width > 1660px) {
    font-size: 16px;
  }
`

const DEFAULT_LIMIT_RECORDS = 20

interface IUsersMultipleSelectWithSearchProps {
  onChange: (value: { id: string; name: string }[]) => void
  onBlur: () => void
  isError: boolean
  selectedUsers: { id: string; name: string }[]
}

const UsersMultipleSelectWithSearch: FC<IUsersMultipleSelectWithSearchProps> = ({
  onChange,
  isError,
  onBlur,
  selectedUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { isComponentVisible, ref } = useIsActiveComponent(false)
  const inputRef = useRef<HTMLInputElement | null>()
  const [offset, setOffset] = useState(0)
  const [getUsers, { data }] = useLazyGetUsersQuery()
  const [users, setUsers] = useState<IExtendedFEUser[]>([])

  const getData = async () => {
    if (data && data?.count > users.length) {
      const response = await getUsers({
        limit: DEFAULT_LIMIT_RECORDS,
        offset: offset + DEFAULT_LIMIT_RECORDS,
        first_name: searchTerm || undefined,
      }).unwrap()

      setUsers((prev) => [...prev, ...response.data])

      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  const getDataWithNewName = async () => {
    const response = await getUsers({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      first_name: searchTerm || undefined,
    }).unwrap()

    setUsers(() => response.data)

    if (users.length) {
      setOffset(0)
    } else {
      setOffset(20)
    }
  }

  useDebounceEffect(getDataWithNewName, [searchTerm])

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => setSearchTerm(event.target.value)

  const handleOptionToggle = (option: { id: string; name: string }) => {
    const isSelectedTeam = !!selectedUsers.find((item) => item.id === option.id)

    if (isSelectedTeam) {
      const updatedMasterTeams = selectedUsers.filter((item) => item.id !== option.id)

      onChange(updatedMasterTeams)
    } else {
      onChange([...selectedUsers, option])
    }
  }

  // useEffect(() => {
  //   const getData = async () => {
  //     const response = await getUsers({
  //       limit: DEFAULT_LIMIT_RECORDS,
  //       offset,
  //     }).unwrap()

  //     setUsers(response.data)
  //   }

  //   getData()
  // }, [])

  return (
    <PageContainer ref={ref}>
      <Wrapper
        align="center"
        onClick={() => {
          inputRef.current?.focus()
        }}
        onBlur={onBlur}
        is_error={`${isError}`}
      >
        <Flex>
          {!isComponentVisible && !selectedUsers.length && <SelectTeamText>Select users</SelectTeamText>}

          {isComponentVisible && (
            <SearchInput
              width={`calc(${searchTerm.length * 8}px + 3px)`}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              ref={(ref) => {
                inputRef.current = ref
              }}
            />
          )}

          <Flex
            style={{
              listStyle: 'none',
              flexWrap: 'wrap',
            }}
          >
            {selectedUsers.map((option) => (
              <TeamNameWrapper key={option.id}>
                {option.name}

                <ReactSVG
                  onClick={() => {
                    handleOptionToggle(option)
                  }}
                  src={SilverCloseIcon}
                  className="mg-l4 c-p"
                />
              </TeamNameWrapper>
            ))}
          </Flex>
        </Flex>

        <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
          <ReactSVG src={ShowAllIcon} />
        </SearchSelectIconWrapper>
      </Wrapper>

      {isComponentVisible && (
        <Container>
          {users.length > 0 ? (
            <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
              {users.map((user) => (
                <ListItem key={user.id}>
                  <Checkbox
                    className="checkbox"
                    checked={!!selectedUsers.find((sO) => sO.id === user.id)}
                    onChange={() =>
                      handleOptionToggle({
                        id: user.id,
                        name: user.firstName + ' ' + user.lastName,
                      })
                    }
                  />

                  <MonroeBlueText className="mg-l8">{user.firstName + ' ' + user.lastName}</MonroeBlueText>
                </ListItem>
              ))}
            </List>
          ) : (
            <List as="div" style={defaultPadding}>
              <Subtext>There's no match. Try a different name.</Subtext>
            </List>
          )}
        </Container>
      )}
    </PageContainer>
  )
}

export default UsersMultipleSelectWithSearch

