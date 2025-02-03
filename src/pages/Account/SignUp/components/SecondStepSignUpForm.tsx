import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useFormikContext } from 'formik'
import { ReactElement } from 'react'

import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { colors } from '@/utils/colors.tsx'
import { TSignUpForm } from '@/pages/Account/SignUp/types.ts'

const {
  Styles: { LargeButton },
} = Layout

export const SecondStepSignUpForm = ({ isLoading }: { isLoading: boolean }): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur, isValid } = useFormikContext<TSignUpForm>()

  const renderEyeIcon = (visible: boolean) =>
    visible ? <EyeOutlined style={styles.icon} /> : <EyeInvisibleOutlined style={styles.icon} />

  return (
    <Fields>
      <TextInput
        preset="app"
        name="firstName"
        label="First name"
        value={values.firstName}
        placeholder="Enter first name"
        onChange={handleChange('firstName')}
        onBlur={handleBlur('firstName')}
        error={touched.firstName ? errors.firstName : undefined}
      />
      <TextInput
        preset="app"
        name="lastName"
        label="Last name"
        value={values.lastName}
        placeholder="Enter last name"
        onChange={handleChange('lastName')}
        onBlur={handleBlur('lastName')}
        error={touched.lastName ? errors.lastName : undefined}
      />
      <TextInput
        preset="app"
        name="dateOfBirth"
        label="Date of birth"
        value={values.dateOfBirth}
        placeholder="Enter date of bitrh"
        onChange={handleChange('dateOfBirth')}
        onBlur={handleBlur('dateOfBirth')}
        error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
      />
      <TextInput
        preset="app"
        name="gender"
        label="Gender"
        value={values.gender}
        placeholder="Enter gender"
        onChange={handleChange('gender')}
        onBlur={handleBlur('gender')}
        error={touched.gender ? errors.gender : undefined}
      />
      <TextInput
        preset="app"
        type="number"
        name="zipCode"
        label="Zip code"
        value={values.zipCode}
        placeholder="Enter zip code"
        onChange={handleChange('zipCode')}
        onBlur={handleBlur('zipCode')}
        error={touched.zipCode ? errors.zipCode : undefined}
      />
      <TextInput
        preset="app"
        type="password"
        name="password"
        label="Password"
        value={values.password}
        placeholder="Enter password"
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        error={touched.password ? errors.password : undefined}
        iconRender={renderEyeIcon}
      />
      <TextInput
        preset="app"
        type="password"
        name="confirmPassword"
        label="Confirm password"
        value={values.confirmPassword}
        placeholder="Enter confirm password"
        onChange={handleChange('confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        iconRender={renderEyeIcon}
      />
      <Button loading={isLoading} type="primary" htmlType="submit" disabled={!isValid}>
        Continue
      </Button>
    </Fields>
  )
}

const styles = {
  icon: {
    fontSize: 22,
    color: colors.blackText,
  },
}

const Fields = styled.div`
  margin-bottom: 144px;
`

const Button = styled(LargeButton)`
  margin-top: 24px;
`
