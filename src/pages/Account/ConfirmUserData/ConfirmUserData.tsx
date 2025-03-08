import { Formik } from 'formik'
import { ReactElement, useMemo } from 'react'

import { ConfirmUserDataForm } from '@/pages/Account/ConfirmUserData/components/ConfirmUserDataForm.tsx'
import { confirmUserDataSchema } from '@/pages/Account/ConfirmUserData/components/validate.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useAccountSlice } from '@/redux/hooks/useAccountSlice'

import { useInvitation } from '@/hooks/useInvitation.ts'

const {
  Page,
  Styles: { Title, Subtitle, FormStyled, Body },
} = Layout

type TConfirmUserDataProps = {
  inline?: boolean
  onSubmit?: (values: TConfirmUserDataForm) => void
}

export type TConfirmUserDataForm = {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  zipCode: string
  terms: boolean
  type: 'player' | 'guardian' | undefined
}

/**
 * A functional component for confirming user data, allowing users to review
 * and optionally edit profile information entered by the admin before submission.
 *
 * @param {TConfirmUserDataProps} props - The props for the component.
 * @param {boolean} [props.inline=false] - Determines if the page layout should be inline or not.
 * @param {function} props.onSubmit - Callback function triggered when the form is submitted.
 * @returns {ReactElement} The UI for confirming and editing user data.
 */
const ConfirmUserData = (props: TConfirmUserDataProps): ReactElement => {
  const { inline = false, onSubmit } = props
  const { user, setUserData, setConfirmParentData } = useAccountSlice()

  const { nextStep } = useInvitation()

  const initialValues: TConfirmUserDataForm = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dateOfBirth: user?.birthDate || '',
      gender: user?.gender ? user?.gender.toString() : '',
      zipCode: user?.zipCode || '',
      terms: false,
      type: undefined,
    }),
    [user],
  )

  /**
   * Handles form submission logic based on the provided form values and formik helpers.
   *
   * @param {TConfirmUserDataForm} values - The form data submitted by the user.
   * @returns {void|Promise<void>} - Returns the result of the `onSubmit` function if provided; otherwise, no return value.
   */
  const handleSave = (values: TConfirmUserDataForm) => {
    if (onSubmit) {
      return onSubmit(values)
    }

    setUserData({
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      birthDate: values.dateOfBirth || '',
      gender: parseInt(values.gender) ?? 0,
      zipCode: values.zipCode || '',
    })

    if (values.type === 'player') {
      nextStep()
    } else {
      setConfirmParentData()
    }
  }

  return (
    <Page inline={inline}>
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

export default ConfirmUserData
