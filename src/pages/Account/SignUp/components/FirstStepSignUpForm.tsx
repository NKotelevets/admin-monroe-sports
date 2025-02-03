import styled from '@emotion/styled'
import { Checkbox } from 'antd'
import { useFormikContext } from 'formik'
import React, { ReactElement, useMemo } from 'react'

import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { PATH_TO_ACCOUNT_LOGIN, PATH_TO_PRIVACY, PATH_TO_TERMS } from '@/common/constants/paths.ts'
import { TSignUpForm } from '@/pages/Account/SignUp/types.ts'

type TFirstStepSignUpFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

const {
  Styles: { LargeButton, Text },
} = Layout

export const FirstStepSignUpForm = (props: TFirstStepSignUpFormProps): ReactElement => {
  const { setStep } = props
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<TSignUpForm>()

  const isStepOneValid = useMemo(
    () => values.terms && !!values.email && !errors.email && !errors.terms,
    [values.terms, values.email, errors.email, errors.terms],
  )

  return (
    <>
      <TextInput
        preset="app"
        type="email"
        name="email"
        label="Email"
        value={values.email}
        placeholder="Enter email"
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
      />
      <CheckboxStyled
        name="terms"
        checked={values.terms}
        onChange={(value) => {
          setFieldValue('terms', value.target.checked)
        }}
      >
        I accept the{' '}
        <Link target="_blank" underline to={PATH_TO_TERMS}>
          Terms of use
        </Link>{' '}
        and{' '}
        <Link target="_blank" underline to={PATH_TO_PRIVACY}>
          Privacy policy
        </Link>
      </CheckboxStyled>

      <LargeButton loading={false} type="primary" onClick={() => setStep(2)} disabled={!isStepOneValid}>
        Continue
      </LargeButton>
      <Text>
        Already have an account?{' '}
        <Link to={PATH_TO_ACCOUNT_LOGIN} underline>
          Sign In
        </Link>
      </Text>
    </>
  )
}

// Styled Components
const CheckboxStyled = styled(Checkbox)`
  width: 100%;
  align-self: flex-start;
  text-align: left;
  display: flex;
  margin-bottom: 24px;
  margin-top: 24px;
`
