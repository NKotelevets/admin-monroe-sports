import { Formik } from 'formik'
import { useMemo } from 'react'

import { confirmUserDataSchema } from '@/pages/Account/ConfirmUserData/components/validate.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'
import { ConfirmPlayerDataForm } from '@/pages/Account/ConfirmPlayerData/components/ConfirmPlayerDataForm.tsx'

export type TConfirmPlayerDataForm = {
  firstName: string
  lastName: string
  dateOfBirth: string
  suffix: string
  email: string
}

const {
  Page,
  Styles: { Title, FormStyled, Body },
} = Layout

const ConfirmPlayerData = () => {
  const { user, setChildData } = useAccountSlice()

  const { nextStep } = useInvitation()

  const initialValues: TConfirmPlayerDataForm = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      suffix: '',
      email: '',
    }),
    [user],
  )

  const handleSave = (values: TConfirmPlayerDataForm) => {
    setChildData(values)
    nextStep()
  }

  return (
    <Page>
      <Body>
        <Title>Add player info</Title>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={confirmUserDataSchema}
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
