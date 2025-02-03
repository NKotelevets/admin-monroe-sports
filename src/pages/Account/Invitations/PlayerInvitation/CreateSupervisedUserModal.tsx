import { CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, DatePicker, Flex, Modal, Row, notification } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { Formik, FormikHelpers } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'

import { ImageUploadField } from '@/pages/Account/Invitations/PlayerInvitation/ImageUploadField.tsx'
import { addFamilyMemberSchema } from '@/pages/Account/Invitations/PlayerInvitation/validation.ts'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useCreateSupervisedUserMutation } from '@/redux/account/account.api.ts'

import { useFieldErrors } from '@/hooks/useFieldErrors.ts'

import { colors } from '@/utils/colors.tsx'

import { IChildren } from '@/common/interfaces/user.ts'
import { TCreateSupervisedUserForm, TCreateSupervisedUserPayload } from '@/common/types/account.ts'

const {
  Styles: { Title, FormStyled, LargeButton },
} = Layout

type TCreateSupervisedUserModalProps = {
  setCreatedSupervisedUsers: React.Dispatch<React.SetStateAction<IChildren[] | null>>
}

/**
 * Represents a React functional component for creating a modal form to add supervised users.
 *
 * This component provides a modal interface for filling out and submitting a form to create
 * new supervised users (athletes). It handles form validation, API interactions for user creation,
 * and user feedback through notifications.
 *
 * The modal form includes fields for user's first name, last name, date of birth, zip code,
 * and optionally an email address. Additionally, it allows uploading an image for the user.
 *
 * The component includes interactivity such as opening and closing the modal, providing
 * error feedback, and indicating submission progress.
 *
 * @param {TCreateSupervisedUserModalProps} props - The component properties.
 * @return {ReactElement} A modal component for adding supervised users.
 */
export const CreateSupervisedUserModal = (props: TCreateSupervisedUserModalProps): ReactElement => {
  const { setCreatedSupervisedUsers } = props
  const { nonFieldErrors, handleErrors } = useFieldErrors(false)

  const [createUser, { isLoading }] = useCreateSupervisedUserMutation()
  const [api, contextHolder] = notification.useNotification()
  const [isModalOpened, setIsModalOpened] = useState(false)

  const initialValues: TCreateSupervisedUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: null,
    photoS3Url: null,
    zipCode: '',
  }

  /**
   * Handles and displays API error messages based on the `nonFieldErrors` input.
   *
   * If `nonFieldErrors` exists, determines the appropriate error message to display.
   * Utilizes `api.error` to show an error notification with a specified message,
   * description, and placement.
   *
   * @function
   * @param {boolean | string | string[]} nonFieldErrors - Represents error information,
   * allowing either a boolean, a single string message, or an array of string messages.
   */
  useEffect(() => {
    if (!nonFieldErrors) return
    const message = typeof nonFieldErrors === 'string' ? nonFieldErrors : nonFieldErrors?.[0]

    api.error({
      message: message || 'Something went wrong',
      description: 'Please, try again. If the problem persists, contact support.',
      placement: 'bottomRight',
    })
  }, [nonFieldErrors])

  /**
   * Handles form submission for creating a supervised user.
   *
   * @param {TCreateSupervisedUserForm} values - The form values containing user details.
   * @param {FormikHelpers<TCreateSupervisedUserForm>} formikHelpers - Helper methods provided by Formik, including `setErrors`.
   * @returns {void}
   */
  const onSubmit = (
    values: TCreateSupervisedUserForm,
    { setErrors }: FormikHelpers<TCreateSupervisedUserForm>,
  ): void => {
    const payload: TCreateSupervisedUserPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      birthDate: values.dateOfBirth ? (values.dateOfBirth as string) : '',
      zipCode: values.zipCode,
      systemRole: 0,
    }

    createUser(payload)
      .unwrap()
      .then((response) => {
        setCreatedSupervisedUsers((prevState) => [...(prevState || []), response as IChildren])
        setIsModalOpened(false)
      })
      .catch(handleErrors(setErrors))
      .catch((error) => {
        api.error({
          message: error?.details || error?.detail || 'Something went wrong',
          description: 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }

  return (
    <>
      {contextHolder}
      <Btn type="default" onClick={() => setIsModalOpened(true)} icon={<PlusCircleOutlined />}>
        Add Athlete
      </Btn>
      <ModalStyled destroyOnClose centered closable={false} open={isModalOpened} footer={[]}>
        <Formik
          validateOnMount
          validateOnChange
          validateOnBlur
          initialValues={initialValues}
          validationSchema={addFamilyMemberSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, handleChange, handleBlur, touched, handleSubmit, setFieldValue, isValid }) => (
            <FormStyled autoComplete="new" onSubmit={handleSubmit}>
              <ModalTitle>Player info</ModalTitle>

              <ImageUploadField />

              <TextInput
                preset="app"
                type="firstName"
                name="firstName"
                label="First name"
                value={values.firstName}
                placeholder="Enter player's first name"
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={touched.firstName ? errors.firstName : undefined}
              />

              <TextInput
                preset="app"
                type="lastName"
                name="lastName"
                label="Last name"
                value={values.lastName}
                placeholder="Enter player's last name"
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={touched.lastName ? errors.lastName : undefined}
              />

              <InputWrapper
                preset="app"
                label="Date of birth"
                errorPosition="top"
                error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
              >
                <Date
                  variant="borderless"
                  suffixIcon={<CalendarIcon />}
                  format="MM/DD/YYYY"
                  placeholder="Select date"
                  value={values.dateOfBirth ? dayjs(values.dateOfBirth, 'YYYY-MM-DD') : null}
                  onChange={(value: unknown) => {
                    setFieldValue('dateOfBirth', value ? (value as Dayjs).format('YYYY-MM-DD') : null)
                  }}
                  status={touched.dateOfBirth && errors.dateOfBirth ? 'error' : undefined}
                />
              </InputWrapper>

              <TextInput
                preset="app"
                type="text"
                name="zipCode"
                label="Zip code"
                maxLength={5}
                value={values.zipCode}
                placeholder="Enter zip code"
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '')
                  setFieldValue('zipCode', numericValue)
                }}
                onBlur={handleBlur('zipCode')}
                error={touched.zipCode ? errors.zipCode : undefined}
              />

              <TextInput
                preset="app"
                type="email"
                name="email"
                label="Email (optional)"
                value={values.email || ''}
                placeholder="Enter the player email here"
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : undefined}
              />
              <HelpText>
                <span>Note</span>: if the player does not have an email, leave the input empty.
              </HelpText>

              <ActionRow vertical gap={12}>
                <Row>
                  <LargeButton loading={isLoading} type="primary" htmlType="submit" disabled={!isValid || isLoading}>
                    Add Player
                  </LargeButton>
                </Row>
                <Row>
                  <LargeButton danger disabled={isLoading} onClick={() => setIsModalOpened(false)}>
                    Cancel
                  </LargeButton>
                </Row>
              </ActionRow>
            </FormStyled>
          )}
        </Formik>
      </ModalStyled>
    </>
  )
}

