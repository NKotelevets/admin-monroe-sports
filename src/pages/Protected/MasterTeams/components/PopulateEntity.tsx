import { Flex } from 'antd'
import { FormikErrors, FormikTouched } from 'formik'
import { FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import MasterTeamRoleInput from '@/pages/Protected/MasterTeams/components/MasterTeamRoleInput'
import { IMasterTeamRole, IPopulateMasterTeam } from '@/pages/Protected/MasterTeams/formik'

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
  errors: FormikErrors<IMasterTeamRole>[]
  setFieldValue: (
    field: string,
    value: IMasterTeamRole,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<IPopulateMasterTeam>>
  removeFn: (index: number) => void
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<IPopulateMasterTeam>>
  entityName: 'teamAdministrators' | 'coaches'
  touched: FormikTouched<IPopulateMasterTeam>
  totalNumberOfItems: number
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
  totalNumberOfItems,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { ref, isComponentVisible } = useIsActiveComponent(index === 0 ? true : false)
  const [selectedName, setSelectedName] = useState(entity.fullName || '')
  const { user } = useUserSlice()
  const isTheSameUser = user?.email === entity.email
  const touchedEntity = !!touched?.[entityName]?.[index]
  const isError = touchedEntity && !!errors?.[index]

  const handleBlur = () => setFieldTouched(`${entityName}.${index}`, true)

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  const handleClick = (user: IFEUser) => {
    const userName = user.firstName + ' ' + user.lastName
    setSelectedName(userName)

    const entityValue: IMasterTeamRole = {
      email: user.email,
      role: entity.role,
      fullName: userName,
      id: user.id,
    }

    setFieldValue(`${entityName}.${index}`, entityValue)
  }

  return (
    <CreateEntityContainer ref={ref} isError={isError}>
      {!isOpenedDetails && (
        <Flex className="c-p p16" justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)}>
          <Flex vertical>
            {isError && <TitleStyle isError={isError}>Missing mandatory data</TitleStyle>}

            {!isError && (
              <Flex vertical>
                <TitleStyle isError={false}>{entity.fullName || '-'}</TitleStyle>

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
              className="mg-t8"
              onClick={() => {
                if (totalNumberOfItems === 1) {
                  setFieldValue(`${entityName}.${index}`, {
                    role: entity.role,
                    email: '',
                    fullName: '',
                    id: '',
                  })
                } else {
                  removeFn(index)
                }

                setSelectedName('')
              }}
            >
              <ReactSVG src={DeleteIcon} />
            </div>
          </MonroeTooltip>
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical className="p16">
          <Flex vertical>
            <div className="mg-b8">
              <Flex align="center" justify="space-between">
                <OptionTitle>{entityName === 'teamAdministrators' ? ' Admin' : 'Coach'} Name *</OptionTitle>

                {isError && touchedEntity && (
                  <InputError>
                    {entityName === 'teamAdministrators' ? 'Admin Name' : 'Coach Name'} is required
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

            <div className="mg-b8">
              <OptionTitle>Email *</OptionTitle>
              <MonroeInput name={`${entityName}.${index}.email`} disabled value={entity.email} className="h-32" />
            </div>
          </Flex>
        </Flex>
      )}
    </CreateEntityContainer>
  )
}

export default PopulateEntity

