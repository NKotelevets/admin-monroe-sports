import OperatorOnboardingHeader from './components/OperatorOnboardingHeader'
import { Flex, Typography } from 'antd'
import { Layout } from 'antd'
import { Form, Formik } from 'formik'
import { CSSProperties, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PasswordTooltip from '@/pages/Protected/Users/components/PasswordTooltip'
import {
  IFinishCreatingOperator,
  finishCreateOperatorValidationSchema,
} from '@/pages/Protected/Users/constants/populateOperator'

import {
  CancelButton,
  MainContainer,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageTitle,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroePasswordInput from '@/components/Inputs/MonroePasswordInput'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useCreateUserMutation, useGetPrefilledDataQuery, useUpdateOperatorMutation } from '@/redux/auth/auth.api'
import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useCookies } from '@/hooks/useCookies'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { PATH_TO_SIGN_IN } from '@/constants/paths'

import { IUpdateOperator } from '@/common/interfaces/auth'

import InfoCircleIcon from '@/assets/icons/info-circle.svg'

const DEFAULT_TOOLTIP_TEXT =
  'If you are an official representative of the organization, this information may be relevant to you.'

interface IPasswordErrors {
  haveLetter: boolean
  haveCapitalLetter: boolean
  haveNumber: boolean
  haveEnoughCharacters: boolean
  haveOneSpecialCharacter: boolean
}

const checkPassword = (password: string): IPasswordErrors => {
  const passwordErrors: IPasswordErrors = {
    haveEnoughCharacters: false,
    haveCapitalLetter: false,
    haveLetter: false,
    haveNumber: false,
    haveOneSpecialCharacter: false,
  }

  if (password.length >= 8) {
    passwordErrors.haveEnoughCharacters = true
  } else {
    passwordErrors.haveEnoughCharacters = false
  }

  if (/[a-z]/.test(String(password))) {
    passwordErrors.haveLetter = true
  } else {
    passwordErrors.haveLetter = false
  }

  if (/[A-Z]/.test(String(password))) {
    passwordErrors.haveCapitalLetter = true
  } else {
    passwordErrors.haveCapitalLetter = false
  }

  if (/\d/.test(String(password))) {
    passwordErrors.haveNumber = true
  } else {
    passwordErrors.haveNumber = false
  }

  if (/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g.test(String(password))) {
    passwordErrors.haveOneSpecialCharacter = true
  } else {
    passwordErrors.haveOneSpecialCharacter = false
  }

  return passwordErrors
}

const layoutStyle: CSSProperties = {
  overflowX: 'hidden',
  overflowY: 'auto',
  width: '100vw',
  height: '100vh',
}

