import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { Layout } from 'antd'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import OperatorOnboardingHeader from '@/pages/Protected/Users/components/OperatorOnboardingHeader'
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

import {
  useAcceptInviteMutation,
  useCreateUserMutation,
  useGetPrefilledDataQuery,
  useUpdateOperatorMutation,
} from '@/redux/auth/auth.api'
import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { useCookies } from '@/hooks/useCookies'
import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { validateNumber } from '@/utils'

import { PATH_TO_SIGN_IN } from '@/common/constants/paths'
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

const StyledLayout = styled(Layout)`
  overflow-y: auto;
  overflow-x: hidden;
  width: 100vw;
  height: 100vh;
`

const StyledTypography = styled(Typography)`
  color: #333;
  text-align: center;
  width: 808px;
  margin-bottom: 24px;
`

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
  const [acceptInvite] = useAcceptInviteMutation()

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
        id: data?.user_data.id as string,
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
        id: data!.user_data.operator.id,
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
        id: data!.user_data.id,
      }).unwrap()

      await acceptInvite({
        invite_id: data!.invitation.id,
      }).unwrap()

      navigation(PATH_TO_SIGN_IN)

      setAppNotification({
        message: 'User successfully created',
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
    email: data?.user_data.operator.email,
    firstName: data?.user_data.first_name,
    lastName: data?.user_data.last_name,
    name: data?.user_data.operator.name,
    pointOfContactEmail: data?.user_data.email,
    phone: data?.user_data.operator.phone_number_contact,
    pointOfContactPhoneNumber: data?.user_data.phone_number,
    state: data?.user_data.operator.state,
    street: data?.user_data.operator.street,
    zipCode: data?.user_data.operator.zip_code || '',
    city: data?.user_data.operator.city,
    confirmPassword: '',
    password: '',
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Create User</title>
      </Helmet>

      <StyledLayout>
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

            return (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical align="center">
                  <ProtectedPageTitle className="mg-v8">Create user</ProtectedPageTitle>

                  <StyledTypography>
                    Your profile has been created by Swift Schedule Master Admin. You may edit the information or leave
                    it as it is to complete the profile creation and gain access to all features of the administration
                    panel.
                  </StyledTypography>

                  <PageContent className="w-80vw ">
                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>User Info </ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div className="mg-b8">
                          <MonroeInput
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            placeholder="Enter First Name"
                            className="h-32"
                            error={touched.firstName ? errors.firstName : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle className="pb-5">First Name *</OptionTitle>}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            placeholder="Enter Last Name"
                            className="h-32"
                            error={touched.lastName ? errors.lastName : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle className="pb-5">Last Name *</OptionTitle>}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            label={<OptionTitle className="pb-5">Email *</OptionTitle>}
                            name="pointOfContactEmail"
                            value={values.pointOfContactEmail}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="h-32"
                            error={touched.pointOfContactEmail ? errors.pointOfContactEmail : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            label={<OptionTitle className="pb-5">Phone *</OptionTitle>}
                            name="pointOfContactPhoneNumber"
                            value={values.pointOfContactPhoneNumber}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="h-32"
                            error={touched.pointOfContactPhoneNumber ? errors.pointOfContactPhoneNumber : ''}
                            onBlur={handleBlur}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Operator's Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div className="mg-b8">
                          <MonroeInput
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className="h-32"
                            error={touched.name ? errors.name : ''}
                            onBlur={handleBlur}
                            label={
                              <Flex align="center">
                                <OptionTitle className="pb-5 mg-r8">Operator's name *</OptionTitle>

                                <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                                  <ReactSVG src={InfoCircleIcon} className="pb-5" />
                                </MonroeTooltip>
                              </Flex>
                            }
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="h-32"
                            error={touched.email ? errors.email : ''}
                            onBlur={handleBlur}
                            label={
                              <Flex align="center">
                                <OptionTitle className="pb-5 mg-r8">Operator's email *</OptionTitle>

                                <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                                  <ReactSVG src={InfoCircleIcon} className="pb-5" />
                                </MonroeTooltip>
                              </Flex>
                            }
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="phone"
                            value={values.phone}
                            onChange={(event) => {
                              if (validateNumber(event.target.value)) handleChange(event)
                            }}
                            placeholder="Enter phone"
                            className="h-32"
                            error={touched.phone ? errors.phone : ''}
                            onBlur={handleBlur}
                            label={<OptionTitle className="pb-5">Operator's phone *</OptionTitle>}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="zipCode"
                            value={values.zipCode}
                            onChange={(event) => {
                              if (validateNumber(event.target.value)) handleChange(event)
                            }}
                            placeholder="Enter zip code"
                            className="h-32"
                            label={<OptionTitle className="pb-5">Zip Code *</OptionTitle>}
                            error={touched.zipCode ? errors.zipCode : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                            className="h-32"
                            error={touched.state ? errors.state : ''}
                            label={<OptionTitle className="pb-5">State *</OptionTitle>}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            className="h-32"
                            error={touched.city ? errors.city : ''}
                            label={<OptionTitle className="pb-5">City *</OptionTitle>}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="street"
                            value={values.street}
                            onChange={handleChange}
                            placeholder="Enter street"
                            className="h-32"
                            label={<OptionTitle className="pb-5">Street *</OptionTitle>}
                            onBlur={handleBlur}
                            error={touched.street ? errors.street : ''}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Password</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div ref={ref} className="mg-b8 pos-rel">
                          <MonroePasswordInput
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            label={<OptionTitle className="pb-5">Password *</OptionTitle>}
                            error={touched.password ? errors.password : ''}
                            onBlur={handleBlur}
                          />

                          {isComponentVisible && <PasswordTooltip passwordErrors={passwordErrors} />}
                        </div>

                        <div className="mg-b8">
                          <MonroePasswordInput
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter password"
                            label={<OptionTitle className="pb-5">Confirm password *</OptionTitle>}
                            error={touched.confirmPassword ? errors.confirmPassword : ''}
                            onBlur={handleBlur}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40" />
                      <Flex>
                        <CancelButton type="default" onClick={() => navigation(PATH_TO_SIGN_IN)}>
                          Cancel
                        </CancelButton>

                        <MonroeButton className="h-40" label="Create Operator" type="primary" onClick={handleSubmit} />
                      </Flex>
                    </Flex>
                  </PageContent>
                </PageContainer>
              </Form>
            )
          }}
        </Formik>
      </StyledLayout>
    </>
  )
}

export default OperatorOnboarding

