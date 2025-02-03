import { notification } from 'antd'
import { Formik } from 'formik'
import { ReactElement, useState } from 'react'

import { ParenInviteSent } from '@/pages/Account/Invitations/ChildInvitation/ParentInviteSent.tsx'
import { childFlowSchema } from '@/pages/Account/Invitations/ChildInvitation/validation.tsx'

import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { useSendInviteMutation } from '@/redux/account/account.api'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { TChildFlowForm, TInviteProps, TSendInvitePayload } from '@/common/types/account.ts'

const {
  Styles: { Title, Subtitle, FormStyled, LargeButton },
} = Layout

/**
 * ChildInvitation component.
 *
 * A React component that facilitates the process of submitting a parent's or guardian's email
 * when the user is under 16 years old. This component includes a form with appropriate validation
 * and handles the logic for sending an invitation to a supervisor.
 *
 * @param {TInviteProps} props - The properties passed to the component, including invite details.
 * @returns {ReactElement} Returns a JSX.Element for rendering the ChildInvitation component.
 */
export const ChildInvitation = (props: TInviteProps): ReactElement => {
  const { invite } = props
  const { user } = useUserSlice()

  const [sendInvite, { isLoading }] = useSendInviteMutation()
  const [inviteSent, setInviteSent] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  const initialValues: TChildFlowForm = {
    email: '',
  }

  /**
   * Handles form submission to send an invitation to a supervisor.
   *
   * @param {TChildFlowForm} values - Form values submitted by the user, including the email address.
   */
  const onSubmit = (values: TChildFlowForm): void => {
    const payload: TSendInvitePayload = {
      inviteType: INVITE_TYPE_NAMED.SUPERVISOR,
      teamId: invite.team!.id,
      emails: [values.email],
      childrenIds: [user!.id],
    }

    sendInvite(payload)
      .unwrap()
      .then(() => setInviteSent(true))
      .catch((error) => {
        setInviteSent(false)
        api.error({
          message: 'Something went wrong',
          description:
            error?.details || error?.detail || 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }

  if (inviteSent) {
    return <ParenInviteSent />
  }

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
