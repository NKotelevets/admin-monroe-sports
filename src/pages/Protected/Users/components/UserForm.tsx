import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Divider } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import CreateOperator from '@/pages/Protected/Users/components/CreateOperator'
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

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useCreateUserAsAdminMutation } from '@/redux/user/user.api'

import { validateNumber } from '@/utils'

import {
  COACH_ROLE,
  HEAD_COACH_ROLE,
  MASTER_ADMIN_ROLE,
  OPERATOR_ROLE,
  PLAYER_ROLE,
  TEAM_ADMIN_ROLE,
} from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { ICreateUserAsAdminRequestBody, IRole } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'

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
    label: 'Female',
    value: 1,
  },
  {
    label: 'Male',
    value: 2,
  },
  {
    label: 'Other',
    value: 3,
  },
]

const ROLES_WITH_TEAMS: TRole[] = [HEAD_COACH_ROLE, COACH_ROLE, PLAYER_ROLE, TEAM_ADMIN_ROLE]
const MAX_CREATED_ROLES_BY_ADMIN = 6
const MAX_CREATED_ROLES_BY_OPERATOR = 4

const UserForm = () => {
  const navigation = useNavigate()
  const { isCreateOperatorScreen, user } = useUserSlice()
  const [createUserAsAdmin] = useCreateUserAsAdminMutation()
  const isAdmin = user?.isSuperuser
  const maximumRoles = isAdmin ? MAX_CREATED_ROLES_BY_ADMIN : MAX_CREATED_ROLES_BY_OPERATOR
  const [activeKey, setActiveKey] = useState(0)

  const goBack = () => navigation(PATH_TO_USERS)

  const handleSubmit = async (values: ICreateUserFormValues, formikHelpers: FormikHelpers<ICreateUserFormValues>) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length) return

    const createUserAsAdminRequestBody: ICreateUserAsAdminRequestBody = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      gender: (values?.gender ? +values.gender - 1 : 2) as TGender,
      roles: values.roles
        .flatMap((role) => {
          if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
            return role!.linkedEntities!.map(
              (linkedEntity) =>
                ({
                  role: role.name,
                  team_id: linkedEntity.id,
                }) as IRole,
            )
          }

          if (role.name === MASTER_ADMIN_ROLE) {
            return {
              role: 'Swift Schedule Master Admin',
            } as unknown as IRole
          }

          if (role.name === OPERATOR_ROLE) {
            return {
              role: role.name,
              operator_id: role.linkedEntities?.[0].id,
            } as IRole
          }

          return {
            role: role.name,
          } as IRole
        })
        .filter((r) => r.role),
    }

    if (values.birthDate) createUserAsAdminRequestBody.birth_date = dayjs(values.birthDate).toISOString().split('T')[0]

    if (values.phoneNumber) createUserAsAdminRequestBody.phone_number = values.phoneNumber

    if (values.zipCode) createUserAsAdminRequestBody.zip_code = values.zipCode

    createUserAsAdmin(createUserAsAdminRequestBody)
      .unwrap()
      .then(() => {
        navigation(PATH_TO_USERS)
      })
  }

  return (
    <Formik
      initialValues={userInitialFormData}
      validationSchema={userValidationSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({ values, handleChange, handleSubmit, errors, setFieldValue, handleBlur, touched, setFieldTouched }) => {
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
              />
            ),
            label: <AccordionHeader>#{idx + 1} Role</AccordionHeader>,
          }))

        const setOperator = (value: { id: string; name: string }) => {
          const operatorIndex = values.roles.findIndex((role) => role.name === OPERATOR_ROLE)
          setFieldValue(`roles.${operatorIndex}.linkedEntities`, [value])
        }

        return (
          <>
            {isCreateOperatorScreen && <CreateOperator setOperator={setOperator} />}

            {!isCreateOperatorScreen && (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <ProtectedPageTitle>Create user</ProtectedPageTitle>

                  <PageContent>
                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div className="mg-b8">
                          <MonroeInput
                            name="firstName"
                            label={<OptionTitle className="pb-5">First Name *</OptionTitle>}
                            value={values.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            className="h-32"
                            error={touched.firstName ? errors.firstName : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            label={<OptionTitle className="pb-5">Last Name *</OptionTitle>}
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="h-32"
                            error={touched.lastName ? errors.lastName : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <Flex className="mg-b8 w-full" vertical justify="flex-start">
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

                        <Flex className="mg-b8 w-full" vertical justify="flex-start">
                          <OptionTitle>Gender</OptionTitle>

                          <MonroeSelect
                            onChange={(value) => {
                              setFieldValue('gender', value)
                            }}
                            options={GENDER_OPTIONS}
                            name="gender"
                            placeholder="Select gender"
                            value={values.gender}
                          />
                        </Flex>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Contact info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <div className="mg-b8">
                          <MonroeInput
                            label={<OptionTitle className="pb-5">Email *</OptionTitle>}
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="h-32"
                            error={touched.email ? errors.email : ''}
                            onBlur={handleBlur}
                          />
                        </div>

                        <div className="mg-b8">
                          <MonroeInput
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={(event) => {
                              if (validateNumber(event.target.value)) handleChange(event)
                            }}
                            placeholder="Enter phone"
                            className="h-32"
                            label={<OptionTitle className="pb-5">Phone</OptionTitle>}
                            error={errors.phoneNumber}
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
                            label={<OptionTitle>Zip Code</OptionTitle>}
                            error={errors.zipCode}
                          />
                        </div>
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Role</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <FieldArray name="roles">
                          {({ push, remove }) => (
                            <Flex vertical>
                              <Accordion
                                items={collapsedDivisionItems(remove)}
                                expandIconPosition="end"
                                expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                                accordion
                                activeKey={activeKey}
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
                                  onClick={() => {
                                    push(INITIAL_ROLE_DATA)
                                    setActiveKey(values.roles.length - 1)
                                  }}
                                  className="w-auto"
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
                      <div className="f-40" />
                      <Flex>
                        <CancelButton type="default" onClick={goBack}>
                          Cancel
                        </CancelButton>

                        <MonroeButton label="Create User" type="primary" onClick={handleSubmit} />
                      </Flex>
                    </Flex>
                  </PageContent>
                </PageContainer>
              </Form>
            )}
          </>
        )
      }}
    </Formik>
  )
}

export default UserForm
