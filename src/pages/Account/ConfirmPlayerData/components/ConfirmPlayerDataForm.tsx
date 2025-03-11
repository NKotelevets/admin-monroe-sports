import { CalendarOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useFormikContext } from 'formik'
import { ReactElement } from 'react'

import { TConfirmPlayerDataForm } from '@/pages/Account/ConfirmPlayerData/ConfirmPlayerData.tsx'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { colors } from '@/utils/colors.tsx'

const {
  Styles: { LargeButton },
} = Layout

export const ConfirmPlayerDataForm = ({ isLoading }: { isLoading: boolean }): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur, isValid, setFieldValue, handleSubmit } =
    useFormikContext<TConfirmPlayerDataForm>()

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
        name="suffix"
        label="Suffix"
        value={values.suffix}
        placeholder="Enter suffix"
        onChange={handleChange('suffix')}
        onBlur={handleBlur('suffix')}
        error={touched.suffix ? errors.suffix : undefined}
      />
      <InputWrapper
        preset="app"
        label="Date of birth"
        errorPosition="top"
        error={touched.birthDate ? errors.birthDate : undefined}
      >
        <Date
          variant="borderless"
          suffixIcon={<CalendarIcon />}
          format="MM/DD/YYYY"
          placeholder="Select date"
          value={values.birthDate ? dayjs(values.birthDate, 'YYYY-MM-DD') : null}
          onChange={(value: unknown) => {
            setFieldValue('birthDate', value ? (value as Dayjs).format('YYYY-MM-DD') : null)
          }}
          status={touched.birthDate && errors.birthDate ? 'error' : undefined}
        />
      </InputWrapper>
      <TextInput
        preset="app"
        name="email"
        label="Email (optional)"
        value={values.email}
        placeholder="Enter email"
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
      />
      <Button loading={isLoading} type="primary" onClick={() => handleSubmit()} disabled={!isValid}>
        Save & Continue
      </Button>
    </Fields>
  )
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
