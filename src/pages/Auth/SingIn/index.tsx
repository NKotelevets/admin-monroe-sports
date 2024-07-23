import { Checkbox, Flex, Typography } from 'antd'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import * as Yup from 'yup'

import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroePasswordInput from '@/components/Inputs/MonroePasswordInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import AuthLayout from '@/layouts/AuthLayout'

import { useSignInMutation } from '@/redux/auth/auth.api'
import { useLazyGetUserQuery } from '@/redux/user/user.api'

import { useCookies } from '@/hooks/useCookies'

import { AUTH_PAGES, PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import classnames from './sign-in.module.css'

import LogotypeIcon from '@/assets/icons/logotype.svg'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Incorrect email')
    .test('is-email', 'Incorrect email', (value) =>
      value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) : true,
    )
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
})

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
          navigate(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE)
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
        <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, errors, handleSubmit }) => {
            const isDisabledButton = Object.keys(errors).length === 0 && values.email && values.password

            return (
              <Flex align="center" justify="center" flex="1 1 auto" style={{ width: '400px' }}>
                <Form onSubmit={handleSubmit}>
                  <Flex vertical className={classnames.wrapper} style={{ width: '360px' }} justify="flex-start">
                    <ReactSVG className={classnames['logotype-icon']} src={LogotypeIcon} />

                    <Flex vertical style={{ margin: '32px 0 24px' }}>
                      <Typography.Title className={classnames.title} level={1}>
                        Welcome back!
                      </Typography.Title>

                      <Typography.Title className={classnames.subtitle} level={5}>
                        Please enter your details
                      </Typography.Title>
                    </Flex>

                    <Flex vertical>
                      <MonroeInput
                        name="email"
                        label="Email"
                        error={errors.email}
                        value={values.email.toLowerCase()}
                        onChange={handleChange}
                        placeholder="Enter your email here"
                      />
                      <Flex vertical style={{ margin: '16px 0' }}>
                        <MonroePasswordInput
                          label="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter your password here"
                        />
                      </Flex>
                    </Flex>

                    <Flex vertical={false} justify="space-between" style={{ marginBottom: '40px', cursor: 'pointer' }}>
                      <Flex vertical={false} align="center">
                        <Checkbox checked={isStaySignedIn} onChange={() => setIsStaySignedIn((prev) => !prev)} />

                        <Typography.Text className={classnames['checkbox-text']}>Stay signed in</Typography.Text>
                      </Flex>

                      <MonroeTooltip
                        width="300px"
                        text="In order to recover your password, please go to Swift Schedule's mobile app"
                      >
                        <Typography.Text className={classnames['forgot-password']}>Forgot password</Typography.Text>
                      </MonroeTooltip>
                    </Flex>

                    <Flex flex="1 1 auto" style={{ width: '100%' }} justify="center">
                      <MonroeTooltip
                        width="128px"
                        containerWidth="100%"
                        text={errors.email ? 'Email is not valid' : ''}
                      >
                        <MonroeButton
                          className={classnames['sign-in-button']}
                          label="Sign in"
                          isDisabled={!isDisabledButton}
                          type="primary"
                          htmlType="submit"
                        />
                      </MonroeTooltip>
                    </Flex>
                  </Flex>
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
