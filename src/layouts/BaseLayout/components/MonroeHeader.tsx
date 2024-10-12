import { UserOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Avatar, Dropdown, Flex, MenuProps, Space } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useState } from 'react'
import { ReactSVG } from 'react-svg'

import { MonroeDarkBlueText, MonroeErrorText } from '@/components/Elements'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useLogout } from '@/hooks/useLogout'

import LogOutIcon from '@/assets/icons/header/logout.svg'
import NotificationIcon from '@/assets/icons/header/notification.svg'
import QuestionCircleIcon from '@/assets/icons/header/question-circle.svg'
import SearchIcon from '@/assets/icons/header/search.svg'
import SubMenuIcon from '@/assets/icons/header/sub-menu.svg'
import UserIcon from '@/assets/icons/header/user.svg'
import LogotypeIcon from '@/assets/icons/logotype.svg'

const StyledHeader = styled(Header)`
  height: 55px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f0ff;
  padding: 0 16px;
  width: 100vw;
`

const StyledSpace = styled(Space)<{ is_rotated: string }>`
  transform: ${(props) => (props.is_rotated === 'true' ? 'rotate(180deg)' : 'none')};
  transition: all 0.3s lineal 0.5s;
`

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
          <MonroeDarkBlueText>Profile</MonroeDarkBlueText>
        </Space>
      ),
    },
    {
      key: 'log-out',
      label: (
        <Space onClick={onLogOut}>
          <ReactSVG src={LogOutIcon} />
          <MonroeErrorText>Log out</MonroeErrorText>
        </Space>
      ),
    },
  ]

  return (
    <StyledHeader>
      <Flex className="w-256" justify="center">
        <ReactSVG src={LogotypeIcon} />
      </Flex>

      <Flex align="center">
        <Flex>
          <ReactSVG className="header-icon" src={SearchIcon} />
        </Flex>

        <Flex>
          <ReactSVG className="header-icon" src={QuestionCircleIcon} />
        </Flex>

        <Flex>
          <ReactSVG className="header-icon" src={NotificationIcon} />
        </Flex>

        <Flex className="mg-l12" align="center">
          <Avatar src={user?.photoS3Url} alt="avatar" size={32} icon={<UserOutlined />} />

          <Dropdown menu={{ items: DROPDOWN_MENU_ITEMS }} placement="bottomRight">
            <StyledSpace
              onMouseMove={() => setIsRotateIcon(true)}
              onMouseLeave={() => setIsRotateIcon(false)}
              is_rotated={`${isRotateIcon}`}
            >
              <ReactSVG className="svg-wrapper" src={SubMenuIcon} />
            </StyledSpace>
          </Dropdown>
        </Flex>
      </Flex>
    </StyledHeader>
  )
}

export default MonroeHeader
