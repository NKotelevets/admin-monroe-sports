import { Divider } from 'antd'
import Flex from 'antd/es/flex'
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'
import { Form, Formik, FormikConfig, FormikHelpers } from 'formik'
import {
  ICreateUserFormValues,
  userInitialFormData,
  userValidationSchema
} from '@/pages/Protected/Users/constants/formik'

import {
  CancelButton,
  MainContainer,
  MonroeDatePicker,
  OptionTitle,
  PageContent,
  ProtectedPageSubtitle
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeSelect from '@/components/MonroeSelect'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { validateNumber } from '@/utils'

import {
  COACH_ROLE,
  HEAD_COACH_ROLE,
  MASTER_ADMIN_ROLE,
  OPERATOR_ROLE,
  PLAYER_ROLE,
  TEAM_ADMIN_ROLE
} from '@/common/constants'
import { ICreateUserAsAdmin, IRole } from '@/common/interfaces/user'
import { TGender, TRole } from '@/common/types'

import { IFERole } from '@/common/interfaces/role.ts'
import { ReactElement, useCallback } from 'react'
import CreateOperator from '@/pages/Protected/Users/components/CreateOperator.tsx'
import { AccordionRoleList } from './AccordionRoleList'

const ROLES_WITH_TEAMS: TRole[] = [HEAD_COACH_ROLE, COACH_ROLE, PLAYER_ROLE, TEAM_ADMIN_ROLE]
const GENDER_OPTIONS: DefaultOptionType[] = [
  { label: 'Female', value: 1 },
  { label: 'Male', value: 2 },
  { label: 'Other', value: 3 }
]

interface IUserFormProps {
  validationSchema?: FormikConfig<ICreateUserFormValues>['validationSchema']
  initialValues?: ICreateUserFormValues

  onSubmit(body: ICreateUserAsAdmin): void

  goBack(): void
}

/**
 * UserForm Component
 *
 * Renders a user form for creating or editing a user with fields for main info, contact info, and role.
 * Supports both standard user creation and operator creation depending on the user context.
 *
 * @param {IUserFormProps} props - The component props.
 * @param {function} props.validationSchema - A custom schema to validate the form. if undefined, schema for creating
 *   users will be used instead.
 * @param {function} props.initialValues - Values to fill the form. If undefined, the form will be considered new.
 * @param {function} props.onSubmit - Callback function invoked on form submission.
 *   Receives an `ICreateUserAsAdminRequestBody` object containing the form data.
 * @param {function} props.goBack - Callback function to navigate back to the previous page.
 *
 * @returns {ReactElement} The rendered UserForm component.
 *
 * @component
 *
 * @example
 * // Example usage:
 * <UserForm
 *   onSubmit={(formData) => handleCreateUser(formData)}
 *   goBack={() => navigateBack()}
 * />
 *
 * Form Logic:
 * - If `showOperatorScreen` is true, the `CreateOperator` form is displayed.
 * - On form submission, calls the `onSubmit` prop with the form data.
 * - Provides "Cancel" and "Create User" buttons for user action.
 */
const UserForm = (props: IUserFormProps): ReactElement => {
  const {
    validationSchema,
    initialValues,
    onSubmit,
    goBack
  } = props
  const { showOperatorScreen } = useUserSlice()

  const isNew = initialValues === undefined
  const pageTitle = isNew ? `Create User` : `Edit User`

  const handleSubmit = useCallback(
    async (values: ICreateUserFormValues, formikHelpers: FormikHelpers<ICreateUserFormValues>) => {
      const result = await formikHelpers.validateForm(values)

      if (Object.keys(result).length) return

      const {
        gender,
        roles,
        birthDate,
        phoneNumber,
        zipCode
      } = values

      const finalValues = {
        ...values,
        gender: gender ? (parseInt(gender) - 1 as TGender) : 2,
        roles: formatUserRoles(roles),
        birthDate: birthDate ? dayjs(birthDate).format('YYYY-MM-DD') : undefined,
        phoneNumber: phoneNumber || undefined,
        zipCode: zipCode || undefined
      } as ICreateUserAsAdmin

      onSubmit(finalValues)
    },
    []
  )

  return (
    <Formik
      initialValues={initialValues || userInitialFormData}
      validationSchema={validationSchema || userValidationSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({
          values,
          handleChange,
          handleSubmit,
          errors,
          setFieldValue,
          handleBlur,
          touched,
          dirty
        }) => {

        // returns operator form and updates field on creation
        if (showOperatorScreen) return <CreateOperator />

        return (
          <Form onSubmit={handleSubmit}>
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
                      disabled={!isNew}
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
                      disabled={!isNew}
                    />
                  </div>

                  <Flex vertical justify="flex-start" className="w-full mg-b8">
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
                      disabled={!isNew}
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
                      disabled={!isNew}
                    />
                  </Flex>
                </MainContainer>
              </Flex>

              <Divider />

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
                      disabled={!isNew}
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
                      disabled={!isNew}
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
                      disabled={!isNew}
                    />
                  </div>
                </MainContainer>
              </Flex>

              <Divider />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Role</ProtectedPageSubtitle>
                </div>

                <MainContainer>
                  <AccordionRoleList />
                </MainContainer>
              </Flex>

              <Divider />

              <Flex>
                <div className="f-40" />
                <Flex>
                  <CancelButton type="default" onClick={goBack}>
                    Cancel
                  </CancelButton>

                  <MonroeButton
                    className="h-40"
                    type="primary"
                    isDisabled={!dirty}
                    label={pageTitle}
                    onClick={handleSubmit}
                  />
                </Flex>
              </Flex>
            </PageContent>
          </Form>
        )
      }}
    </Formik>
  )
}

/**
 * Formats an array of user role objects to a standardized role format for user creation.
 *
 * - Roles with teams (included in `ROLES_WITH_TEAMS`) are mapped to a list of role objects,
 *   each including the role name and a specific `team_id`.
 * - If the role matches `MASTER_ADMIN_ROLE`, it is formatted as a master admin role.
 * - For the `OPERATOR_ROLE`, the resulting object includes both `role` and an `operator_id`.
 *
 * @param userRoles - An array of user role objects (`IFERole[]`), each containing a role
 *                    name and linked entities (teams or operators).
 *
 * @returns An array of formatted role objects (`IRole[]`) with each object structured according
 *          to its specific role requirements, filtered to include only those with a valid `role` name.
 */
function formatUserRoles(userRoles: IFERole[]) {
  return userRoles.flatMap((role) => {
    if (ROLES_WITH_TEAMS.includes(role.name as TRole)) {
      return role!.linkedEntities!.map(
        (linkedEntity) =>
          ({
            role: role.name,
            team_id: linkedEntity.id
          }) as IRole
      )
    }

    if (role.name === MASTER_ADMIN_ROLE) {
      return {
        role: 'Swift Schedule Master Admin'
      } as unknown as IRole
    }

    if (role.name === OPERATOR_ROLE) {
      return {
        role: role.name,
        operator_id: role.linkedEntities?.[0].id
      } as IRole
    }

    return {
      role: role.name
    } as IRole
  })
    .filter((r) => r.role)
}

export default UserForm
