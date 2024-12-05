import React, { useEffect, useState } from 'react'
import { IFELeague, ILeagueForm } from '@/common/interfaces/league.ts'
import { useFormikContext } from 'formik'
import { useLazyGetSeasonDetailsQuery } from '@/redux/seasons/seasons.api.ts'
import { IFEDivision } from '@/common/interfaces/division.ts'
import { IIdName } from '@/common/interfaces'
import Select from '@/components/Inputs/Select.tsx'

export const DivisionSubdivisionDropdown = React.memo((props: { selectedLeague: IFELeague | null }) => {
  const { selectedLeague } = props
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ILeagueForm>()

  const [getSeason, { isLoading, isFetching }] = useLazyGetSeasonDetailsQuery()
  const [divisionList, setDivisions] = useState<IFEDivision[]>([])
  const [subdivisionList, setSubdivisions] = useState<{ value: string, label: string }[]>([])

  useEffect(() => {
    if (!divisionList.length) return

    const currentDivision = divisionList.find(div => div.id === values.division)
    const subdivisions = currentDivision?.sub_division?.map(sub => ({
      value: sub.id || '',
      label: sub.name
    }))

    setSubdivisions(subdivisions || [])
    setFieldValue('subdivision', undefined)
  }, [divisionList, values.division])

  // fetches seasons for divisions
  useEffect(() => {
    if (!selectedLeague) return

    async function getDivisions() {
      const seasonIds = (selectedLeague?.seasons as IIdName[])?.map(season => (season.id))

      const divisions = await Promise.all(
        seasonIds.map(async (id) => {
          const season = await getSeason(id).unwrap()
          return season.divisions
        })
      )
      setDivisions(divisions.flat())
    }

    getDivisions()
  }, [selectedLeague])


  return (
    <>
      <Select
        showSearch
        disabled={!selectedLeague || !divisionList.length}
        loading={isLoading || isFetching}
        label="Division/Pool *"
        placeholder="Select division/pool"
        optionFilterProp="label"
        value={values.division}
        onChange={handleChange('division')}
        options={divisionList.map(division => ({ value: division.id, label: division.name }))}
        error={touched.division ? errors.division as string : ''}
        onBlur={handleBlur('division')}
      />
      <Select
        showSearch
        disabled={!subdivisionList.length}
        label="Subivision/Pool *"
        placeholder="Select subdivision/pool"
        optionFilterProp="label"
        value={values.subdivision}
        onChange={handleChange('subdivision')}
        options={subdivisionList}
        error={touched.subdivision ? errors.subdivision as string : ''}
        onBlur={handleBlur('subdivision')}
      />
    </>
  )
}, (prev, next) =>
  prev.selectedLeague === next.selectedLeague
)
