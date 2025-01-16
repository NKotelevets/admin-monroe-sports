import { IFormProps } from '@/common/interfaces'
import { Form, Formik, FormikHelpers } from 'formik'
import { CancelButton, Line, MainContainer, PageContent, ProtectedPageSubtitle } from '@/components/Elements'
import { Flex } from 'antd'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { locationInitialValues } from '@/common/constants/location.ts'
import MonroeButton from '@/components/MonroeButton.tsx'
import { locationFormValidateSchema } from '@/pages/Protected/Locations/components/LocationForm/validation.ts'
import { TLocationForm } from '@/common/types/location.ts'

export const LocationForm = (props: IFormProps<TLocationForm, TLocationForm>) => {
  const { initialValues, validationSchema, onSubmit, goBack, isLoading } = props

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
      {({
          values,
          handleChange,
          handleSubmit,
          errors,
          handleBlur,
          touched,
          isValid,
          dirty
        }) => {

        return (
          <Form onSubmit={handleSubmit} className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main info</ProtectedPageSubtitle>
                </div>
                <MainContainer>
                  <TextInput
                    name="name"
                    label="Location name *"
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
                  <TextInput
                    name="address"
                    label="Address *"
                    value={values.address}
                    onChange={handleChange('address')}
                    error={touched.address ? errors.address : undefined}
                    onBlur={handleBlur('address')}
                  />
                  <TextInput
                    name="zipcode"
                    label="Zip Code"
                    // disabled
                    maxLength={5}
                    value={values.zipCode}
                    onChange={handleChange('zipCode')}
                    error={touched.zipCode ? errors.zipCode : undefined}
                    onBlur={handleBlur('zipCode')}
                  />
                  <TextInput
                    name="state"
                    label="State"
                    // disabled
                    value={values.state}
                    onChange={handleChange('state')}
                    error={touched.state ? errors.state : undefined}
                    onBlur={handleBlur('state')}
                  />
                  <TextInput
                    name="city"
                    label="City"
                    // disabled
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
                    isDisabled={!dirty || !isValid}
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
