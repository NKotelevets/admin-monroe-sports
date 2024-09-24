import Breadcrumb from 'antd/es/breadcrumb/Breadcrumb'
import Flex from 'antd/es/flex'
import { Form, Formik, FormikHelpers } from 'formik'
import { FC } from 'react'

import {
  ICreateOperatorFormValues,
  operatorInitialFormData,
  operatorValidationSchema,
} from '@/pages/Protected/Users/constants/populateOperator'

import {
  CancelButton,
  MainContainer,
  MonroeBlueText,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageTitle,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useCreateOperatorMutation } from '@/redux/user/user.api'

import { validateNumber } from '@/utils'

import { PATH_TO_USERS } from '@/constants/paths'

import { IBEOperator } from '@/common/interfaces/operator'

interface ICreateOperatorProps {
  setOperator: (value: { id: string; name: string }) => void
}

const CreateOperator: FC<ICreateOperatorProps> = ({ setOperator }) => {
  const { setIsCreateOperatorScreen } = useUserSlice()
  const [createOperator] = useCreateOperatorMutation()

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_USERS}>Users</a>,
    },
    {
      title: <a onClick={() => setIsCreateOperatorScreen(false)}>Create user</a>,
    },
    {
      title: <MonroeBlueText>Add operator</MonroeBlueText>,
    },
  ]

  const handleSubmit = async (
    values: ICreateOperatorFormValues,
    formikHelpers: FormikHelpers<ICreateOperatorFormValues>,
  ) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length) return

    const createOperatorBody: Omit<IBEOperator, 'id'> = {
      city: values.city,
      email: values.email,
      email_contact: values.pointOfContactEmail,
      first_name: values.firstName,
      last_name: values.lastName,
      name: values.name,
      phone_number: values.phone,
      phone_number_contact: values.pointOfContactPhoneNumber,
      state: values.state,
      street: values.street,
      zip_code: values.zipCode,
    }

    createOperator(createOperatorBody)
      .unwrap()
      .then((response) => {
        setIsCreateOperatorScreen(false)
        setOperator({
          id: response.id,
          name: response.name,
        })
      })
  }

  return (
    <Formik
      initialValues={operatorInitialFormData}
      validationSchema={operatorValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({ values, handleChange, handleSubmit, errors, touched, handleBlur }) => {
        const isEnabledButton = Object.keys(errors).length === 0

        return (
          <Form onSubmit={handleSubmit}>
            <PageContainer vertical>
              <Breadcrumb items={BREAD_CRUMB_ITEMS} />

              <ProtectedPageTitle>Add operator</ProtectedPageTitle>

              <PageContent>
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
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}> Name *</OptionTitle>}
                        error={touched.name ? errors.name : ''}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        style={{ height: '32px' }}
                        error={errors.email}
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Email</OptionTitle>}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <OptionTitle style={{ padding: '0 0 5px 0' }}>Phone</OptionTitle>
                      <MonroeInput
                        name="phone"
                        value={values.phone}
                        onChange={(event) => {
                          if (validateNumber(event.target.value)) handleChange(event)
                        }}
                        placeholder="Enter phone"
                        style={{ height: '32px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="zipCode"
                        value={values.zipCode}
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Zip Code</OptionTitle>}
                        onChange={(event) => {
                          if (validateNumber(event.target.value)) handleChange(event)
                        }}
                        placeholder="Enter zip code"
                        style={{ height: '32px' }}
                        error={errors.zipCode}
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
                    <ProtectedPageSubtitle>Point of Contact</ProtectedPageSubtitle>
                  </div>

                  <MainContainer>
                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                        style={{ height: '32px' }}
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>First Name *</OptionTitle>}
                        error={touched.firstName ? errors.firstName : ''}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                        style={{ height: '32px' }}
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Last Name *</OptionTitle>}
                        error={touched.lastName ? errors.lastName : ''}
                        onBlur={handleBlur}
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
                        onChange={(event) => {
                          if (validateNumber(event.target.value)) handleChange(event)
                        }}
                        placeholder="Enter phone"
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
                  <div style={{ flex: '0 0 40%' }} />
                  <Flex>
                    <CancelButton type="default" onClick={() => setIsCreateOperatorScreen(false)}>
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
  )
}

export default CreateOperator

