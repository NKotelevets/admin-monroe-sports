import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { Formik } from 'formik'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { createPasswordSchema } from '@/pages/Account/CreatePassword/validation.ts'
import { InvitationError } from '@/pages/Account/Onboarding/components/InvitationError.tsx'
import { InvitationExpired } from '@/pages/Account/Onboarding/components/InvitationExpired.tsx'

import { Fields } from '@/components/Elements'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { PasswordRequirements } from '@/components/PasswordRequirements.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useAcceptInviteMutation } from '@/redux/auth/auth.api.ts'
import { useAccountSlice } from '@/redux/hooks/useAccountSlice.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'
import { useInvitation } from '@/hooks/useInvitation.ts'

import { colors } from '@/utils/colors.tsx'

import { PATH_TO_ACCOUNT_LOGIN } from '@/common/constants/paths.ts'

const {
  Page,
  Styles: { Title, Subtitle, LargeButton, FormStyled, Body },
} = Layout

type TCreatePasswordForm = {
  newPassword: string
  confirmPassword: string
}

const CreatePassword = () => {
  const { invitation, invitationExpired, hasErrors, token, nextStep } = useInvitation()
  const { nonFieldErrors } = useFieldErrors<TCreatePasswordForm>(false)
  const { setTempPassword } = useAccountSlice()

  const [, { isLoading }] = useAcceptInviteMutation()
  const [api, contextHolder] = notification.useNotification()

  const navigate = useNavigate()
  const initialValues: TCreatePasswordForm = { newPassword: '', confirmPassword: '' }

  /**
   * Callback function to handle errors and display an error notification.
   * It retrieves a server message from the provided error details and
   * displays an error message using the `api.error` method.
   *
   * @function
   */
  const errorsCallback = () => {
    const serverMessage = typeof nonFieldErrors === 'string' ? nonFieldErrors : nonFieldErrors?.[0]

    api.error({
      message: serverMessage || 'Something went wrong',
      description: 'Please, try again. If the problem persists, contact support.',
      placement: 'bottomRight',
    })
  }

  useEffect(() => {
    if (nonFieldErrors) {
      errorsCallback()
    }
  }, [nonFieldErrors])

  if (!token) {
    navigate(PATH_TO_ACCOUNT_LOGIN)
    return
  }

  const renderEyeIcon = (visible: boolean) =>
    visible ? <EyeOutlined style={styles.icon} /> : <EyeInvisibleOutlined style={styles.icon} />

  const onSubmit = (values: TCreatePasswordForm): void => {
    if (!invitation) return
    setTempPassword(values.newPassword)
    return nextStep()
  }

  if (invitationExpired) {
    return (
      <Page>
        <InvitationExpired />
      </Page>
    )
  }

  if (hasErrors && !invitationExpired) {
    return (
      <Page>
        <InvitationError />
      </Page>
    )
  }

  return (
    <Page>
      <Body>
        {contextHolder}
        <Title>Create Password</Title>
        <Subtitle>
          Your account was created by administrator. <br /> Create a password to complete the profile creation
        </Subtitle>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={createPasswordSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit }) => (
            <FormStyled onSubmit={handleSubmit}>
              <Fields>
                <TextInput
                  preset="app"
                  type="password"
                  name="newPassword"
                  label="Password"
                  value={values.newPassword}
                  placeholder="Enter password"
                  onChange={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  // error={touched.newPassword ? errors.newPassword : undefined}
                  iconRender={renderEyeIcon}
                />
                <PasswordRequirements password={values.newPassword} />
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
                  Create Password
                </LargeButton>
              </Fields>
            </FormStyled>
          )}
        </Formik>
      </Body>
    </Page>
  )
}

export default CreatePassword

const styles = {
  icon: {
    fontSize: 22,
    color: colors.blackText,
  },
}
