import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Divider } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateRole from '@/pages/Protected/Users/components/PopulateRole'
import {
  ICreateUserFormValues,
  INITIAL_ROLE_DATA,
  userInitialFormData,
  userValidationSchema,
} from '@/pages/Protected/Users/constants/formik'

import {
  Accordion,
  AccordionHeader,
  AddEntityButton,
  CancelButton,
  MainContainer,
  MonroeBlueText,
  MonroeDatePicker,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageTitle,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'

import { validateNumber } from '@/utils'

import { PATH_TO_USERS } from '@/constants/paths'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_USERS}>Users</a>,
  },
  {
    title: <MonroeBlueText>Create user</MonroeBlueText>,
  },
]

const GENDER_OPTIONS: DefaultOptionType[] = [
  {
    label: 'Male',
    value: 'Male',
  },
  {
    label: 'Female',
    value: 'Female',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

const UserForm = () => {
  const navigation = useNavigate()

  const goBack = () => navigation(PATH_TO_USERS)

  const handleSubmit = async (values: ICreateUserFormValues, formikHelpers: FormikHelpers<ICreateUserFormValues>) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length) return
  }

  return (
    <Formik
      initialValues={userInitialFormData}
      validationSchema={userValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({ values, handleChange, handleSubmit, errors, setFieldValue, handleBlur, touched, setFieldTouched }) => {
        const isEnabledButton = Object.keys(errors).length === 0
        const isAddEntityButtonDisabled = !!errors.roles?.length
        const collapsedDivisionItems = (removeFn: (index: number) => void) =>
          values.roles.map((role, idx) => ({
            key: idx,
            children: (
              <PopulateRole
                index={idx}
                role={role}
                errors={errors}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                removeFn={removeFn}
                isMultipleRoles={values.roles.length > 1}
                values={values}
                setFieldTouched={setFieldTouched}
              />
            ),
            label: <AccordionHeader>#{idx + 1} Role</AccordionHeader>,
          }))

        return (
          <Form onSubmit={handleSubmit}>
            <PageContainer vertical>
              <Breadcrumb items={BREAD_CRUMB_ITEMS} />

              <ProtectedPageTitle>Create user</ProtectedPageTitle>

              <PageContent>
                <Flex>
                  <div style={{ flex: '0 0 40%' }}>
                    <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                  </div>

                  <MainContainer>
                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="firstName"
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>First Name *</OptionTitle>}
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        style={{ height: '32px' }}
                        error={touched.firstName ? errors.firstName : ''}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Last Name *</OptionTitle>}
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        style={{ height: '32px' }}
                        error={touched.lastName ? errors.lastName : ''}
                        onBlur={handleBlur}
                      />
                    </div>

                    <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                      <OptionTitle>Birth Date</OptionTitle>

                      <MonroeDatePicker
                        name="birthDate"
                        value={values.birthDate}
                        onChange={(_: unknown, data: string | string[]) => {
                          if (data) {
                            setFieldValue('birthDate', dayjs(data as string, 'YYYY-MM-DD'))
                          } else {
                            setFieldValue('birthDate', null)
                          }
                        }}
                        maxDate={dayjs(new Date())}
                      />
                    </Flex>

                    <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                      <OptionTitle>Gender</OptionTitle>

                      <MonroeSelect
                        onChange={handleChange}
                        options={GENDER_OPTIONS}
                        name="gender"
                        placeholder="Select gender"
                      />
                    </Flex>
                  </MainContainer>
                </Flex>

                <MonroeDivider
                  style={{
                    margin: '24px  0',
                  }}
                />

                <Flex>
                  <div style={{ flex: '0 0 40%' }}>
                    <ProtectedPageSubtitle>Contact info</ProtectedPageSubtitle>
                  </div>

                  <MainContainer>
                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Email *</OptionTitle>}
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        style={{ height: '32px' }}
                        error={touched.email ? errors.email : ''}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={(event) => {
                          if (validateNumber(event.target.value)) handleChange(event)
                        }}
                        placeholder="Enter phone"
                        style={{ height: '32px' }}
                        label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Phone</OptionTitle>}
                        error={errors.phoneNumber}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <MonroeInput
                        name="zipCode"
                        value={values.zipCode}
                        onChange={(event) => {
                          if (validateNumber(event.target.value)) handleChange(event)
                        }}
                        placeholder="Enter zip code"
                        style={{ height: '32px' }}
                        label={<OptionTitle>Zip Code</OptionTitle>}
                        error={errors.zipCode}
                      />
                    </div>
                  </MainContainer>
                </Flex>

                <MonroeDivider
                  style={{
                    margin: '24px 0 12px 0',
                  }}
                />

                <Flex>
                  <div style={{ flex: '0 0 40%', paddingTop: '12px' }}>
                    <ProtectedPageSubtitle>Roles</ProtectedPageSubtitle>
                  </div>

                  <MainContainer>
                    <FieldArray name="roles">
                      {({ push, remove }) => (
                        <Flex vertical>
                          <Accordion
                            items={collapsedDivisionItems(remove)}
                            expandIconPosition="end"
                            defaultActiveKey={[0]}
                            expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                            accordion
                          />

                          <MonroeTooltip
                            text={
                              isAddEntityButtonDisabled
                                ? "You can't create role when you have errors in other roles"
                                : ''
                            }
                            width="220px"
                            containerWidth="113px"
                          >
                            <AddEntityButton
                              disabled={isAddEntityButtonDisabled}
                              type="default"
                              icon={<PlusOutlined />}
                              iconPosition="start"
                              onClick={() => push(INITIAL_ROLE_DATA)}
                              style={{
                                width: 'auto',
                              }}
                            >
                              Add Role
                            </AddEntityButton>
                          </MonroeTooltip>
                        </Flex>
                      )}
                    </FieldArray>
                  </MainContainer>
                </Flex>

                <Divider />

                <Flex>
                  <div style={{ flex: '0 0 40%' }} />
                  <Flex>
                    <CancelButton type="default" onClick={goBack}>
                      Cancel
                    </CancelButton>

                    <MonroeTooltip width="179px" text={!isEnabledButton ? 'Missing mandatory data' : ''}>
                      <MonroeButton
                        label="Create User"
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

export default UserForm

