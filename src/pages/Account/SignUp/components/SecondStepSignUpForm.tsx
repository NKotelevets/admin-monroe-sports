import { CalendarOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useFormikContext } from 'formik'
import { ReactElement } from 'react'
import { ReactSVG } from 'react-svg'

import { TSignUpForm } from '@/pages/Account/SignUp/types.ts'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { colors } from '@/utils/colors.tsx'

import ArrowDown from '@/assets/icons/arrow-down.svg'

const {
  Styles: { LargeButton },
} = Layout

export const SecondStepSignUpForm = ({ isLoading }: { isLoading: boolean }): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur, isValid, setFieldValue } = useFormikContext<TSignUpForm>()

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
      <InputWrapper
        preset="app"
        label="Gender"
        errorPosition="top"
        error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
      >
        <Select
          placeholder="Outlined"
          variant="borderless"
          style={styles.select}
          suffixIcon={<ReactSVG src={ArrowDown} style={{ marginRight: 10 }} />}
          options={[
            { label: 'Male', value: '0' },
            { label: 'Female', value: '1' },
            { label: 'Other', value: '2' },
          ]}
          value={values.gender}
          onChange={(value) => {
            setFieldValue('gender', value)
          }}
        />
      </InputWrapper>
      <TextInput
        preset="app"
        maxLength={5}
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
      <div style={styles.helpText}>
        Password must have at least 8 characters, one lowercase letter, one uppercase letter, one special character and
        at least one digit
      </div>
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
  helpText: {
    lineHeight: 1.3,
    fontSize: 12,
    textAlign: 'left' as const,
    color: colors.dim,
    marginBottom: 14,
  },
  select: {
    backgroundColor: 'rgb(245, 244, 244)',
    width: '100%',
    borderRadius: 8,
    height: 52,
    paddingLeft: 6,
    fontSize: 16,
  },
}

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
const Fields = styled.div`
  margin-bottom: 144px;
`
const Button = styled(LargeButton)`
  margin-top: 24px;
`
const CalendarIcon = styled(CalendarOutlined)`
  color: ${colors.blackText};
  font-size: 24px;
`
