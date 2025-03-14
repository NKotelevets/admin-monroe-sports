import { notification } from 'antd'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FirstStepSignUpForm } from '@/pages/Account/SignUp/components/FirstStepSignUpForm.tsx'
import { SecondStepSignUpForm } from '@/pages/Account/SignUp/components/SecondStepSignUpForm.tsx'
import { TSignUpForm } from '@/pages/Account/SignUp/types.ts'
import { signUpSchema } from '@/pages/Account/SignUp/validation.ts'

import { Layout } from '@/layouts/PublicLayout'

import { useSignUpMutation } from '@/redux/account/account.api.ts'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'

import { PATH_TO_ACCOUNT_INVITATIONS } from '@/common/constants/paths.ts'
import { useCookies } from '@/hooks/useCookies.ts'

const {
  Page,
  Styles: { Title, Subtitle, FormStyled, Body },
} = Layout

/**
 * SignUp component for user registration flow.
 *
 * @return {JSX.Element} Rendered SignUp component.
 */
const SignUp = () => {
  const { updateTokens } = useAuthSlice()
  const { token, accepted: acceptedString } = useParams<{ token: string; accepted?: string }>()
  const { createCookie } = useCookies()

  const navigate = useNavigate()

  const [signUp, { isLoading }] = useSignUpMutation()
  const [formStep, setFormStep] = useState(1)
  const [api, contextHolder] = notification.useNotification()
  const [accepted, setAccepted] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (acceptedString) {
      const _accepted = acceptedString?.split('?')[0]?.split('&')[0]
      setAccepted(_accepted === 'undefined' || _accepted === undefined ? undefined : _accepted === 'true')
    }
  }, [acceptedString])

  /**
   * Handles browser back-button navigation for specific form steps.
   * - Prevents default back navigation when the form is on a specified step.
   * - Adjusts the form step and updates the browser's history state.
   * - Cleans up by removing the event listener on unmount.
   *
   * @returns {Function} Cleanup function to remove the popstate event listener.
   */
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (formStep === 2) {
        setFormStep(1)
        window.history.pushState(null, '', window.location.href)
        event.preventDefault()
      }
    }

    if (formStep > 1) {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [formStep])

  const initialValues: TSignUpForm = {
    email: '',
    terms: false,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
  }

  /**
   * Represents a collection of pages, where each page is identified by a numeric ID and contains a title.
   * The record keys correspond to page numbers, and the values are objects containing the page metadata.
   *
   * @type {Record<number, { title: string }>}
   */
  const page: Record<number, { title: string }> = {
    1: { title: 'Let’s get started' },
    2: { title: 'Welcome to Schedule World!' },
  }

  /**
   * Callback function to handle the form submission.
   * @function
   * @name onSubmit
   * @param {TSignUpForm} values - The values submitted through the form.
   * @returns {void}
   */
  const onSubmit = (values: TSignUpForm): void => {
    const { dateOfBirth, ...rest } = values || { dateOfBirth: '' }
    const payload = {
      ...rest,
      birthDate: dateOfBirth,
    }

    signUp(payload)
      .unwrap()
      .then((response) => {
        const data = response

        updateTokens({
          access: data.tokens.access,
          refresh: data.tokens.refresh,
        })

        createCookie('refreshToken_onboarding', data.tokens.access)
        createCookie('refreshToken_onboarding', data.tokens.refresh)

        if (token) {
          const acceptedValue = typeof accepted === 'boolean' ? `/${accepted}` : ''
          navigate(`${PATH_TO_ACCOUNT_INVITATIONS}/${token}${acceptedValue}`)
        } else {
          navigate(PATH_TO_ACCOUNT_INVITATIONS)
        }
      })
      .catch((error) => {
        api.error({
          message: 'Something went wrong',
          description: error?.data?.details || 'Please, try again. If the problem persists, contact support.',
          placement: 'bottomRight',
        })
      })
  }

  return (
    <Page>
      <Body>
        {contextHolder}
        <Title>{page[formStep].title}</Title>
        <Subtitle>Create your account.</Subtitle>
        <Formik
          validateOnMount
          validateOnChange
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <FormStyled autoComplete="new" onSubmit={handleSubmit}>
              {formStep === 1 && <FirstStepSignUpForm setStep={setFormStep} />}
              {formStep === 2 && <SecondStepSignUpForm isLoading={isLoading} />}
            </FormStyled>
          )}
        </Formik>
      </Body>
    </Page>
  )
}

export default SignUp
