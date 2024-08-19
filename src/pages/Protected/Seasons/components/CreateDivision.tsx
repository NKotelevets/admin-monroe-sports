import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { FieldArray, FormikErrors } from 'formik'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'

import CreateSubdivision from '@/pages/Protected/Seasons/components/CreateSubdivision'
import { CreateDivisionContainer, Subtext, TitleStyle } from '@/pages/Protected/Seasons/components/Elements'
import {
  ICreateSeasonDivision,
  ICreateSeasonFormValues,
  INITIAL_SUBDIVISION_DATA,
} from '@/pages/Protected/Seasons/constants/formik'

import { Accordion, MonroeDivider, OptionTitle } from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTextarea from '@/components/Inputs/MonroeTextarea'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import useIsActiveComponent from '@/hooks/useIsActiveComponent'

import { IFEDivision } from '@/common/interfaces/division'
import { IFECreateSeason } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import ShowAllIcon from '@/assets/icons/show-all.svg'

interface ICreateDivisionProps {
  index: number
  division: ICreateSeasonDivision
  onChange: ChangeEventHandler
  errors: FormikErrors<IFECreateSeason>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<IFECreateSeason>>
  removeFn: (index: number) => void
  isMultipleDivisions: boolean
  values: ICreateSeasonFormValues
}

const CreateDivision: FC<ICreateDivisionProps> = ({
  index,
  division,
  onChange,
  errors,
  setFieldValue,
  removeFn,
  isMultipleDivisions,
  values,
}) => {
  const [isOpenedDetails, setIsOpenedDetails] = useState(index === 0 ? true : false)
  const { isComponentVisible, ref } = useIsActiveComponent(index === 0 ? true : false)
  const isDisabled = !!(errors?.divisions?.[+index] as FormikErrors<IFEDivision>)?.subdivisions?.length
  const allDivisionNames = values.divisions.map((d) => d.name)
  const { setIsDuplicateNames, isDuplicateNames } = useSeasonSlice()
  const listOfDuplicatedNames = allDivisionNames
    .map((dN, idx, array) => (array.indexOf(dN) === idx ? false : dN))
    .filter((i) => i)
  const notUniqueNameErrorText = listOfDuplicatedNames.find((dN) => dN === division.name) ? 'Name already exists' : ''
  const isError = !!errors?.divisions?.[index] || isDuplicateNames

  useEffect(() => {
    if (notUniqueNameErrorText === 'Name already exists') {
      setIsDuplicateNames(true)
    } else {
      setIsDuplicateNames(false)
    }
  }, [notUniqueNameErrorText])

  useEffect(() => {
    if (!isComponentVisible) setIsOpenedDetails(false)
  }, [isComponentVisible])

  return (
    <CreateDivisionContainer ref={ref} isError={isError}>
      {!isOpenedDetails && (
        <Flex justify="space-between" align="center" onClick={() => setIsOpenedDetails(true)}>
          <Flex vertical style={{ cursor: 'pointer' }}>
            <TitleStyle isError={isError}>{isError ? 'Missing mandatory data' : division.name}</TitleStyle>

            <Subtext>
              {division.subdivisions.length}{' '}
              {division.subdivisions.length === 1 ? 'Subdivision/Subpool' : 'Subdivisions/Subpools'}
            </Subtext>
          </Flex>

          {isMultipleDivisions && (
            <div onClick={() => removeFn(index)}>
              <ReactSVG src={DeleteIcon} />
            </div>
          )}
        </Flex>
      )}

      {isOpenedDetails && (
        <Flex vertical>
          <Flex vertical>
            <div style={{ marginBottom: '8px' }}>
              <MonroeInput
                label={<OptionTitle>Division/Pool Name *</OptionTitle>}
                name={`divisions.${index}.name`}
                value={division.name}
                onChange={onChange}
                placeholder="Enter name"
                style={{ height: '32px' }}
                error={notUniqueNameErrorText}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <OptionTitle>Division/Pool Description</OptionTitle>
              <MonroeTextarea
                name={`divisions.${index}.description`}
                value={division.description}
                onChange={onChange}
                placeholder="Enter description"
                resize="vertical"
                initialHeight={56}
              />
            </div>
          </Flex>

          <MonroeDivider />

          <FieldArray name={`divisions[${index}.subdivisions]`}>
            {(innerArrayHelpers) => {
              const collapsedDivisionItems = division.subdivisions.map((subdivision, idx) => ({
                key: idx,
                children: (
                  <CreateSubdivision
                    index={idx}
                    divisionIndex={index}
                    onChange={onChange}
                    subdivision={subdivision}
                    namePrefix={`divisions.${index}.subdivisions.${idx}`}
                    setFieldValue={setFieldValue}
                    isMultipleSubdivisions={!!(division.subdivisions.length > 1)}
                    removeFn={innerArrayHelpers.remove}
                    errors={errors}
                    division={division}
                    values={values}
                  />
                ),
                label: (
                  <Typography
                    style={{
                      color: '#1A1657',
                      fontSize: '16px',
                      fontWeight: 500,
                      marginTop: idx > 0 ? '12px' : '0',
                    }}
                  >
                    #{idx + 1} Subdivision/subpool
                  </Typography>
                ),
              }))

              return (
                <div>
                  {!!division.subdivisions.length && (
                    <>
                      <Accordion
                        items={collapsedDivisionItems}
                        expandIconPosition="end"
                        defaultActiveKey={[0]}
                        expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                        accordion
                        className="subdivision-collapse"
                        style={{
                          width: '100%',
                        }}
                      />

                      <MonroeDivider />
                    </>
                  )}

                  <MonroeTooltip
                    text={
                      isDisabled
                        ? "You can't create subdivision/subpool when you have errors in other subdivisions/subpools"
                        : ''
                    }
                    width="280px"
                    containerWidth="200px"
                  >
                    <Button
                      style={{
                        border: 0,
                        background: 'transparent',
                        boxShadow: 'none',
                      }}
                      icon={<PlusOutlined />}
                      onClick={() => innerArrayHelpers.push(INITIAL_SUBDIVISION_DATA)}
                      disabled={isDisabled}
                    >
                      Add subdivision/subpool
                    </Button>
                  </MonroeTooltip>
                </div>
              )
            }}
          </FieldArray>
        </Flex>
      )}
    </CreateDivisionContainer>
  )
}

export default CreateDivision
