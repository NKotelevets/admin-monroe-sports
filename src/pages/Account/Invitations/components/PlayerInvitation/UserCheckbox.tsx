import { UserOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Avatar, Card, Checkbox } from 'antd'

import { colors } from '@/utils/colors.tsx'

type TUserCheckboxProps = {
  id: string
  selected: boolean
  name: string
  avatar: string | null
  onSelect(id: string): void
}

/**
 * UserCheckbox is a functional component that renders a selectable user card.
 *
 * @function UserCheckbox
 * @param {TUserCheckboxProps} props - The properties for the UserCheckbox component.
 * @param {string} props.id - The unique identifier for the user.
 * @param {boolean} props.selected - Whether the user is currently selected.
 * @param {string} props.name - The name of the user.
 * @param {string} props.avatar - The URL of the user's avatar image.
 * @param {function(string): void} props.onSelect - The callback function triggered on selection.
 * @returns {JSX.Element} The rendered UserCheckbox component.
 */
export const UserCheckbox = (props: TUserCheckboxProps) => {
  const { id, selected, name, avatar, onSelect } = props
  const handleClick = () => onSelect(id)

  return (
    <CardBox key={id} selected={selected} onClick={handleClick} bodyStyle={style.cardBody}>
      <Checkbox checked={selected} />
      <UserPhoto src={avatar || ''} icon={<UserOutlined />} size={40} />
      <UserName>{name}</UserName>
    </CardBox>
  )
}

const style = {
  cardBody: { display: 'flex', alignItems: 'center' },
}

// Styled Components
const CardBox = styled(Card)<{ selected: boolean }>`
  border-color: ${({ selected }) => (selected ? colors.primary : '#f0f0f0')};
  margin: 0 auto 10px;
  border-radius: 8px;
  width: 100%;
  text-align: left;

  &.ant-card .ant-card-body {
    padding: 26px 20px !important;
    width: 100%;
    cursor: pointer;
    box-shadow: 0 4px 14px 0 #0000001a;
  }
`
const UserPhoto = styled(Avatar)`
  margin: 0 12px 0 26px;
  min-width: 40px;
  background-color: ${colors.dimLight};
`
const UserName = styled.div`
  font-size: 18px;
  font-weight: 500;
`
