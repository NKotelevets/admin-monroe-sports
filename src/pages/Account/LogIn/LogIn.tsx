import { loginSchema } from './validation'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Checkbox, Flex } from 'antd'
import { Formik } from 'formik'

import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useLogInMutation } from '@/redux/account/account.api.ts'

import { colors } from '@/utils/colors.tsx'

import { PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD, PATH_TO_ACCOUNT_SIGNUP } from '@/common/constants/paths.ts'

const {
  Page,
  Styles: { Title, Text, LargeButton, FormStyled, Body },
} = Layout

type TLogInForm = {
  email: string
  password: string
}

const LogIn = () => {
  const [logIn, { isLoading }] = useLogInMutation()

  const initialValues: TLogInForm = {
    email: '',
    password: '',
  }

  const renderEyeIcon = (visible: boolean) =>
    visible ? <EyeOutlined style={styles.icon} /> : <EyeInvisibleOutlined style={styles.icon} />

  const renderBottomAccessory = () => (
    <Flex style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Link to={PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD} underline>
        Forgot your password?
      </Link>
    </Flex>
  )

  const onSubmit = (values: TLogInForm) => {
    alert(values)
    logIn(values)
      .unwrap()
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
            <FormStyled onSubmit={handleSubmit}>
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

              <Checkbox style={{ width: 90 }} onChange={(value) => setFieldValue('keepSignedIn', value.target.value)}>
                Checkbox
              </Checkbox>

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
