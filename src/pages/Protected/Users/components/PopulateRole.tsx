import { AddBracketButton } from '../../Seasons/components/Elements'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Divider, Flex } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FormikErrors } from 'formik'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import { ICreateUserFormValues, IRole } from '@/pages/Protected/Users/constants/formik'
import {
  ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES,
  MOCKED_TEAMS,
  ROLES,
} from '@/pages/Protected/Users/constants/roles'

import { OptionTitle } from '@/components/Elements'
import { CreateEntityContainer, Subtext, TitleStyle } from '@/components/Elements/entity'
import MonroeMultipleSelect from '@/components/MonroeMultipleSelect'
import MonroeSelect from '@/components/MonroeSelect'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { TRole } from '@/common/types'

import DeleteIcon from '@/assets/icons/delete.svg'

interface IPopulateRoleProps {
  index: number
  role: IRole
  onChange: ChangeEventHandler
  errors: FormikErrors<ICreateUserFormValues>
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ICreateUserFormValues>>
  removeFn: (index: number) => void
  isMultipleRoles: boolean
  values: ICreateUserFormValues
}

const PopulateRole: FC<IPopulateRoleProps> = ({
  index,
  role,
  errors,
  setFieldValue,
  removeFn,
  isMultipleRoles,
  values,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { ref, isComponentVisible } = useIsActiveComponent(index === 0 ? true : false)
  const isError = !!errors?.roles?.[index]
  const selectedRoles = values.roles.map((role) => role.name)
  const options: DefaultOptionType[] = ROLES.filter((initialRole) => !selectedRoles.includes(initialRole)).map(
    (role) => ({
      label: role,
      value: role,
    }),
  )
  const teamsOptions: DefaultOptionType[] = MOCKED_TEAMS.map((team) => ({
    label: team,
    value: team,
  }))
  const isRoleWithTeams = ARRAY_OF_ROLES_WITH_REQUIRED_LINKED_ENTITIES.includes(role.name as TRole)
  const isOperator = (role.name as TRole) === 'Operator'
  const { setIsCreateOperatorScreen } = useUserSlice()

  const operatorOptions: DefaultOptionType[] = [
    {
      label: (
        <Flex style={{ borderBottom: '1px solid rgba(189, 188, 194, 1)', margin: '4px 0 0 0 ' }}>
          <AddBracketButton
            type="default"
            icon={<PlusOutlined />}
            iconPosition="start"
            onClick={() => setIsCreateOperatorScreen(true)}
            style={{
              padding: '0px',
            }}
          >
            Add Operator
          </AddBracketButton>
        </Flex>
      ),
      value: '',
    },
    ...teamsOptions,
  ]

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  return (
    <CreateEntityContainer ref={ref} isError={isError}>
      {!isOpenedDetails && (
        <Flex
          justify="space-between"
          align="center"
          onClick={() => setIsOpenedDetails(true)}
          style={{ cursor: 'pointer', padding: '16px' }}
        >
          <Flex vertical>
            <TitleStyle isError={isError}>{isError ? 'Missing mandatory data' : role.name}</TitleStyle>

            {isRoleWithTeams && (
              <Flex>
                {!!role.linkedEntities?.length &&
                  role.linkedEntities.map((linkedEntity, idx, arr) => (
                    <Subtext key={linkedEntity}>
                      {linkedEntity} {idx === arr.length - 1 ? '' : ', '}
                    </Subtext>
                  ))}
              </Flex>
            )}
          </Flex>

          {isMultipleRoles && (
            <div onClick={() => removeFn(index)}>
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical style={{ padding: '16px' }}>
          <Flex vertical>
            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Role *</OptionTitle>
              <MonroeSelect
                onChange={(value) => {
                  setFieldValue(`roles.${index}.name`, value)
                }}
                options={options}
                placeholder="Select role"
                value={role.name || null}
                renderInside
                styles={{
                  width: '100%',
                }}
              />
            </div>

            {isRoleWithTeams && (
              <>
                <Divider />

                <div>
                  <OptionTitle>Master Teams *</OptionTitle>
                  <MonroeMultipleSelect
                    renderInside
                    onChange={(value) => {
                      setFieldValue(`roles.${index}.linkedEntities`, value)
                    }}
                    options={teamsOptions}
                    placeholder="Select teams"
                    value={role.linkedEntities || []}
                    styles={{
                      width: '100%',
                    }}
                  />
                </div>
              </>
            )}

            {isOperator && (
              <div>
                <OptionTitle>Operator</OptionTitle>
                <MonroeSelect
                  renderInside
                  onChange={(value) => {
                    setFieldValue(`roles.${index}.linkedEntities[0]`, value)
                  }}
                  options={operatorOptions}
                  placeholder="Select operator"
                  value={role?.linkedEntities?.[0] || undefined}
                  styles={{
                    width: '100%',
                  }}
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

