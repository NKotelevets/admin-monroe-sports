import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Divider } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateRole from '@/pages/Protected/Users/components/PopulateRole'
import {
  ICreateUserFormValues,
  INITIAL_ROLE_DATA,
  editUserValidationSchema,
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
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkEditMutation, useGetUserDetailsQuery } from '@/redux/user/user.api'

import { calculateUserRoles } from '@/utils/user'

import { FULL_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'
import { IRole } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'

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

const ROLES_WITH_TEAMS: TRole[] = ['Head Coach', 'Coach', 'Player', 'Team Admin']
const MAX_CREATED_ROLES_BY_ADMIN = 6
const MAX_CREATED_ROLES_BY_OPERATOR = 4

const EditUser = () => {
  const params = useParams<{ id: string }>()
  const navigation = useNavigate()
  const { data, isLoading, error } = useGetUserDetailsQuery(
    {
      id: params?.id || '',
    },
    {
      skip: !params.id,
    },
  )
  const [bulkEdit] = useBulkEditMutation()
  const { setAppNotification } = useAppSlice()
  const { user } = useUserSlice()
  const userAdminRoles = user?.roles.filter((role) => ['Operator', 'Master Admin'].includes(role)).length
  const maximumRoles = user?.isSuperuser
    ? MAX_CREATED_ROLES_BY_ADMIN
    : userAdminRoles
      ? MAX_CREATED_ROLES_BY_OPERATOR + userAdminRoles
      : MAX_CREATED_ROLES_BY_OPERATOR
  const isSameUser = !!(user && data && user?.id === data?.id)

  const goBack = () => navigation(PATH_TO_USERS)

  const handleSubmit = async (values: ICreateUserFormValues, formikHelpers: FormikHelpers<ICreateUserFormValues>) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length) return

    const updateUserAsAdminBody = {
      id: data!.id,
      roles: values.roles.flatMap((role) => {
        if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
          return role!.linkedEntities!.map(
            (linkedEntity) =>
              ({
                role: role.name,
                team_id: linkedEntity.id,
              }) as IRole,
          )
        }

        if (role.name === 'Operator') {
          return {
            role: role.name,
            operator_id: role.linkedEntities?.[0].id,
          } as IRole
        }

        if (role.name === 'Master Admin') {
          return {
            role: 'Swift Schedule Master Admin',
          } as unknown as IRole
        }

        return {
          role: role.name,
        } as IRole
      }),
    }

    bulkEdit([updateUserAsAdminBody])
      .unwrap()
      .then(() => {
        navigation(PATH_TO_USERS)
      })
  }

  useEffect(() => {
    if (!isLoading && !data) {
      setAppNotification({
        message: (error as IDetailedError).details,
        type: 'error',
      })

      goBack()
    }
  }, [data, isLoading])

  if (isLoading || !data) return <Loader />

  const initialValues: ICreateUserFormValues = {
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    email: data.email,
    gender: FULL_GENDER_NAMES[data.gender as TGender],
    phoneNumber: data.phoneNumber,
    zipCode: data.zipCode,
    roles: calculateUserRoles(data),
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_USERS}>Users</a>,
    },
    {
      title: <MonroeBlueText>{initialValues.firstName + ' ' + initialValues.lastName}</MonroeBlueText>,
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
          validationSchema={editUserValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue, setFieldTouched }) => {
            const isAddEntityButtonDisabled = !!errors.roles?.length || values.roles.length === maximumRoles
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
                    values={values}
                    setFieldTouched={setFieldTouched}
                    isSameUser={isSameUser}
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
                            value={values.birthDate ? dayjs(values.birthDate, 'YYYY-MM-DD') : null}
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
                                    ? values.roles.length === maximumRoles
                                      ? `Maximum roles is ${maximumRoles}`
                                      : "You can't create role when you have errors in other roles"
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

                        <MonroeButton label="Save" type="primary" onClick={handleSubmit} />
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

