import { ScheduleOutlined } from '@ant-design/icons'
import Btn from 'antd/es/button/button'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'

export const ExportAvailabilityButton = () => {

  return (
    <Dropdown
      dropdownRender={(originNode) => <View>{originNode}</View>}
      trigger={['click']}
      placement='bottomRight'
      overlayClassName='dropdown'
    >
      <Button icon={<ScheduleOutlined />} iconPosition="start">
        Export Availability
      </Button>
    </Dropdown>
  )
}

const Button = styled(Btn)`
  margin-right: 8px
`
const View = styled.div`
    width: 400px;
    height: 200px
`
