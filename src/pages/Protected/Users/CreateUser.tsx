import { Helmet } from 'react-helmet'

import CreateOperator from '@/pages/Protected/Users/components/CreateOperator'
import UserForm from '@/pages/Protected/Users/components/UserForm'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

const CreateUser = () => {
  const { isCreateOperatorScreen } = useUserSlice()

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Create User</title>
        </Helmet>

        {isCreateOperatorScreen && <CreateOperator />}

        {!isCreateOperatorScreen && <UserForm />}
      </>
    </BaseLayout>
  )
}

export default CreateUser

