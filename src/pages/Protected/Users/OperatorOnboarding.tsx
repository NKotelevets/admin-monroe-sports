import { Flex, Typography } from 'antd'
import { Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PasswordTooltip from '@/pages/Protected/Users/components/PasswordTooltip'
import {
  finishCreateOperatorFormData,
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
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { PATH_TO_USERS } from '@/constants/paths'

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

const OperatorOnboarding = () => {
  const params = useParams<{ id: string }>()
  const navigation = useNavigate()
  const { isComponentVisible, ref } = useIsActiveComponent(false)

  const onSubmit = () => {}

  if (!params.id) {
    navigation(PATH_TO_USERS)
    return <></>
  }

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Operator Onboarding</title>
        </Helmet>

        <Formik
          initialValues={finishCreateOperatorFormData}
          validateOnBlur
          onSubmit={onSubmit}
          validationSchema={finishCreateOperatorValidationSchema}
        >
          {({ values, handleChange, handleSubmit, errors }) => {
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

                  <PageContent style={{ width: '100%' }}>
                    <Flex>
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>User Info </ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>First Name *</OptionTitle>
                          <MonroeInput
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            placeholder="Enter firstName"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle>Last Name *</OptionTitle>
                          <MonroeInput
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            placeholder="Enter lastName"
                            style={{ height: '32px' }}
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
                            error={errors.pointOfContactEmail === 'Incorrect email' ? errors.pointOfContactEmail : ''}
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
                          <Flex align="center">
                            <OptionTitle style={{ padding: '0 0 5px 0', marginRight: '8px' }}>
                              Operator's name *
                            </OptionTitle>

                            <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                              <ReactSVG src={InfoCircleIcon} style={{ padding: '0 0 5px 0' }} />
                            </MonroeTooltip>
                          </Flex>
                          <MonroeInput
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <Flex align="center">
                            <OptionTitle style={{ padding: '0 0 5px 0', marginRight: '8px' }}>
                              Operator's email *
                            </OptionTitle>

                            <MonroeTooltip text={DEFAULT_TOOLTIP_TEXT} width="358px" containerWidth="auto">
                              <ReactSVG src={InfoCircleIcon} style={{ padding: '0 0 5px 0' }} />
                            </MonroeTooltip>
                          </Flex>

                          <MonroeInput
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            style={{ height: '32px' }}
                            error={errors.email === 'Incorrect email' ? errors.email : ''}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>Operator's phone *</OptionTitle>
                          <MonroeInput
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="Enter phone"
                            style={{ height: '32px' }}
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
                          />

                          {isComponentVisible && <PasswordTooltip passwordErrors={passwordErrors} />}
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <MonroePasswordInput
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter password"
                            error={errors.confirmPassword}
                            label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Confirm password *</OptionTitle>}
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
                        <CancelButton type="default">Cancel</CancelButton>

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
      </>
    </BaseLayout>
  )
}

export default OperatorOnboarding