// Styled Components
const Btn = styled(Button)`
  width: auto;
  height: 48px;
  align-self: flex-start;
  color: ${colors.secondary};
  border: 1px solid ${colors.secondary} !important;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 10px 16px !important;
  font-size: 16px;

  &:hover {
    border: 1px solid ${colors.primary} !important;
  }

  & svg {
    width: auto !important;
  }
`
const ModalStyled = styled(Modal)`
  width: 600px !important;
  min-width: 300px !important;

  & .ant-modal-content {
    padding: 10px !important;
    border-radius: 8px !important;
  }

  & .ant-modal-content .ant-btn {
    border-radius: 8px !important;
  }

  @media (max-width: 768px) {
    width: 90% !important;
    & .ant-modal-content {
      padding: 16px !important;
    }
  }
`

const ModalTitle = styled(Title)`
  font-weight: 600 !important;
  font-size: 24px !important;
  margin-bottom: 24px !important;
  margin-top: 30px !important;

  @media (max-width: 768px) {
    margin-top: 16px !important;
    margin-bottom: 16px !important;
  }
`
const HelpText = styled.div`
  font-size: 14px;
  color: ${colors.dim};
  position: relative;
  top: -8px;
  max-width: 60%;

  & span {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`
const ActionRow = styled(Flex)`
  margin: 32px 0 40px;
`
const Date = styled(DatePicker)`
  width: 100%;
  border-radius: 8px;
  padding: 25px 16px;
  border: 1px solid transparent;
  background-color: rgb(245, 244, 244);
  color: ${colors.blackText} !important;
  font-size: 16px !important;

  & input {
    color: ${colors.blackText} !important;
    font-size: 16px !important;
  }
`
const CalendarIcon = styled(CalendarOutlined)`
  color: ${colors.blackText};
  font-size: 24px;
`
