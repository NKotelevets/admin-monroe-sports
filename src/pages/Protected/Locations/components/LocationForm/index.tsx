import { Flex } from 'antd'
import { Form, Formik, FormikHelpers } from 'formik'

import { locationFormValidateSchema } from '@/pages/Protected/Locations/components/LocationForm/validation.ts'

import { CancelButton, Line, MainContainer, PageContent, ProtectedPageSubtitle } from '@/components/Elements'
import { GoogleAutocompleteInput, TResultValueProps } from '@/components/Inputs/GoogleAutocompleteInput.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import MonroeButton from '@/components/MonroeButton.tsx'

import { locationInitialValues } from '@/common/constants/location.ts'
import { IFormProps } from '@/common/interfaces'
import { TLocationForm } from '@/common/types/location.ts'

/**
 * A functional component for handling location-related form operations such as creating or updating location details.
 *
 * @component
 * @name LocationForm
 * @param {IFormProps<TLocationForm, TLocationForm>} props - Properties required for the form, including initial values, validation schema, submission handler, navigation, and loading status.
 * @returns {JSX.Element}
 */
export const LocationForm = (props: IFormProps<TLocationForm, TLocationForm>) => {
  const { initialValues, validationSchema, onSubmit, goBack, isLoading } = props

  /**
   * Handles the form submission.
   *
   * @function
   * @name handleSubmit
   * @param {TLocationForm} values - The form values submitted by the user.
   * @param {FormikHelpers<TLocationForm>} [formikHelpers] - Optional Formik helpers for managing form state and actions.
   * @returns {void}
   */
  const handleSubmit = (values: TLocationForm, formikHelpers?: FormikHelpers<TLocationForm>): void => {
    onSubmit(values, formikHelpers)
  }

  /**
   * Updates form fields with provided location data.
   *
   * @param {TResultValueProps} result - Object containing location details such as address, postalCode, state, city, latitude, and longitude.
   * @param {function} setFieldValue - Formik's setFieldValue function to update the form field values.
   */
  const updateFields = (result: TResultValueProps, setFieldValue: FormikHelpers<TLocationForm>['setFieldValue']) => {
    setFieldValue('address', result.address)
    setFieldValue('zipCode', result.postalCode)
    setFieldValue('state', result.state)
    setFieldValue('city', result.city)
    setFieldValue('latitude', Math.round(result.lat * 1e6) / 1e6)
    setFieldValue('longitude', Math.round(result.lng * 1e6) / 1e6)
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
      {({ values, handleChange, handleSubmit, errors, handleBlur, touched, setFieldValue }) => {
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
                    placeholder="Enter location name"
                    value={values.name}
                    onChange={handleChange('name')}
                    error={touched.name ? errors.name : undefined}
                    onBlur={() => handleBlur('name')}
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
                      updateFields(result, setFieldValue)
                    }}
                  />

                  <TextInput
                    name="zipCode"
                    label="Zip Code"
                    disabled
                    maxLength={5}
                    value={values.zipCode}
                    error={touched.zipCode ? errors.zipCode : undefined}
                  />
                  <TextInput
                    name="state"
                    label="State"
                    disabled
                    value={values.state}
                    error={touched.state ? errors.state : undefined}
                  />
                  <TextInput
                    name="city"
                    label="City"
                    disabled
                    value={values.city}
                    error={touched.city ? errors.city : undefined}
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
                    isDisabled={!(values.address && values.name)}
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
