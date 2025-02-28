import { notification } from 'antd'
import { Formik, FormikHelpers } from 'formik'
import { ReactElement, useEffect } from 'react'

import { ConfirmUserDataForm } from '@/pages/Account/ConfirmUserData/components/ConfirmUserDataForm.tsx'
import { confirmUserDataSchema } from '@/pages/Account/ConfirmUserData/components/validate.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'

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

const DEFAULT_ERROR_MESSAGE = 'We were unable to confirm your data. Please, try again.'

// TODO: not implemented yet
const confirmGuardianData = (value: TConfirmUserDataForm) => new Promise((_resolve, reject) => {
  reject(value)
})
const confirmPlayerData = (value: TConfirmUserDataForm) => new Promise((_resolve, reject) => {
  reject(value)
})

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
  const { handleErrors, nonFieldErrors } = useFieldErrors<TConfirmUserDataForm>(false)

  const [api, contextHolder] = notification.useNotification()

  const initialValues: TConfirmUserDataForm = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    zipCode: '',
    terms: false,
    type: undefined,
  }

  const errorsCallback = () => {
    const serverMessage = typeof nonFieldErrors === 'string' ? nonFieldErrors : nonFieldErrors?.[0]
    if (!serverMessage) return

    const message = serverMessage.includes('expired') ? 'Please, request a new password reset' : undefined
    api.error({
      message: serverMessage,
      description: message || 'Please, try again. If the problem persists, contact support.',
      placement: 'bottomRight',
    })
  }

  useEffect(() => {
    errorsCallback()
  }, [nonFieldErrors])

  const handlePlayerData = (
    values: TConfirmUserDataForm,
    setErrors: FormikHelpers<TConfirmUserDataForm>['setErrors'],
  ) => {
    confirmPlayerData(values)
      .then(() => {
        // console.log(res)
      })
      .catch(handleErrors(setErrors, errorsCallback))
      .catch(() => {
        api.error({
          message: 'Something went wrong',
          description: DEFAULT_ERROR_MESSAGE,
          placement: 'bottomRight',
        })
      })
  }
  const handleGuardianData = (
    values: TConfirmUserDataForm,
    setErrors: FormikHelpers<TConfirmUserDataForm>['setErrors'],
  ) => {
    confirmGuardianData(values)
      .then(() => {
        // console.log(res)
      })
      .catch(handleErrors(setErrors, errorsCallback))
      .catch(() => {
        api.error({
          message: 'Something went wrong',
          description: DEFAULT_ERROR_MESSAGE,
          placement: 'bottomRight',
        })
      })
  }

  /**
   * Handles form submission logic based on the provided form values and formik helpers.
   *
   * @param {TConfirmUserDataForm} values - The form data submitted by the user.
   * @param {FormikHelpers<TConfirmUserDataForm>} formikHelpers - Formik helper functions such as setErrors.
   * @returns {void|Promise<void>} - Returns the result of the `onSubmit` function if provided; otherwise, no return value.
   */
  const handleSubmit = (values: TConfirmUserDataForm, { setErrors }: FormikHelpers<TConfirmUserDataForm>) => {
    if (onSubmit) {
      return onSubmit(values)
    }

    if (values.type === 'player') {
      handlePlayerData(values, setErrors)
    } else {
      handleGuardianData(values, setErrors)
    }
  }

  return (
    <Page inline={inline}>
      {contextHolder}
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
          onSubmit={handleSubmit}
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