const OperatorOnboarding = () => {
  const params = useParams<{ token: string }>()
  const navigation = useNavigate()
  const { isComponentVisible, ref } = useIsActiveComponent(false)
  const { data, isLoading, isFetching, isError } = useGetPrefilledDataQuery(
    { invitation_token: params.token as string },
    { skip: !params.token },
  )
  const { removeTokens, access, setRedirectToLogin } = useAuthSlice()
  const { deleteCookie } = useCookies()
  const { clearUserData } = useUserSlice()
  const { setAppNotification } = useAppSlice()
  const [createUser] = useCreateUserMutation()
  const [updateOperator] = useUpdateOperatorMutation()

  useEffect(() => {
    if (access && params.token) {
      removeTokens()
      clearUserData()
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
      setRedirectToLogin(false)
    }
  }, [])

  const onSubmit = async (values: IFinishCreatingOperator) => {
    try {
      const updateOperatorBody: IUpdateOperator = {
        city: values.city,
        email: values.email,
        email_contact: values.pointOfContactEmail,
        first_name: values.firstName,
        last_name: values.lastName,
        name: values.name,
        phone_number: values.pointOfContactPhoneNumber,
        phone_number_contact: values.phone,
        state: values.state,
        street: values.street,
        zip_code: values.zipCode,
      }

      await updateOperator({
        id: data!.operator.id,
        body: updateOperatorBody,
      }).unwrap()

      await createUser({
        body: {
          email: values.pointOfContactEmail,
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password,
          phone_number: values.pointOfContactPhoneNumber,
        },
        id: data!.id,
      }).unwrap()

      navigation(PATH_TO_SIGN_IN)

      setAppNotification({
        message: 'Operator successfully on boarded',
        timestamp: new Date().getTime(),
        type: 'success',
      })
    } catch {
      setAppNotification({
        message: 'Something went wrong. Please try again later',
        timestamp: new Date().getTime(),
        type: 'error',
      })
    }
  }

  const redirectToSignIn = () => {
    setAppNotification({
      message: 'Invite expired',
      timestamp: new Date().getTime(),
      type: 'error',
    })

    navigation(PATH_TO_SIGN_IN)
  }

  if (!params.token) {
    navigation(PATH_TO_SIGN_IN)
    return <></>
  }

  if ((!data && !isLoading) || isError) redirectToSignIn()

  if (!data || isLoading || isFetching) return <Loader />

  const finishCreateOperatorFormData: IFinishCreatingOperator = {
    city: data?.city,
    email: data?.operator.email,
    firstName: data?.first_name,
    lastName: data?.last_name,
    name: data?.operator.name,
    phone: data?.phone_number,
    pointOfContactEmail: data?.email,
    pointOfContactPhoneNumber: data?.operator.phone_number_contact,
    state: data?.state,
    street: data?.operator.street,
    zipCode: data?.zip_code,
    confirmPassword: '',
    password: '',
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Operator Onboarding</title>
      </Helmet>

      <Layout style={layoutStyle}>
        <OperatorOnboardingHeader />

        <Formik
          initialValues={finishCreateOperatorFormData}
          validateOnBlur
          onSubmit={onSubmit}
          validationSchema={finishCreateOperatorValidationSchema}
          validateOnChange
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, touched, handleBlur }) => {
            const passwordErrors = checkPassword(values.password)
            const isEnabledButton = Object.keys(errors).length === 0

            return (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical align="center">
                  <ProtectedPageTitle style={{ margin: '8px 0' }}>Add operator</ProtectedPageTitle>

                  <Typography
                    style={{
                      color: '#333',
                      textAlign: 'center',
                      width: '808px',
                      marginBottom: '24px',
                    }}
                  >
                    Your profile has been created by Swift Schedule Master Admin. You may edit the information or leave
                    it as it is to complete the profile creation and gain access to all features of the administration
                    panel.
                  </Typography>

                  <PageContent style={{ width: '80vw' }}>
                    <Flex>
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>User Info </ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            placeholder="Enter First Name"
                            style={{ height: '32px' }}
                            error={touched.firstName ? errors.firstName : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>First Name *</OptionTitle>}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            placeholder="Enter Last Name"
                            style={{ height: '32px' }}
                            error={touched.lastName ? errors.lastName : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Last Name *</OptionTitle>}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Email *</OptionTitle>}
                            name="pointOfContactEmail"
                            value={values.pointOfContactEmail}
                            onChange={handleChange}
                            placeholder="Enter email"
                            style={{ height: '32px' }}
                            error={touched.pointOfContactEmail ? errors.pointOfContactEmail : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Phone *</OptionTitle>}
                            name="pointOfContactPhoneNumber"
                            value={values.pointOfContactPhoneNumber}
                            onChange={handleChange}
                            placeholder="Enter email"
                            style={{ height: '32px' }}
                            error={touched.pointOfContactPhoneNumber ? errors.pointOfContactPhoneNumber : ''}
                            onBlur={handleBlur}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px  0',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>Operator's Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            style={{ height: '32px' }}
                            error={touched.name ? errors.name : ''}
                            onBlur={handleBlur}
                            label={
                              <Flex align="center">
                                <OptionTitle style={{ padding: '0 0 5px 0', marginRight: '8px' }}>
                                  Operator's name *
                                </OptionTitle>

                                <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                                  <ReactSVG src={InfoCircleIcon} style={{ padding: '0 0 5px 0' }} />
                                </MonroeTooltip>
                              </Flex>
                            }
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            style={{ height: '32px' }}
                            error={touched.email ? errors.email : ''}
                            onBlur={handleBlur}
                            label={
                              <Flex align="center">
                                <OptionTitle style={{ padding: '0 0 5px 0', marginRight: '8px' }}>
                                  Operator's email *
                                </OptionTitle>

                                <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                                  <ReactSVG src={InfoCircleIcon} style={{ padding: '0 0 5px 0' }} />
                                </MonroeTooltip>
                              </Flex>
                            }
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroeInput
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
                            style={{ height: '32px' }}
                            error={touched.phone ? errors.phone : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Operator's phone *</OptionTitle>}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>Zip Code</OptionTitle>
                          <MonroeInput
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            placeholder="Enter zip code"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>State</OptionTitle>
                          <MonroeInput
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>City</OptionTitle>
                          <MonroeInput
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>Street</OptionTitle>
                          <MonroeInput
                            name="street"
                            value={values.street}
                            onChange={handleChange}
                            placeholder="Enter street"
                            style={{ height: '32px' }}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px  0',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>Password</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div ref={ref} style={{ marginBottom: '8px', position: 'relative' }}>
                          <MonroePasswordInput
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Password *</OptionTitle>}
                            error={touched.password ? errors.password : ''}
                            onBlur={handleBlur}
                          />

                          {isComponentVisible && <PasswordTooltip passwordErrors={passwordErrors} />}
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroePasswordInput
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter password"
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Confirm password *</OptionTitle>}
                            error={touched.confirmPassword ? errors.confirmPassword : ''}
                            onBlur={handleBlur}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px  0',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%' }} />
                      <Flex>
                        <CancelButton type="default" onClick={() => navigation(PATH_TO_SIGN_IN)}>
                          Cancel
                        </CancelButton>

                        <MonroeTooltip width="179px" text={!isEnabledButton ? 'Missing mandatory data' : ''}>
                          <MonroeButton
                            label="Create Operator"
                            type="primary"
                            onClick={handleSubmit}
                            isDisabled={!isEnabledButton}
                          />
                        </MonroeTooltip>
                      </Flex>
                    </Flex>
                  </PageContent>
                </PageContainer>
              </Form>
            )
          }}
        </Formik>
      </Layout>
    </>
  )
}

export default OperatorOnboarding

