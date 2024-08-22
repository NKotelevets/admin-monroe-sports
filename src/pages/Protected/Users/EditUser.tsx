import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Divider } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateRole from '@/pages/Protected/Users/components/PopulateRole'
import {
  ICreateUserFormValues,
  INITIAL_ROLE_DATA,
  userValidationSchema,
} from '@/pages/Protected/Users/constants/formik'

import {
  Accordion,
  AccordionHeader,
  AddEntityButton,
  CancelButton,
  MainContainer,
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

import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_USERS } from '@/constants/paths'

import ShowAllIcon from '@/assets/icons/show-all.svg'

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

const EditUser = () => {
  const navigation = useNavigate()

  const goBack = () => navigation(PATH_TO_USERS)

  const handleSubmit = () => {}

  const initialValues: ICreateUserFormValues = {
    firstName: 'First Name',
    lastName: 'Last name',
    birthDate: null,
    email: 'joedoe@example.com',
    gender: 'Male',
    phoneNumber: '(405) 512-1144',
    zipCode: '32456',
    roles: [
      {
        name: 'Operator',
        linkedEntities: [],
      },
      {
        name: 'Player',
        linkedEntities: ['Team 1', 'Team 2'],
      },
    ],
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_USERS}>Users</a>,
    },
    {
      title: <a>{initialValues.firstName + ' ' + initialValues.lastName}</a>,
    },
  ]

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Edit User</title>
        </Helmet>

        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
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
                  />
                ),
                label: <AccordionHeader>#{idx + 1} Role</AccordionHeader>,
              }))

            return (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <ProtectedPageTitle>{initialValues.firstName + ' ' + initialValues.lastName}</ProtectedPageTitle>

                  <PageContent>
                    <Flex>
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>First Name *</OptionTitle>
                          <MonroeInput
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            style={{ height: '32px' }}
                            disabled
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>Last Name *</OptionTitle>
                          <MonroeInput
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            style={{ height: '32px' }}
                            disabled
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
                            disabled
                          />
                        </Flex>

                        <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                          <OptionTitle>Gender</OptionTitle>

                          <MonroeSelect
                            onChange={handleChange}
                            options={GENDER_OPTIONS}
                            value={values.gender}
                            name="gender"
                            placeholder="Select gender"
                            disabled
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
                            error={errors.email}
                            disabled
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle style={{ padding: '0 0 5px 0' }}>Phone</OptionTitle>
                          <MonroeInput
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter phone"
                            style={{ height: '32px' }}
                            disabled
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <OptionTitle>Zip Code</OptionTitle>
                          <MonroeInput
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            placeholder="Enter zip code"
                            style={{ height: '32px' }}
                            disabled
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
                                containerWidth="190px"
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
      </>
    </BaseLayout>
  )
}

export default EditUser

