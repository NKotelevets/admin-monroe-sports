import { CalendarOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Checkbox, DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useFormikContext } from 'formik'
import { ReactElement } from 'react'
import { ReactSVG } from 'react-svg'

import InputWrapper from '@/components/Inputs/InputWrapper.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { Link } from '@/components/Link.tsx'

import { Layout } from '@/layouts/PublicLayout'

import { colors } from '@/utils/colors.tsx'

import { PATH_TO_PRIVACY, PATH_TO_TERMS } from '@/common/constants/paths.ts'

import ArrowDown from '@/assets/icons/arrow-down.svg'
import { TConfirmUserDataForm } from '@/pages/Account/ConfirmUserData/ConfirmUserData.tsx'

const {
  Styles: { LargeButton },
} = Layout

export const ConfirmUserDataForm = ({ isLoading, isPlayer }: { isLoading: boolean, isPlayer?: boolean }): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur, isValid, setFieldValue, handleSubmit } = useFormikContext<TConfirmUserDataForm>()
  const isUnder16 = dayjs().diff(dayjs(values.dateOfBirth, 'YYYY-MM-DD'), 'years') < 16

  const onsubmit = async (type: 'player' | 'guardian' | 'staff') => {
    await setFieldValue('type', type)
    handleSubmit()
  }

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
        error={touched.gender ? errors.gender : undefined}
      >
        <Select
          placeholder="Select gender"
          variant="borderless"
          style={styles.select}
          suffixIcon={<ReactSVG src={ArrowDown} style={{ marginRight: 10 }} />}
          options={[
            { label: 'Male', value: '1' },
            { label: 'Female', value: '0' },
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
      {isPlayer && (
        <>
          <Button loading={isLoading} type="primary" onClick={() => onsubmit('player')} disabled={!isValid}>
            Confirm As Player Info
          </Button>
          <Button loading={isLoading} danger onClick={() => onsubmit('guardian')} disabled={!isValid || isUnder16}>
            Confirm As Guardian Info
          </Button>
        </>
      )}

      {!isPlayer && (
        <Button loading={isLoading} type="primary" onClick={() => onsubmit('staff')} disabled={!isValid}>
          Confirm
        </Button>
      )}
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
// Styled Components
const CheckboxStyled = styled(Checkbox)`
  width: 100%;
  align-self: flex-start;
  text-align: left;
  display: flex;
  margin-bottom: 24px;
  margin-top: 24px;
`
