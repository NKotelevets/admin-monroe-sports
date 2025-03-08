import { Formik } from 'formik'
import { useMemo } from 'react'

import { ConfirmUserDataForm } from '@/pages/Account/ConfirmUserData/components/ConfirmUserDataForm.tsx'
import { confirmUserDataSchema } from '@/pages/Account/ConfirmUserData/components/validate.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

export type TConfirmPlayerDataForm = {
  firstName: string
  lastName: string
  dateOfBirth: string
  suffix: string
  email: string
}

const {
  Page,
  Styles: { Title, Subtitle, FormStyled, Body },
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
        <Title>Confirm your data</Title>
        <Subtitle>
          The Admin has added your main profile information. Please review it for accuracy and make any necessary
          changes.
        </Subtitle>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={confirmUserDataSchema}
          onSubmit={handleSave}
        >
          {({ handleSubmit }) => (
            <FormStyled autoComplete="new" onSubmit={handleSubmit}>
              <ConfirmUserDataForm isLoading={false} />
            </FormStyled>
          )}
        </Formik>
      </Body>
    </Page>
  )
}

export default ConfirmPlayerData
