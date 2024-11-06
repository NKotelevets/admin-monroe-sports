import { FieldArray, Form, Formik, FormikConfig, FormikHelpers } from 'formik'
import {
  getInitialEntity,
  initialCreateMasterTeamValues,
  IPopulateMasterTeam,
  masterTeamsValidationSchema
} from '@/pages/Protected/MasterTeams/formik.ts'
import {
  AccordionHeader,
  AddEntityButton,
  CancelButton,
  MainContainer,
  OptionTitle,
  PageContent,
  ProtectedPageSubtitle
} from '@/components/Elements'
import { Divider, Flex } from 'antd'
import MonroeInput from '@/components/Inputs/MonroeInput.tsx'
import EntityList from '@/pages/Protected/MasterTeams/components/ListEntity.tsx'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import UsersMultipleSelectWithSearch from '@/components/UsersMultipleSelectWithSearch.tsx'
import MonroeButton from '@/components/MonroeButton.tsx'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useCallback } from 'react'
import { IPopulateMTRequest } from '@/common/interfaces/masterTeams.ts'

interface IMasterTeamFormProps {
  validationSchema?: FormikConfig<IPopulateMasterTeam>['validationSchema']
  initialValues?: IPopulateMasterTeam

  onSubmit(body: IPopulateMTRequest): void

  goBack(): void
}

export const MasterTeamForm = (props: IMasterTeamFormProps) => {
  const { validationSchema, initialValues, onSubmit, goBack } = props
  const { user } = useUserSlice()

  const isNew = initialValues === undefined
  const buttonTitle = isNew ? `Create Master Team` : `Edit Master Team`

  const formValues = {
    ...initialCreateMasterTeamValues,
    teamAdministrators: [
      {
        id: user!.id,
        fullName: user!.firstName + ' ' + user!.lastName,
        email: user!.email,
        role: 'admin'
      }
    ]
  } as IPopulateMasterTeam

  const handleSubmit = useCallback(
    async (values: IPopulateMasterTeam, formikHelpers: FormikHelpers<IPopulateMasterTeam>) => {
      const result = await formikHelpers.validateForm(values)

      if (Object.keys(result).length) return

      const coachesIds = values.coaches.filter((value) => value.role !== 'head-coach').map((coach) => coach.id)
      const playersIds = values.players.map((player) => player.id)
      const teamAdminIds = values.teamAdministrators.map((teamAdmin) => teamAdmin.id)

      const body = {
        name: values.name,
        head_coach: values.coaches[0].id,
        coaches: coachesIds,
        players: playersIds,
        team_admins: teamAdminIds
      }

      onSubmit(body)
    }, [])


  return (
    <Formik
      initialValues={initialValues || formValues}
      validationSchema={validationSchema || masterTeamsValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ values, handleChange, handleSubmit, errors, setFieldValue, handleBlur, touched, setFieldTouched }) => {
        const isTeamAdministratorsHaveErrors = !!errors.teamAdministrators?.length
        const isCoachesHaveErrors = !!errors.coaches?.length

        return (
          <Form onSubmit={handleSubmit}>
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                </div>

                <MainContainer>
                  <MonroeInput
                    name="name"
                    label={<OptionTitle className="pb-5">Master Team Name *</OptionTitle>}
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter master team name"
                    className="h-32"
                    error={touched.name ? errors.name : ''}
                    onBlur={handleBlur}
                  />
                </MainContainer>
              </Flex>

              <Divider className="mg-v24" />

              <Flex>
                <div className="pt-12 f-40">
                  <ProtectedPageSubtitle>Team administrator(s)</ProtectedPageSubtitle>
                </div>

                <FieldArray name="teamAdministrators">
                  {({ push, remove }) => (
                    <Flex vertical>
                      <EntityList
                        label={(idx: number) => `#${idx + 1} Team Admin`}
                        removeFn={remove}
                        entityName="teamAdministrators"
                      />

                      <MonroeTooltip
                        text={
                          isTeamAdministratorsHaveErrors
                            ? 'You can\'t create admin when you have errors in other admins'
                            : ''
                        }
                        width="220px"
                        containerWidth="113px"
                      >
                        <AddEntityButton
                          disabled={isTeamAdministratorsHaveErrors}
                          type="default"
                          icon={<PlusOutlined />}
                          iconPosition="start"
                          onClick={() => push(getInitialEntity('admin'))}
                          className="w-auto"
                        >
                          Add admin
                        </AddEntityButton>
                      </MonroeTooltip>
                    </Flex>
                  )}
                </FieldArray>
              </Flex>

              <Divider className="mg-v24" />

              <Flex>
                <div className="pt-12 f-40">
                  <ProtectedPageSubtitle>Coach(es)</ProtectedPageSubtitle>
                </div>

                <FieldArray name="coaches">
                  {({ push, remove }) => (
                    <Flex vertical>
                      <EntityList
                        label={(idx: number) => idx === 0 ? 'Head Coach' : `#${idx + 1} Coach`}
                        removeFn={remove}
                        entityName="coaches"
                      />

                      <MonroeTooltip
                        text={
                          isCoachesHaveErrors
                            ? 'You can\'t create coach when you have errors in other coaches'
                            : ''
                        }
                        width="220px"
                        containerWidth="113px"
                      >
                        <AddEntityButton
                          disabled={isCoachesHaveErrors}
                          type="default"
                          icon={<PlusOutlined />}
                          iconPosition="start"
                          onClick={() => push(getInitialEntity('coach'))}
                          className="w-auto"
                        >
                          Add coach
                        </AddEntityButton>
                      </MonroeTooltip>
                    </Flex>
                  )}
                </FieldArray>
              </Flex>

              <Divider className="mg-v24" />

              <Flex>
                <div className="pt-12 f-40">
                  <ProtectedPageSubtitle>Players</ProtectedPageSubtitle>
                </div>

                <div>
                  <AccordionHeader className="mg-v5">Players</AccordionHeader>

                  <UsersMultipleSelectWithSearch
                    isError={false}
                    onBlur={() => setFieldTouched('players', true)}
                    onChange={(values) => setFieldValue(`players`, values)}
                    selectedUsers={values.players}
                  />
                </div>
              </Flex>

              <Divider className="mg-v24" />

              <Flex>
                <div className="f-40" />
                <Flex>
                  <CancelButton type="default" onClick={goBack}>
                    Cancel
                  </CancelButton>

                  <MonroeButton
                    className="h-40"
                    label={buttonTitle}
                    type="primary"
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
