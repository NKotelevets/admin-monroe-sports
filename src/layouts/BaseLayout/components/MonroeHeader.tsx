import { UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Flex, MenuProps, Space, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { CSSProperties, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useLogout } from '@/hooks/useLogout'

import LogOutIcon from '@/assets/icons/header/logout.svg'
import NotificationIcon from '@/assets/icons/header/notification.svg'
import QuestionCircleIcon from '@/assets/icons/header/question-circle.svg'
import SearchIcon from '@/assets/icons/header/search.svg'
import SubMenuIcon from '@/assets/icons/header/sub-menu.svg'
import UserIcon from '@/assets/icons/header/user.svg'
import LogotypeIcon from '@/assets/icons/logotype.svg'

const headerStyle: CSSProperties = {
  height: 55,
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid  #F1F0FF',
  padding: '0 16px',
  width: '100vw',
}

const MonroeHeader = () => {
  const { user } = useUserSlice()
  const { onLogOut } = useLogout()
  const [isRotateIcon, setIsRotateIcon] = useState(false)

  const DROPDOWN_MENU_ITEMS: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Space>
          <ReactSVG src={UserIcon} />
          <Typography.Text
            style={{
              color: 'rgba(26, 22, 87, 0.85)',
            }}
          >
            Profile
          </Typography.Text>
        </Space>
      ),
    },
    {
      key: 'log-out',
      label: (
        <Space onClick={onLogOut}>
          <ReactSVG src={LogOutIcon} />
          <Typography.Text
            style={{
              color: '#BC261B',
            }}
          >
            Log out
          </Typography.Text>
        </Space>
      ),
    },
  ]

  return (
    <Header style={headerStyle}>
      <Flex vertical={false} style={{ width: '256px' }} justify="center">
        <ReactSVG src={LogotypeIcon} />
      </Flex>

      <Flex vertical={false} align="center">
        <Flex vertical={false}>
          <ReactSVG className="header-icon" src={SearchIcon} />
        </Flex>

        <Flex vertical={false}>
          <ReactSVG className="header-icon" src={QuestionCircleIcon} />
        </Flex>

        <Flex vertical={false}>
          <ReactSVG className="header-icon" src={NotificationIcon} />
        </Flex>

        <Flex vertical={false} align="center" style={{ marginLeft: '12px' }}>
          <Avatar src={user?.photo_s3_url} alt="avatar" size={32} icon={<UserOutlined />} />

          <Dropdown menu={{ items: DROPDOWN_MENU_ITEMS }} placement="bottomRight">
            <Space
              onMouseMove={() => setIsRotateIcon(true)}
              onMouseLeave={() => setIsRotateIcon(false)}
              style={{
                transform: isRotateIcon ? 'rotate(180deg)' : 'none',
                transition: 'all 0.3s lineal 0.5s',
              }}
            >
              <ReactSVG className="svg-wrapper" src={SubMenuIcon} />
            </Space>
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  )
}

export default MonroeHeader
