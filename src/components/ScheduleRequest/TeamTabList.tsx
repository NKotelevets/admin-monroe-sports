import { Tabs, Tooltip } from 'antd'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import ArrowRightUpIcon from '@/assets/icons/arrow-right-up.svg'
import { ReactElement, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import { ReactSVG } from 'react-svg'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'

import { IScheduleRequest } from '@/common/interfaces'

interface IMasterTeamTabListProps {
  data: IScheduleRequest[]
  extraContent?: ReactElement
}

/**
 * `TeamTabList` component renders a tabbed interface to display teams with the option to remove a team or navigate to
 * the team details page.
 *
 * This component uses the `Tabs` from Ant Design and integrates with the `ScheduleContext` to manage selected teams
 * and their states. Each tab represents a team, with features to:
 * - Display the team name in the tab.
 * - Allow the removal of a team from the list.
 * - Navigate to the team information page when clicked.
 *
 * It's also possible to optionally include extra content in the tab bar via `extraContent`.
 *
 * @param {IMasterTeamTabListProps} props - The component's props.
 * @param {IScheduleRequest[]} props.data - Array of schedule request data representing the teams.
 * @param {ReactElement} [props.extraContent] - Optional extra content to display in the tab bar.
 *
 * @returns {ReactElement} The rendered `Tabs` component with each tab representing a team.
 *
 * @example
 * <TeamTabList
 *   data={scheduleRequests}
 *   extraContent={<SomeExtraContent />}
 * />
 */
export const TeamTabList = (props: IMasterTeamTabListProps): ReactElement => {
  const { data, extraContent } = props
  const {
    selectedTabIndex,
    selectedIds,
    setSelectedIds,
    pathToNavigate,
    dates,
    setSelectedTabIndex,
  } = useContext(ScheduleContext)
  const navigate = useNavigate()

  /**
   * Removes a team from the selected list by its index.
   *
   * @param {number} index - The index of the team to remove.
   */
  const removeTeamByIndex = (index: number): void => {
    const newIds = selectedIds?.filter((id) => id !== data[index].teamId)
    setSelectedIds(newIds || null)
    navigate(`${pathToNavigate}/${dates?.start},${dates?.end}/${newIds?.join(',')}`)
  }

  /**
   * Renders a tab with the team name and icons for removing the team or navigating to the team details.
   *
   * @param {string} title - The team name to display in the tab.
   * @param {number} index - The index of the tab.
   * @param {string} id - The ID of the team used for navigation.
   *
   * @returns {JSX.Element} The rendered tab with icons for actions.
   */
  const renderTabWithIcon = (title: string, index: number, id: string) => {
    const selectedClassName = index === selectedTabIndex ? 'selected-tab' : ''
    const canDelete = selectedIds && selectedIds?.length > 1 || false

    const onInfoPress = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
      navigate(`${PATH_TO_MASTER_TEAMS}/${id}`)
    }

    return (
      <CustomTab
        className={selectedClassName}
        canDelete={canDelete}
      >
        <TabText className="tab-text">{title}</TabText>
        <Tooltip title="Remove team from the list">
          <HoverIcon
            onClick={() => removeTeamByIndex(index)}
            className="hover-icon"
            title="Delete this tab"
          >
            <DeleteOutlined />
          </HoverIcon>
        </Tooltip>
        <Tooltip title="Go to team info page">
          <StaticIcon onClick={onInfoPress}>
            <ArrowRightUpWrapper>
              <ReactSVG src={ArrowRightUpIcon} />
            </ArrowRightUpWrapper>
          </StaticIcon>
        </Tooltip>
      </CustomTab>
    )
  }

  const tabItems = useMemo(() => (
    data.map((sr, i) => {
      return {
        label: renderTabWithIcon(sr.teamName, i, sr.teamId),
        key: `${i}`,
        children: ``
      }
    })
  ), [data])

  if (!data.length) return <></>

  return (
    <TabStyled
      items={tabItems}
      more={{ visible: false, icon: '' }}
      tabBarStyle={{ marginBottom: 0 }}
      tabBarExtraContent={extraContent}
      defaultActiveKey={`tab-${selectedTabIndex}`}
      onChange={index => setSelectedTabIndex(parseInt(index))}
    />
  )
}

// Styled Components
const TabStyled = styled(Tabs)`
    & .ant-tabs-nav-more {
        padding: 0 24px 0 0;
    }
`
const CustomTab = styled.span<{ canDelete: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    max-width: 200px; /* Adjust to fit your tab width */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;

    .ant-tabs-tab-active &:hover .hover-icon {
        display: ${({ canDelete }) => canDelete ? 'inline-block' : 'none'};
    }

    .ant-tabs-tab-active &:hover .tab-text {
        max-width: ${({ canDelete }) => canDelete ? 'calc(80% - 24px)' : 'auto'};
        overflow: hidden;
    }
`
const TabText = styled.span`
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`
const StaticIcon = styled.span`
    color: ${colors.secondaryText}; /* Link icon color */
    margin-left: 8px;
    flex-shrink: 0;
`
const ArrowRightUpWrapper = styled.div`
    svg {
        fill: ${colors.secondary};
        width: 15px;
        height: 15px;
    }
`
const HoverIcon = styled.span`
    position: absolute;
    right: 18px;
    color: ${colors.primary};
    display: none;
    cursor: pointer;

    &:hover {
        color: ${colors.primary}
    }
`
