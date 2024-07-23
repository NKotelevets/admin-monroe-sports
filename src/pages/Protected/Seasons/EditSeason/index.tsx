import { Typography } from 'antd'
import { Helmet } from 'react-helmet'

import BaseLayout from '@/layouts/BaseLayout'

const EditSeason = () => {
  return (
    <>
      <Helmet>Admin Panel | Edit Season</Helmet>

      <BaseLayout>
        <Typography>Edit season page</Typography>
      </BaseLayout>
    </>
  )
}

export default EditSeason

