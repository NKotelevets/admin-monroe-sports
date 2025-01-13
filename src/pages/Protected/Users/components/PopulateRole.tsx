import { Divider, Flex } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FormikErrors, useFormikContext } from 'formik'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'

import OperatorsInput from '@/pages/Protected/Users/components/OperatorsInput'
import { ICreateUserFormValues } from '@/pages/Protected/Users/constants/formik'
import { ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES, ROLES } from '@/pages/Protected/Users/constants/roles'

import { OptionTitle } from '@/components/Elements'
import { CreateEntityContainer, Subtext, TitleStyle } from '@/components/Elements/entity'
import { InputError } from '@/components/Inputs/InputElements'
import MasterTeamsMultipleSelectWithSearch from '@/components/MasterTeamsMultipleSelectWithSearch'
import MonroeSelect from '@/components/MonroeSelect'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { MASTER_ADMIN_ROLE, OPERATOR_ROLE, PLAYER_ROLE, TEAM_ADMIN_ROLE } from '@/common/constants'
import { IIdName } from '@/common/interfaces'
import { IFERole } from '@/common/interfaces/role'
import { TRole } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'
import { colors } from '@/utils/colors.tsx'
import { SVGIcon } from '@/components/SVGIcon.tsx'
import { isAtLeast16YearsOld } from '@/utils'
import MonroeTooltip from '@/components/MonroeTooltip'

interface IPopulateRoleProps {
  index: number
  role: IFERole
  onChange: ChangeEventHandler
  errors: FormikErrors<ICreateUserFormValues>
  setFieldValue: (
    field: string,
    value: string | IIdName[] | IFERole,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<ICreateUserFormValues>>
  removeFn: (index: number) => void
  values: ICreateUserFormValues
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<ICreateUserFormValues>>
  isSameUser?: boolean
}

const PopulateRole: FC<IPopulateRoleProps> = (props) => {
  const {
    index,
    role,
    errors,
    setFieldValue,
    removeFn,
    setFieldTouched,
    isSameUser
  } = props

  const { values, touched } = useFormikContext<ICreateUserFormValues>()

  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { ref, isComponentVisible } = useIsActiveComponent(index === 0 ? true : false)
  const isError = touched.roles ? !!errors?.roles?.[index] : false
  const { user } = useUserSlice()
  const isAdmin = user?.isSuperuser
  const selectedRoles = values.roles.map((role) => role.name)
  const isUnder16 = values.birthDate ? !isAtLeast16YearsOld(values.birthDate) : true
  const options: DefaultOptionType[] = ROLES.filter((initialRole) => {
    if (isUnder16 && initialRole !== PLAYER_ROLE) return false
    if (!isAdmin && initialRole === OPERATOR_ROLE) return false
    if (!isAdmin && initialRole === MASTER_ADMIN_ROLE) return false
    return !selectedRoles.includes(initialRole)
  }).map((role) => ({
    label: role,
    value: role
  }))

  const isRoleWithTeams = ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole)
  const isOperator = (role.name as TRole) === OPERATOR_ROLE
  const operator = values.roles.find((role) => role.name === OPERATOR_ROLE)?.linkedEntities?.[0] || { id: '', name: '' }
  const isMissingName = touched.roles?.[+index] ? !!(errors.roles?.[+index] as FormikErrors<IFERole>)?.name : false
  const isMissingAge = !values.birthDate
  const isMissingEntities = !!(errors.roles?.[+index] as FormikErrors<IFERole>)?.linkedEntities
  const isHighestRoleOperator = isOperator && !user?.isSuperuser

  const cannotDeleteTeamAdmin = [TEAM_ADMIN_ROLE].includes(role.name)
    && (role?.linkedEntities?.some(entity => entity.canDelete === false) || false)

  const handleBlur = () => setFieldTouched(`roles.${index}.linkedEntities`, true)

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  return (
    <CreateEntityContainer ref={ref} isError={isError}>
      {!isOpenedDetails && (
        <Flex justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)} className="c-p p16">
          <Flex vertical>
            <TitleStyle isError={isError}>{isError ? 'Missing mandatory data' : role.name || 'Role'}</TitleStyle>

            {isRoleWithTeams && (
              <Flex wrap="wrap">
                {!!role.linkedEntities?.length &&
                  role.linkedEntities.map((linkedEntity, idx, arr) => (
                    <Subtext key={linkedEntity.id}>
                      {linkedEntity.name}
                      {idx === arr.length - 1 ? '' : ','}
                    </Subtext>
                  ))}
              </Flex>
            )}
          </Flex>

          {!([OPERATOR_ROLE, MASTER_ADMIN_ROLE].includes(role.name) && !isAdmin) &&
            !(isSameUser && role.name === MASTER_ADMIN_ROLE) && (
              <SVGIcon
                color={colors.primary}
                className="mg-l8 mg-r32"
                onClick={() => removeFn(index)}
                src={DeleteIcon}
              />
            )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical className="p16">
          <Flex vertical>
            <div className="mg-b8">
              <Flex align="center" justify="space-between">
                <OptionTitle>Role</OptionTitle>

                {isMissingName && <InputError>Role is required</InputError>}
              </Flex>
              <MonroeTooltip text={isMissingAge ? `Please, fill user birthdate to start adding roles` : ''} width='200px'>
                <MonroeSelect
                  onChange={(value) =>
                    setFieldValue(`roles.${index}`, {
                      name: value,
                      linkedEntities: []
                    })
                  }
                  options={options}
                  placeholder="Select role"
                  value={role.name || null}
                  renderInside
                  className="w-full"
                  is_error={`${isMissingName}`}
                  onBlur={() => setFieldTouched(`roles.${index}.name`, true)}
                  disabled={(isHighestRoleOperator && role.name === OPERATOR_ROLE) || cannotDeleteTeamAdmin || isMissingAge}
                />
              </MonroeTooltip>
            </div>

            {isRoleWithTeams && (
              <>
                <Divider />

                <div>
                  <Flex justify="space-between" align="center">
                    <OptionTitle>Master Teams *</OptionTitle>

                    {isMissingEntities && <InputError>Master Teams is required</InputError>}
                  </Flex>

                  <MasterTeamsMultipleSelectWithSearch
                    onChange={(value) => {
                      setFieldValue(`roles.${index}.linkedEntities`, value)
                    }}
                    onBlur={() => setFieldTouched(`roles.${index}.linkedEntities`, true)}
                    isError={isMissingEntities}
                    selectedTeams={role.linkedEntities || []}
                  />
                </div>
              </>
            )}

            {isOperator && (
              <div>
                <Flex justify="space-between" align="center">
                  <OptionTitle>Operator *</OptionTitle>

                  {isMissingEntities && <InputError>Operator is required</InputError>}
                </Flex>

                <OperatorsInput
                  isError={isMissingEntities}
                  setOperator={(value) => {
                    setFieldValue(`roles.${index}.linkedEntities`, value)
                  }}
                  selectedOperator={operator}
                  handleBlur={handleBlur}
                  isDisabled={isHighestRoleOperator}
                />
              </div>
            )}
          </Flex>
        </Flex>
      )}
    </CreateEntityContainer>
  )
}

export default PopulateRole

