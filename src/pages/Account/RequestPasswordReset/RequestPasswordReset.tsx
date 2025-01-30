import { RequestSent } from './RequestSent.tsx'
import { requestResetPasswordSchema } from './validation'
import { notification } from 'antd'
import { Formik, FormikHelpers } from 'formik'
import { useState } from 'react'

import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useRequestResetPasswordMutation } from '@/redux/account/account.api.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'

import { PATH_TO_ACCOUNT_LOGIN } from '@/common/constants/paths.ts'

type TResetPasswordForm = {
  email: string
}

const {
  Page,
  Styles: { Title, Text, Subtitle, LargeButton, FormStyled, Body },
} = Layout

/**
 * RequestPasswordReset is a functional component that renders a form to allow users
 * to request a password reset by entering their email addresses. It manages form
 * submission, input validation, and displays appropriate notifications based on the
 * success or failure of the reset request.
 *
 * Features:
 * - Allows users to submit their email addresses to request a password reset.
 * - Validates the email input field using a predefined schema.
 * - Handles API interactions for sending the password reset request.
 * - Displays success and error notifications based on the API response.
 * - Provides an option to retry password reset if the initial attempt fails.
 *
 * State Management:
 * - Tracks whether the email submission was successful via `emailSent`.
 *
 * Dependencies:
 * - Uses `Formik` for form handling and validation.
 * - Utilizes `useResetPasswordMutation` for triggering the password reset API call.
 * - Manages notifications using `notification.useNotification`.
 * - Incorporates custom error handling using `useFieldErrors`.
 *
 * Returns:
 * - A styled page with a form for entering the email, and conditional rendering to
 *   show success or retry prompts based on submission state.
 *
 * Events:
 * - Form submission triggers `onSubmit`, which processes the password reset request.
 */
const RequestPasswordReset = () => {
  const initialValues = { email: '' }

  const [requestResetPassword, { isLoading }] = useRequestResetPasswordMutation()
  const [api, contextHolder] = notification.useNotification()
  const [emailSent, setEmailSent] = useState(false)

  const { handleErrors, nonFieldErrors } = useFieldErrors<TResetPasswordForm>(false)

  /**
   * Handles the form submission process for resetting a password.
   *
   * @param {TResetPasswordForm} values - The form values submitted by the user, containing the email address.
   * @param {FormikHelpers<TResetPasswordForm>} helpers - Includes Formik helper methods such as setErrors.
   * @returns {void}
   *
   * This function takes the form values and processes the password reset using the provided email.
   * It ensures the email is handled in lowercase before invoking the `requestResetPassword` function.
   * On successful submission, it updates the state to indicate the email was sent.
   * In case of an error, it manages and displays appropriate error messages, including server messages if available,
   * and provides descriptive feedback to the user.
   */
  const onSubmit = (values: TResetPasswordForm, { setErrors }: FormikHelpers<TResetPasswordForm>): void => {
    requestResetPassword({ email: values.email.toLowerCase() })
      .unwrap()
      .then(() => {
        setEmailSent(true)
      })
      .catch(handleErrors(setErrors))
      .catch(() => {
        const serverMessage = typeof nonFieldErrors === 'string' ? nonFieldErrors : nonFieldErrors?.[0]

        setEmailSent(false)
        api.error({
          message: 'Something went wrong',
          description: serverMessage || 'We were unable to send you a password reset link. Please, try again.',
          placement: 'bottomRight',
        })
      })
  }

  return (
    <Page centered={emailSent}>
      {contextHolder}
      {emailSent && <RequestSent tryAgain={() => setEmailSent(false)} />}
      {!emailSent && (
        <Body>
          <Title>Reset Password</Title>
          <Subtitle>
            Enter the email associated with your account and we’ll send a message with an instruction to reset your
            password
          </Subtitle>

          <Formik
            validateOnMount
            initialValues={initialValues}
            validationSchema={requestResetPasswordSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit }) => (
              <FormStyled onSubmit={handleSubmit}>
                <TextInput
                  preset="app"
                  name="email"
                  label="Email"
                  value={values.email}
                  placeholder="Enter email"
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                />

                <LargeButton loading={isLoading} type="primary" htmlType="submit" disabled={!isValid}>
                  Reset Password
                </LargeButton>

                <Text>
                  Back to{' '}
                  <Link to={PATH_TO_ACCOUNT_LOGIN} underline>
                    Login
                  </Link>
                </Text>
              </FormStyled>
            )}
          </Formik>
        </Body>
      )}
    </Page>
  )
}

export default RequestPasswordReset
