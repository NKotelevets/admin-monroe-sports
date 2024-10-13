import { Checkbox, Flex } from 'antd'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import {
  CheckboxText,
  ForgotPasswordWrapper,
  SignInButton,
  Subtitle,
  Title,
  Wrapper,
} from '@/pages/Auth/SingIn/Elements'
import { initialSignInValues, validationSchema } from '@/pages/Auth/SingIn/formik'

import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroePasswordInput from '@/components/Inputs/MonroePasswordInput'
import MonroeTooltip from '@/components/MonroeTooltip'

import AuthLayout from '@/layouts/AuthLayout'

import { useSignInMutation } from '@/redux/auth/auth.api'
import { useLazyGetUserQuery } from '@/redux/user/user.api'

import { useCookies } from '@/hooks/useCookies'

import { AUTH_PAGES, PATH_TO_LEAGUES } from '@/common/constants/paths'

import LogotypeIcon from '@/assets/icons/logotype.svg'

const SignIn = () => {
  const navigate = useNavigate()
  const [isStaySignedIn, setIsStaySignedIn] = useState(false)
  const [signIn] = useSignInMutation()
  const { createCookie } = useCookies()
  const [searchParams] = useSearchParams()
  const prevRoute = searchParams.get('prev')
  const [getUserData] = useLazyGetUserQuery()

  const handleSubmit = (values: { email: string; password: string }) =>
    signIn({
      email: values.email.toLowerCase(),
      password: values.password,
      isStaySignIn: isStaySignedIn,
    })
      .unwrap()
      .then((data) => {
        createCookie('accessToken', data.access)
        createCookie('refreshToken', data.refresh)

        getUserData()

        if ((prevRoute && AUTH_PAGES.includes(prevRoute)) || !prevRoute) {
          navigate(PATH_TO_LEAGUES)
        } else {
          navigate(prevRoute)
        }
      })

  return (
    <>
      <Helmet>
        <title>Admin Panel | Sign in</title>
      </Helmet>

      <AuthLayout>
        <Formik initialValues={initialSignInValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, errors, handleSubmit }) => {
            const isDisabledButton = Object.keys(errors).length === 0 && values.email && values.password

            return (
              <Flex className="w-400" align="center" justify="center" flex="1 1 auto">
                <Form onSubmit={handleSubmit}>
                  <Wrapper>
                    <ReactSVG className="logotype-icon" src={LogotypeIcon} />

                    <Flex className="mg-32-0-24" vertical>
                      <Title>Welcome back!</Title>
                      <Subtitle>Please enter your details</Subtitle>
                    </Flex>

                    <Flex vertical>
                      <MonroeInput
                        name="email"
                        label="Email"
                        error={errors.email}
                        value={values.email.toLowerCase()}
                        onChange={handleChange}
                        placeholder="Enter your email here"
                        className="h-32"
                      />
                      <Flex className="mg-v16" vertical>
                        <MonroePasswordInput
                          label="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter your password here"
                        />
                      </Flex>
                    </Flex>

                    <Flex className="mg-b40 c-p" justify="space-between">
                      <Flex vertical={false} align="center">
                        <Checkbox
                          className="checkbox"
                          checked={isStaySignedIn}
                          onChange={() => setIsStaySignedIn((prev) => !prev)}
                        />
                        <CheckboxText>Stay signed in</CheckboxText>
                      </Flex>

                      <MonroeTooltip
                        width="300px"
                        text="In order to recover your password, please go to Swift Schedule's mobile app"
                      >
                        <ForgotPasswordWrapper>Forgot password</ForgotPasswordWrapper>
                      </MonroeTooltip>
                    </Flex>

                    <Flex className="w-full" flex="1 1 auto" justify="center">
                      <MonroeTooltip
                        width="128px"
                        containerWidth="100%"
                        text={errors.email ? 'Email is not valid' : ''}
                      >
                        <SignInButton label="Sign in" isDisabled={!isDisabledButton} type="primary" htmlType="submit" />
                      </MonroeTooltip>
                    </Flex>
                  </Wrapper>
                </Form>
              </Flex>
            )
          }}
        </Formik>
      </AuthLayout>
    </>
  )
}

export default SignIn
