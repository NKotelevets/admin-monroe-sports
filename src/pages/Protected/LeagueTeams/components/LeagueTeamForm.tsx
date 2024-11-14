import { Form, Formik } from 'formik'
import {
  CancelButton,
  MainContainer,
  OptionTitle,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageSubtitleDescription
} from '@/components/Elements'
import Flex from 'antd/es/flex'
import { Divider, Select, Tabs } from 'antd'
import { IFormProps } from '@/common/interfaces'
import MonroeInput from '@/components/Inputs/MonroeInput.tsx'
import styled from '@emotion/styled'
import MonroeButton from '@/components/MonroeButton.tsx'
import TabPane from 'antd/es/tabs/TabPane'
import { DownOutlined } from '@ant-design/icons'
import { colors } from '@/utils/colors'
import TextInput from '@/components/Inputs/TextInput.tsx'
import Dropdown from '@/components/Inputs/Dropdown.tsx'
import * as Yup from 'yup'

interface ITemp {
  name: string
}

const leagueTeamInitialValues: ITemp = {
  name: ''
}

const userValidationSchema = Yup.object<ITemp>().shape({
  name: Yup.string().required('Name is required')
})

export const LeagueTeamForm = (props: IFormProps<ITemp, ITemp>) => {
  const {
    validationSchema,
    initialValues,
    isLoading,
    onSubmit,
    goBack
  } = props

  const isNew = true
  const pageTitle = isNew ? 'Create' : 'Edit'

  const handleSubmit = (values: ITemp) => {
    onSubmit(values)
  }

  return (
    <Formik
      initialValues={initialValues || leagueTeamInitialValues}
      validationSchema={validationSchema || userValidationSchema}
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
          dirty
        }) => {

        return (
          <Form onSubmit={handleSubmit} className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                </div>

                <MainContainer>

                  <TextInput
                    label="League Team Name *"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="h-32"
                    error={touched.name ? errors.name as string : undefined}
                    onBlur={handleBlur}
                    disabled={!isNew}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Master Team</ProtectedPageSubtitle>
                  <ProtectedPageSubtitleDescription>You can join the Master team you own or select an administrator who
                    will join the corresponding team from his list.</ProtectedPageSubtitleDescription>
                </div>

                <MainContainer>
                  <Tabs
                    defaultActiveKey="1"
                    centered
                  >
                    <TabPane tab="By Master Team" key="1">
                      <Dropdown
                        showSearch
                        label="Master Team *"
                        placeholder="Select master team"
                        optionFilterProp="label"
                        value={values.name}
                        onChange={handleChange}
                        options={[
                          { value: '1', label: 'Not Identified' },
                          { value: '2', label: 'Closed' }
                        ]}
                        buttonAction={alert}
                        buttonText="Add master team"
                        error={touched.name ? errors.name as string : ''}
                        onBlur={handleBlur}
                      />

                      <Dropdown
                        disabled
                        label="Master Team Administrator *"
                        placeholder="Select master team"
                        value={values.name}
                        onChange={handleChange}
                        options={[
                          { value: '1', label: 'Not Identified' },
                          { value: '2', label: 'Closed' }
                        ]}
                        buttonAction={alert}
                        buttonText="Add master team"
                        error={touched.name ? errors.name as string : ''}
                        onBlur={handleBlur}
                      />

                      <Dropdown
                        disabled
                        label="Master Team Admin Email "
                        placeholder="Select master team"
                        value={values.name}
                        onChange={handleChange}
                        options={[
                          { value: '1', label: 'Not Identified' },
                          { value: '2', label: 'Closed' }
                        ]}
                        buttonAction={alert}
                        buttonText="Add master team"
                        error={touched.name ? errors.name as string : ''}
                        onBlur={handleBlur}
                      />
                    </TabPane>

                    <TabPane tab="By MT Admin" key="2">
                      <OptionTitle>Master Team Administrator *</OptionTitle>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Selete master team administrator"
                        suffixIcon={<ChevronDown />}
                        options={[
                          { value: '1', label: 'Not Identified' },
                          { value: '2', label: 'Closed' }
                        ]}
                      />

                      <TextInput
                        label="Master Team Admin Email *"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="h-32"
                        error={touched.name ? errors.name as string : ''}
                        onBlur={handleBlur}
                        disabled={!isNew}
                      />
                    </TabPane>

                  </Tabs>
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Linked Leagues/Tourns</ProtectedPageSubtitle>
                  <ProtectedPageSubtitleDescription>You can join the Master team you own or select an administrator who
                    will join the corresponding team from his list.</ProtectedPageSubtitleDescription>
                </div>

                <MainContainer>
                  <MonroeInput
                    label={<OptionTitle className="pb-5">League Team Name *</OptionTitle>}
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="h-32"
                    error={touched.name ? errors.name as string : ''}
                    onBlur={handleBlur}
                    disabled={!isNew}
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
                    isDisabled={!dirty}
                    label={pageTitle}
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

const Line = styled(Divider)`
    margin: 24px 0 !important;
`

const ChevronDown = styled(DownOutlined)`
    font-size: 10px;
    color: ${colors.secondary};
`
