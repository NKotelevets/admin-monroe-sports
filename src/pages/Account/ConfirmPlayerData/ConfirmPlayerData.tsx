import { Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import { ConfirmPlayerDataForm } from '@/pages/Account/ConfirmPlayerData/components/ConfirmPlayerDataForm.tsx'
import { confirmPlayerDataSchema } from '@/pages/Account/ConfirmPlayerData/components/validate.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'
import { notification } from 'antd'

export type TConfirmPlayerDataForm = {
  firstName: string
  lastName: string
  birthDate: string
  suffix: string
  email: string
}

const {
  Page,
  Styles: { Title, FormStyled, Body },
} = Layout

const ConfirmPlayerData = () => {
  const { user, setChildData, childData } = useAccountSlice()
  const { acceptInvitation, errorMessage, hasErrors } = useInvitation()

  const [ready, setReady] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  const initialValues: TConfirmPlayerDataForm = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      birthDate: '',
      suffix: '',
      email: '',
    }),
    [user],
  )

  useEffect(() => {
    if (childData) {
      setReady(true)
    }
  }, [childData])

  useEffect(() => {
    if (ready) {
      acceptInvitation()
    }
  }, [ready])

  useEffect(() => {
    if (hasErrors) {
      api.error({
        message: 'Something went wrong',
        description: errorMessage,
        placement: 'bottomRight',
      })
    }
  }, [hasErrors, errorMessage])

  const handleSave = (values: TConfirmPlayerDataForm) => {
    setChildData(values)
  }



  return (
    <Page>
      <Body>
        {contextHolder}
        <Title>Add player info</Title>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={confirmPlayerDataSchema}
          onSubmit={handleSave}
        >
          {({ handleSubmit }) => (
            <FormStyled autoComplete="new" onSubmit={handleSubmit}>
              <ConfirmPlayerDataForm isLoading={false} />
            </FormStyled>
          )}
        </Formik>
      </Body>
    </Page>
  )
}

export default ConfirmPlayerData
