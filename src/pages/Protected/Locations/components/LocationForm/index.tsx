import { Flex } from 'antd'
import { Form, Formik, FormikHelpers } from 'formik'

import { locationFormValidateSchema } from '@/pages/Protected/Locations/components/LocationForm/validation.ts'

import { CancelButton, Line, MainContainer, PageContent, ProtectedPageSubtitle } from '@/components/Elements'
import { GoogleAutocompleteInput } from '@/components/Inputs/GoogleAutocompleteInput.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import MonroeButton from '@/components/MonroeButton.tsx'

import { locationInitialValues } from '@/common/constants/location.ts'
import { IFormProps } from '@/common/interfaces'
import { TLocationForm } from '@/common/types/location.ts'

export const LocationForm = (props: IFormProps<TLocationForm, TLocationForm>) => {
  const { initialValues, validationSchema, isEditing, onSubmit, goBack, isLoading } = props

  const handleSubmit = (values: TLocationForm, formikHelpers?: FormikHelpers<TLocationForm>) => {
    onSubmit(values, formikHelpers)
  }

  return (
    <Formik
      initialValues={initialValues || locationInitialValues}
      validationSchema={validationSchema || locationFormValidateSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({ values, handleChange, handleSubmit, errors, handleBlur, touched, isValid, dirty, setFieldValue }) => {
        return (
          <Form onSubmit={handleSubmit} autoComplete="off" className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main info</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <TextInput
                    name="name"
                    label="Location name *"
                    placeholder='Enter location name'
                    value={values.name}
                    onChange={handleChange('name')}
                    error={touched.name ? errors.name : undefined}
                    onBlur={handleBlur('name')}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Address</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <GoogleAutocompleteInput
                    name="address"
                    label="Address *"
                    initialValue={values.address}
                    placeholder="Enter address"
                    error={touched.address ? errors.address : undefined}
                    onChange={(result) => {
                      setFieldValue('address', result.address, true)
                      setFieldValue('zipCode', result.postalCode, true)
                      setFieldValue('state', result.state, true)
                      setFieldValue('city', result.city, true)
                      setFieldValue('latitude', Math.round(result.lat * 1e6) / 1e6, true)
                      setFieldValue('longitude', Math.round(result.lng * 1e6) / 1e6, true)
                    }}
                  />

                  <TextInput
                    name="zipCode"
                    label="Zip Code"
                    disabled
                    maxLength={5}
                    value={values.zipCode}
                    onChange={handleChange('zipCode')}
                    error={touched.zipCode ? errors.zipCode : undefined}
                    onBlur={handleBlur('zipCode')}
                  />
                  <TextInput
                    name="state"
                    label="State"
                    disabled
                    value={values.state}
                    onChange={handleChange('state')}
                    error={touched.state ? errors.state : undefined}
                    onBlur={handleBlur('state')}
                  />
                  <TextInput
                    name="city"
                    label="City"
                    disabled
                    value={values.city}
                    onChange={handleChange('city')}
                    error={touched.city ? errors.city : undefined}
                    onBlur={handleBlur('city')}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40" />
                <Flex>
                  <CancelButton type="default" onClick={goBack}>
                    Cancel
                  </CancelButton>

                  <MonroeButton
                    type="primary"
                    className="h-40"
                    isLoading={isLoading}
                    isDisabled={(isEditing && !dirty) || !isValid}
                    label="Create Location"
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
