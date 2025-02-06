import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { Formik, FormikHelpers } from 'formik'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { resetPasswordSchema } from '@/pages/Account/ResetPassword/validate.ts'

import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useResetPasswordMutation } from '@/redux/account/account.api.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'

import { colors } from '@/utils/colors.tsx'

import { PATH_TO_ACCOUNT_LOGIN } from '@/common/constants/paths.ts'

const {
  Page,
  Styles: { Title, Text, Subtitle, LargeButton, FormStyled, Body },
} = Layout

type TResetPasswordForm = {
  token: string
  newPassword: string
  confirmPassword: string
}

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>()
  const initialValues: TResetPasswordForm = { newPassword: '', confirmPassword: '', token: token || '' }

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [api, contextHolder] = notification.useNotification()

  const navigate = useNavigate()
  const { handleErrors, nonFieldErrors } = useFieldErrors<TResetPasswordForm>(false)

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

  if (!token) {
    navigate(PATH_TO_ACCOUNT_LOGIN)
    return
  }

  const renderEyeIcon = (visible: boolean) =>
    visible ? <EyeOutlined style={styles.icon} /> : <EyeInvisibleOutlined style={styles.icon} />

  const onSubmit = (values: TResetPasswordForm, { setErrors }: FormikHelpers<TResetPasswordForm>): void => {
    resetPassword({ token: values.token, newPassword: values.newPassword })
      .unwrap()
      .then(() => {
        api.success({
          message: 'Password changed successfully',
          description: 'You can now sign in with your new password.',
          placement: 'bottomRight',
        })
        setTimeout(() => navigate(PATH_TO_ACCOUNT_LOGIN), 3000)
      })
      .catch(handleErrors(setErrors, errorsCallback))
      .catch(() => {
        api.error({
          message: 'Something went wrong',
          description: 'We were unable to change your password. Please, try again.',
          placement: 'bottomRight',
        })
      })
  }

  return (
    <Page>
      <Body>
        {contextHolder}
        <Title>Create New Password</Title>
        <Subtitle>Your new password must be different from previously used passwords</Subtitle>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit }) => (
            <FormStyled onSubmit={handleSubmit}>
              <TextInput
                preset="app"
                type="password"
                name="newPassword"
                label="Password"
                value={values.newPassword}
                placeholder="Enter password"
                onChange={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                error={touched.newPassword ? errors.newPassword : undefined}
                iconRender={renderEyeIcon}
              />
              <TextInput
                preset="app"
                type="password"
                name="confirmPassword"
                label="Confirm password"
                value={values.confirmPassword}
                placeholder="Confirm password"
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                iconRender={renderEyeIcon}
              />

              <LargeButton loading={isLoading} type="primary" htmlType="submit" disabled={!isValid}>
                Change Password
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
    </Page>
  )
}

export default ResetPassword

const styles = {
  icon: {
    fontSize: 22,
    color: colors.blackText,
  },
}
