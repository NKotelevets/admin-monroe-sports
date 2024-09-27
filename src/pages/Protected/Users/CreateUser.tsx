import { Helmet } from 'react-helmet'

import UserForm from '@/pages/Protected/Users/components/UserForm'

import BaseLayout from '@/layouts/BaseLayout'

const CreateUser = () => (
  <>
    <Helmet>
      <title>Admin Panel | Create User</title>
    </Helmet>

    <BaseLayout>
      <UserForm />
    </BaseLayout>
  </>
)

export default CreateUser

