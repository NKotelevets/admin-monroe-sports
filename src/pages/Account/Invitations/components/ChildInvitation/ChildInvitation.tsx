import { notification, Spin } from 'antd'
import { Formik } from 'formik'
import { ReactElement, useEffect, useState } from 'react'

import { childFlowSchema } from '@/pages/Account/Invitations/components/ChildInvitation/validation.tsx'

import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useSendInviteMutation } from '@/redux/account/account.api.ts'

import { useInvitation } from '@/hooks/useInvitation.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { TChildFlowForm, TInviteProps, TSendInvitePayload } from '@/common/types/account.ts'
import { LoadingOutlined } from '@ant-design/icons'
import { transformKeysToCamelCase } from '@/utils'

const {
  Styles: { Title, Subtitle, FormStyled, LargeButton, Body },
} = Layout

/**
 * ChildInvitation component.
 *
 * A React component that facilitates the process of submitting a parent's or guardian's email
 * when the user is under 16 years old. This component includes a form with appropriate validation
 * and handles the logic for sending an invitation to a supervisor.
 *
 * @returns {ReactElement} Returns a ReactElement for rendering the ChildInvitation component.
 */
export const ChildInvitation = (props: TInviteProps): ReactElement => {
  const { invite: _invite } = props
  const { invitation: _invitation, userData: user, nextStep } = useInvitation()

  const [sendInvite, { isLoading }] = useSendInviteMutation()
  const [api, contextHolder] = notification.useNotification()
  const [invite, setInvite] = useState(_invite)

  const initialValues: TChildFlowForm = {
    email: '',
  }

  useEffect(() => {
    if(_invitation) {
      setInvite(transformKeysToCamelCase(_invitation))
    }
  }, [_invitation])

  /**
   * Handles form submission to send an invitation to a supervisor.
   *
   * @param {TChildFlowForm} values - Form values submitted by the user, including the email address.
   */
  const onSubmit = (values: TChildFlowForm): void => {
    const payload: TSendInvitePayload = {
      inviteType: INVITE_TYPE_NAMED.SUPERVISOR,
      teamId: invite?.team?.id || undefined,
      emails: [values.email],
      childrenIds: [user!.id],
    }

    sendInvite(payload)
      .unwrap()
      .then(() => {
        nextStep()
      })
      .catch((error) => {
        api.error({
          message: 'Something went wrong',
          description:
            error?.details || error?.detail || 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }


  if (isLoading || !invite)
    return (
      <Body centered>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Body>
    )

  return (
    <>
      {contextHolder}
      <Title>Welcome to {invite.team?.name || 'team'}</Title>
      <Subtitle small>You are under 16 years old. Please submit your Parent/Guardian’s email</Subtitle>
      <Formik
        validateOnMount
        validateOnChange
        initialValues={initialValues}
        validationSchema={childFlowSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, handleChange, handleBlur, touched, handleSubmit, isValid }) => (
          <FormStyled autoComplete="new" onSubmit={handleSubmit}>
            <TextInput
              preset="app"
              type="email"
              name="email"
              label="Parent/Guardian’s email"
              value={values.email}
              placeholder="Enter Parent/Guardian’s email here"
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
            />
            <LargeButton loading={isLoading} type="primary" htmlType="submit" disabled={!isValid}>
              Continue
            </LargeButton>
          </FormStyled>
        )}
      </Formik>
    </>
  )
}
