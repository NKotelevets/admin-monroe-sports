import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import styled from '@emotion/styled'
import { Flex, Spin, Typography } from 'antd'
import Checkbox from 'antd/es/checkbox/Checkbox'
import { ChangeEventHandler, FC, RefObject, useRef, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { MonroeBlueText, SearchSelectIconWrapper } from '@/components/Elements'
import { Subtext } from '@/components/Elements/entity'

import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import useDebounceEffect from '@/hooks/useDebounceEffect'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'
import useScroll from '@/hooks/useScroll'

import { IIdName } from '@/common/interfaces'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams'

import ShowAllIcon from '@/assets/icons/show-all.svg'
import SilverCloseIcon from '@/assets/icons/silver-close.svg'

const Wrapper = styled(Flex)<{ is_error: string }>`
  position: relative;

  border-radius: 2px;
  border: 1px solid #d8d7db;
  border-color: ${(props) => (props.is_error === 'true' ? '#BC261B' : '#d8d7db')};
  background: #fff;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  min-height: 32px;

  padding: 1px 14px 1px 4px;

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
  max-height: 160px;
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
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);

  margin-top: 4px;
`

const SearchInput = styled.input<{ width: string }>`
  border: 0;
  background-color: transparent;
  width: ${(props) => props.width};
  padding: 0;
  margin: 0;
  outline: none;

  z-index: 999;

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

const TagList = styled(Flex)`
  list-style: none;
  flex-wrap: wrap;
`

const DEFAULT_LIMIT_RECORDS = 20

interface IMasterTeamsMultipleSelectWithSearchProps {
  onChange: (value: IIdName[]) => void
  onBlur?: () => void
  isError: boolean
  selectedTeams: IIdName[]
  canRemoveTeam?: boolean
}

const MasterTeamsMultipleSelectWithSearch: FC<IMasterTeamsMultipleSelectWithSearchProps> = ({
  onChange,
  isError,
  onBlur,
  selectedTeams,
  canRemoveTeam = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { isComponentVisible, ref } = useIsActiveComponent(false)
  const inputRef = useRef<HTMLInputElement | null>()
  const [offset, setOffset] = useState(0)
  const [getMasterTeams, { data, isLoading, isFetching }] = useLazyGetMasterTeamsQuery()
  const [masterTeams, setMasterTeams] = useState<IFEMasterTeam[]>([])

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => setSearchTerm(event.target.value)

  const handleOptionToggle = (option: { id: string; name: string }) => {
    const isSelectedTeam = !!selectedTeams.find((item) => item.id === option.id)

    if (isSelectedTeam) {
      const updatedMasterTeams = selectedTeams.filter((item) => item.id !== option.id)

      onChange(updatedMasterTeams)
    } else {
      onChange([...selectedTeams, option])
    }
  }

  const getData = async () => {
    if (data && data?.count > masterTeams.length) {
      setOffset((prev) => prev + DEFAULT_LIMIT_RECORDS)

      const response = await getMasterTeams({
        limit: DEFAULT_LIMIT_RECORDS,
        offset,
        team_name: searchTerm,
      }).unwrap()

      if (response?.results) setMasterTeams((prev) => [...prev, ...response.results])
    }
  }

  const { handleScroll, ref: scrollRef } = useScroll(getData)

  const getDataWithNewName = async () => {
    const res = await getMasterTeams({
      limit: DEFAULT_LIMIT_RECORDS,
      offset: 0,
      team_name: searchTerm,
    }).unwrap()

    setMasterTeams(res?.results || [])
  }

  useDebounceEffect(getDataWithNewName, [searchTerm])

  return (
    <Flex ref={ref} vertical>
      <Wrapper
        align="center"
        onClick={() => {
          inputRef.current?.focus()
        }}
        onBlur={onBlur}
        is_error={`${isError}`}
      >
        <Flex>
          {!isComponentVisible && !selectedTeams.length && <SelectTeamText>Select team</SelectTeamText>}

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

          <TagList>
            {selectedTeams.map((option) => (
              <TeamNameWrapper key={option.id}>
                {option.name}

                {!canRemoveTeam && (
                  <ReactSVG
                    onClick={() => {
                      handleOptionToggle(option)
                    }}
                    src={SilverCloseIcon}
                    className="mg-l4 c-p"
                  />
                )}
              </TeamNameWrapper>
            ))}
          </TagList>
        </Flex>

        <SearchSelectIconWrapper isComponentVisible={isComponentVisible}>
          <ReactSVG src={ShowAllIcon} />
        </SearchSelectIconWrapper>
      </Wrapper>

      {isComponentVisible && (
        <Container>
          {masterTeams.length > 0 ? (
            <List ref={scrollRef as unknown as RefObject<HTMLUListElement>} onScroll={handleScroll}>
              {masterTeams.map((masterTeam) => (
                <ListItem key={masterTeam.id}>
                  <Checkbox
                    className="checkbox"
                    checked={!!selectedTeams.find((sO) => sO.id === masterTeam.id)}
                    onChange={() => handleOptionToggle(masterTeam)}
                  />

                  <MonroeBlueText className="mg-l8">{masterTeam.name}</MonroeBlueText>
                </ListItem>
              ))}

              <Flex justify="center">
                {isFetching && (
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
            <Flex className="ph-5-v-12" justify="center">
              {!isLoading ? (
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
    </Flex>
  )
}

export default MasterTeamsMultipleSelectWithSearch

