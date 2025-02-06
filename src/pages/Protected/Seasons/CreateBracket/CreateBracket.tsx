import Flex from 'antd/es/flex'
import { FormikTouched, useFormikContext } from 'formik'
import { FocusEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { BRACKETS_OPTIONS } from '@/pages/Protected/Seasons/CreateBracket/constants/bracketData'
import { ICreateSeasonFormValues, bracketSchema } from '@/pages/Protected/Seasons/constants/formik'

import {
  CancelButton,
  MonroeBlueText,
  OptionTitle,
  ProtectedPageSubtitle
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import CustomSelect from '@/components/MonroeSelect'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { PATH_TO_EDIT_SEASON, PATH_TO_SEASONS } from '@/common/constants/paths'
import { PLAYOFFS_TEAMS_OPTIONS } from '@/common/constants/playoffsTeamsOptions'
import { IBracket } from '@/common/interfaces/bracket'
import { TBracketKeys } from '@/common/types/bracket'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { usePageContext } from '@/layouts/Page/context.ts'
import MonroeTooltip from '@/components/MonroeTooltip.tsx'
import {
  SingleEliminationBracketForm
} from '@/pages/Protected/Seasons/CreateBracket/components/SingleEliminationBracketForm.tsx'
import styled from '@emotion/styled'
import { Divider } from 'antd'

/**
 * The CreateBracket component allows users to create or edit a tournament bracket.
 * It manages form state, validation, and interactions with the bracket structure.
 *
 * @returns {ReactElement} The rendered CreateBracket component.
 */
const CreateBracket = (): ReactElement => {
  const { setShowBracketPage, setData, bracketData, setBracketData } = useSeasonFormContext()
  const {
    values,
    setFieldValue,
    handleBlur,
    touched
  } = useFormikContext<ICreateSeasonFormValues>()
  const { setPageTitle, setBreadcrumbs } = usePageContext()

  const {
    setSelectedBracketId,
    pathToSubdivisionDataAndIndexes,
    bracketIdx,
    bracketMode
  } = useSeasonSlice()

  const [isValid, setIsValid] = useState(false)
  const [namePrefix, divisionIndex] = pathToSubdivisionDataAndIndexes.split('&')
  const subdivisionValues = values.divisions[+divisionIndex]

  const location = useLocation()
  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)
  const pageTitle = !isEditPage ? (bracketMode === 'create' ? 'Create Bracket' : 'Edit Bracket') : 'Edit Bracket'
  const bracketTouchedFields = touched?.divisions?.[+divisionIndex]?.brackets?.[+bracketIdx] as FormikTouched<IBracket>
  const fistLoad = useRef<boolean>(true)

  useEffect(() => {
    if (fistLoad?.current)
      setBracketData(subdivisionValues.brackets?.[bracketIdx] || {} as IBracket)
  }, [subdivisionValues.brackets?.[bracketIdx], fistLoad?.current])

  /**
   * Sets the breadcrumbs and page title on component mount and updates.
   */
  useEffect(() => {
    setBreadcrumbs([
      { title: <a href={PATH_TO_SEASONS}>Seasons</a> },
      { title: <a onClick={goBack}>{isEditPage ? `Edit` : `Create`} Season</a> },
      { title: <MonroeBlueText>{pageTitle}</MonroeBlueText> }
    ])
    setPageTitle(pageTitle)
  }, [pageTitle, isEditPage])

  /**
   * Validates the bracket schema whenever the relevant bracket data or touched fields change.
   */
  useEffect(() => {
    const validateSchema = async () =>
      await bracketSchema
        .validate(bracketData)
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false))

    bracketTouchedFields?.name && validateSchema()
  }, [bracketData, bracketTouchedFields])

  useEffect(() => {
    if (!isEditPage || !values) return

    setData(values)
  }, [values, isEditPage])

  /**
   * Cancels the bracket creation or editing process and resets state as needed.
   */
  const onCancel = () => {
    setShowBracketPage(false)

    if (bracketMode === 'create') {
      const brackets = subdivisionValues.brackets.filter((_, idx) => idx !== bracketIdx)
      setFieldValue(`${namePrefix}.brackets`, brackets)
    }
  }

  /**
   * Navigates back to the previous page and resets the selected bracket ID.
   */
  const goBack = () => {
    onCancel()
    setSelectedBracketId(null)
  }

  /**
   * Submits the current bracket data and closes the bracket form.
   */
  const onSubmitBrackets = () => {
    setFieldValue(`${namePrefix}.brackets.${bracketIdx}`, bracketData)
    setShowBracketPage(false)
  }

  /**
   * Updates the playoff teams and matches in the bracket based on the selected value.
   *
   * @param {string} value - The selected number of playoff teams.
   */
  const onPlayoffsChange = useCallback((value: string) => {
    setFieldValue(`${namePrefix}.brackets[${bracketIdx}]`, {
      ...(values.divisions[+divisionIndex].brackets?.[bracketIdx] || {}),
      playoffTeams: +value,
      matches: BRACKETS_OPTIONS[+value as TBracketKeys]
    })
  }, [namePrefix, bracketIdx, values.divisions, divisionIndex, bracketIdx])

  if (!bracketData) return <></>

  return (
    <div>
      <Flex className="p0">
        <div className="f-40">
          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
        </div>

        <FormWrapper vertical justify="flex-start">
          <div className="mg-b8">
            <MonroeInput
              name={`${namePrefix}.brackets.${bracketIdx}.name`}
              value={bracketData.name}
              onChange={(event) => {
                setBracketData((prev) => ({ ...prev, name: event.target.value }))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleBlur(event as FocusEvent<any>)
              }}
              placeholder="Enter bracket name"
              className="h-32"
              label={<OptionTitle>Bracket Name *</OptionTitle>}
              error={bracketTouchedFields?.name ? (!bracketData?.name?.length ? 'Bracket Name is required' : '') : ''}
              onBlur={handleBlur}
            />
          </div>

          <Flex className="mg-b8" vertical>
            <OptionTitle># playoffs' teams *</OptionTitle>
            <CustomSelect
              name={`${namePrefix}.brackets[${bracketIdx}].playoffTeams`}
              value={`${values.divisions[+divisionIndex].brackets?.[bracketIdx].playoffTeams}`}
              options={PLAYOFFS_TEAMS_OPTIONS}
              onChange={onPlayoffsChange}
              className="w-full"
            />
          </Flex>
        </FormWrapper>
      </Flex>

      <Divider />


      <SingleEliminationBracketForm
        bracketData={bracketData}
        setBracketData={setBracketData}
      />

      <Divider />

      <Flex className="mg-t20">
        <div className="f-40" />

        <Flex>
          <CancelButton type="default" onClick={onCancel}>
            Cancel
          </CancelButton>

          <MonroeTooltip width="180px" containerWidth="auto" text={!isValid ? 'Missing mandatory data' : ''}>
            <div className="w-150">
              <MonroeButton
                label={pageTitle}
                type="primary"
                onClick={onSubmitBrackets}
                isDisabled={!isValid}
                className="h-40"
              />
            </div>
          </MonroeTooltip>
        </Flex>
      </Flex>
    </div>
  )
}

export default CreateBracket

// Styled Components
const FormWrapper = styled(Flex)`
  width: 352px
`
