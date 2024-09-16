import { Flex } from 'antd'
import { FormikErrors, FormikTouched } from 'formik'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import MasterTeamRoleInput from '@/pages/Protected/MasterTeams/components/MasterTeamRoleInput'
import { ICreateMasterTeam, IMasterTeamRole } from '@/pages/Protected/MasterTeams/formik'

import { OptionTitle } from '@/components/Elements'
import { CreateEntityContainer, Subtext, TitleStyle } from '@/components/Elements/entity'
import { InputError } from '@/components/Inputs/InputElements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { IFEUser } from '@/common/interfaces/user'

import DeleteIcon from '@/assets/icons/delete.svg'

interface IPopulateRoleProps {
  index: number
  entity: IMasterTeamRole
  onChange: ChangeEventHandler
  errors: FormikErrors<IMasterTeamRole>[]
  setFieldValue: (
    field: string,
    value: IMasterTeamRole,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ICreateMasterTeam>>
  removeFn: (index: number) => void
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ICreateMasterTeam>>
  entityName: 'teamAdministrators' | 'coaches'
  touched: FormikTouched<ICreateMasterTeam>
}

const PopulateEntity: FC<IPopulateRoleProps> = ({
  index,
  entity,
  errors,
  setFieldValue,
  removeFn,
  setFieldTouched,
  entityName,
  touched,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { ref, isComponentVisible } = useIsActiveComponent(index === 0 ? true : false)
  const [selectedName, setSelectedName] = useState(entity.firstName + ' ' + entity.lastName || '')
  const { user } = useUserSlice()
  const isTheSameUser = user?.email === entity.email
  const touchedEntity = !!touched?.[entityName]?.[index]
  const isError = touchedEntity && !!errors?.[index]

  const handleBlur = () => {
    setFieldTouched(`${entityName}.${index}`, true)
  }

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  const handleClick = (user: IFEUser) => {
    const userName = user.firstName + ' ' + user.lastName
    setSelectedName(userName)

    const entityValue: IMasterTeamRole = {
      email: user.email,
      role: entity.role,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    setFieldValue(`${entityName}.${index}`, entityValue)
  }

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
            {isError && <TitleStyle isError={isError}>Missing mandatory data</TitleStyle>}

            {!isError && (
              <Flex vertical>
                <TitleStyle isError={false}>
                  {entity.firstName ? entity.firstName + ' ' + entity.lastName : 'User full name'}
                </TitleStyle>

                <Subtext>{entity.email ? entity.email : 'User email'}</Subtext>
              </Flex>
            )}
          </Flex>

          <MonroeTooltip
            text={
              isTheSameUser
                ? 'If you remove yourself from this role, this Master Team will not be displayed in your Team list.'
                : ''
            }
            width="240px"
            containerWidth="auto"
          >
            <div
              style={{ marginTop: '8px' }}
              onClick={() => {
                removeFn(index)
                setSelectedName('')
              }}
            >
              <ReactSVG src={DeleteIcon} />
            </div>
          </MonroeTooltip>
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical style={{ padding: '16px' }}>
          <Flex vertical>
            <div style={{ marginBottom: '8px' }}>
              <Flex align="center" justify="space-between">
                <OptionTitle>{entityName === 'teamAdministrators' ? 'Administrator' : 'Coach'} Name *</OptionTitle>

                {isError && touchedEntity && (
                  <InputError>
                    {entityName === 'teamAdministrators' ? 'Administrator Name' : 'Coach Name'} is required
                  </InputError>
                )}
              </Flex>

              <MasterTeamRoleInput
                selectedName={selectedName}
                handleClick={handleClick}
                handleBlur={handleBlur}
                isError={isError}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Email *</OptionTitle>

              <MonroeInput
                name={`${entityName}.${index}.email`}
                disabled
                value={entity.email}
                style={{ height: '32px' }}
              />
            </div>
          </Flex>
        </Flex>
      )}
    </CreateEntityContainer>
  )
}

export default PopulateEntity

