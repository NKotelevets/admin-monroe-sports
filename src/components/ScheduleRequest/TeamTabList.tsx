import { Tabs, Tooltip } from 'antd'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import ArrowRightUpIcon from '@/assets/icons/arrow-right-up.svg'
import { useMemo } from 'react'
import { Button } from '@/components/Button.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'
import { ReactSVG } from 'react-svg'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths.ts'

interface IMasterTeamTabListProps {
  data: unknown
  selectedIndex: number

  setSelectedIndex(index: number): void
}

export const TeamTabList = (props: IMasterTeamTabListProps) => {
  const { data, selectedIndex, setSelectedIndex } = props
  const navigate = useNavigate()

  const renderTabWithIcon = (title: string, index: number, id: string) => {
    const onInfoPress = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
      navigate(`${PATH_TO_MASTER_TEAMS}/${id}`)
    }

    return (
      <CustomTab className={`${index === selectedIndex ? 'selected-tab' : ''}`}>
        <TabText className='tab-text'>{title}</TabText>
        <Tooltip title='Remove team from the list'>
          <HoverIcon
            onClick={() => alert('Delete clicked!')}
            className="hover-icon"
            title="Delete this tab"
          >
            <DeleteOutlined />
          </HoverIcon>
        </Tooltip>
        <Tooltip title='Go to team info page'>
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
    data ? Object.keys(data).map((mt, i) => {
      return {
        label: renderTabWithIcon(mt, i,'xxx'),
        key: `${i}`,
        children: ``
      }
    }) : []
  ), [data])

  if (!data) return <></>

  return (
    <Tabs
      defaultActiveKey={`tab-${selectedIndex}`}
      tabBarStyle={{ marginBottom: 0 }}
      tabBarExtraContent={<Button icon={<PlusOutlined />}>Add team</Button>}
      items={tabItems}
      onChange={index => setSelectedIndex(parseInt(index))}
    />
  )
}

// Styled Components
const CustomTab = styled.span`
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
        display: inline-block;
    }

    .ant-tabs-tab-active &:hover .tab-text {
        max-width: calc(80% - 24px);
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

