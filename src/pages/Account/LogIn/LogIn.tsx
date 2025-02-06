import { loginSchema } from './validation'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Checkbox, Flex } from 'antd'
import { Formik } from 'formik'
import { ReactElement, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useSignInMutation } from '@/redux/auth/auth.api.ts'
import { useLazyGetUserQuery } from '@/redux/user/user.api.ts'

import { useCookies } from '@/hooks/useCookies.ts'
import { useLogout } from '@/hooks/useLogout.ts'

import { colors } from '@/utils/colors.tsx'

import {
  AUTH_PAGES,
  PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD,
  PATH_TO_ACCOUNT_SIGNUP,
  PATH_TO_DOWNLOAD_SCREEN,
} from '@/common/constants/paths.ts'
import { ISignInRequestBody } from '@/common/interfaces/auth.ts'

const {
  Page,
  Styles: { Title, Text, LargeButton, FormStyled, Body },
} = Layout

/**
 * LogIn functional component that renders a login form with interactive elements.
 *
 * The component allows users to sign in by entering their email, password, and optionally choosing to stay logged in.
 * It also handles user authentication, manages cookies for access and refresh tokens, and redirects users
 * based on the previous route or specific authentication logic.
 *
 * The login form includes validation, password visibility toggling, and a link for password recovery.
 */
const LogIn = () => {
  const { createCookie } = useCookies()
  const { onLogOut } = useLogout()

  const [searchParams] = useSearchParams()
  const [getUserData] = useLazyGetUserQuery()
  const [logIn, { isLoading }] = useSignInMutation()
  const prevRoute = searchParams.get('prev')

  const navigate = useNavigate()
  const initialValues: ISignInRequestBody = {
    email: '',
    password: '',
    isStaySignIn: false,
  }

  useEffect(() => {
    onLogOut(false)
  }, [])

  /**
   * Determines which eye icon to render based on visibility state.
   *
   * @param {boolean} visible - Indicates whether the eye icon should represent a visible or invisible state.
   * @return {ReactElement} The corresponding eye icon component.
   */
  const renderEyeIcon = (visible: boolean): ReactElement =>
    visible ? <EyeOutlined style={styles.icon} /> : <EyeInvisibleOutlined style={styles.icon} />

  /**
   * Renders a bottom accessory component.
   *
   * The rendered accessory includes a link for resetting the password,
   * styled within a container with specific height, alignment, and justification.
   *
   * @function
   * @returns {ReactElement} A JSX element containing the bottom accessory.
   */
  const renderBottomAccessory = (): ReactElement => (
    <Flex style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Link to={PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD} underline>
        Forgot your password?
      </Link>
    </Flex>
  )

  /**
   * Handles the submission of login form data.
   *
   * @function
   * @param {ISignInRequestBody} values - The login form values submitted by the user.
   * @returns {void}
   */
  const onSubmit = (values: ISignInRequestBody): void => {
    logIn(values)
      .unwrap()
      .then((data) => {
        createCookie('accessToken', data.access)
        createCookie('refreshToken', data.refresh)

        getUserData()

        if ((prevRoute && AUTH_PAGES.includes(prevRoute)) || !prevRoute) {
          navigate(PATH_TO_DOWNLOAD_SCREEN)
        } else {
          navigate(prevRoute)
        }
      })
  }

  return (
    <Page>
      <Body>
        <Title>Welcome Back! Sign In Below</Title>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isValid, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <FormStyled autoComplete="off" onSubmit={handleSubmit}>
              <TextInput
                preset="app"
                type="email"
                name="email"
                label="Email"
                value={values.email}
                placeholder="Enter email"
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : undefined}
              />
              <TextInput
                preset="app"
                type="password"
                name="password"
                label="Password"
                value={values.password}
                placeholder="Enter password"
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                bottomAccessory={renderBottomAccessory}
                iconRender={renderEyeIcon}
              />

              <CheckboxStyled
                name="isStaySignIn"
                checked={values.isStaySignIn}
                onChange={(value) => {
                  setFieldValue('isStaySignIn', value.target.checked)
                }}
              >
                Keep logged in
              </CheckboxStyled>

              <LargeButton loading={isLoading} type="primary" htmlType="submit" disabled={!isValid}>
                Log in
              </LargeButton>

              <Text>
                Don't have an account yet?{' '}
                <Link to={PATH_TO_ACCOUNT_SIGNUP} underline>
                  Sign Up
                </Link>
              </Text>
            </FormStyled>
          )}
        </Formik>
      </Body>
    </Page>
  )
}

export default LogIn

const styles = {
  icon: {
    fontSize: 22,
    color: colors.blackText,
  },
}

// Styled Components
const CheckboxStyled = styled(Checkbox)`
  width: 150px;
  align-self: flex-start;
  text-align: left;
  display: flex;
  margin-bottom: 24px;
`
