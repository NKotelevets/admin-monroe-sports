import React, { useEffect, useMemo, useState } from 'react'
import { IFELeague, ILeagueForm } from '@/common/interfaces/league.ts'
import { useFormikContext } from 'formik'
import { useLazyGetSeasonDetailsQuery } from '@/redux/seasons/seasons.api.ts'
import { IBESubdivision, IFEDivision } from '@/common/interfaces/division.ts'
import { IIdName } from '@/common/interfaces'
import Select from '@/components/Inputs/Select.tsx'
import { IFESeason } from '@/common/interfaces/season.ts'

export const SeasonAndPoolsDropdown = React.memo((props: { selectedLeague: IFELeague | null }) => {
    const { selectedLeague } = props
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur
    } = useFormikContext<ILeagueForm>()

    const [getSeason, { isLoading, isFetching }] = useLazyGetSeasonDetailsQuery()
    const [seasonList, setSeasonList] = useState<IFESeason[]>([])

    /**
     * Fetches seasons for selected league
     */
    useEffect(() => {
      if (!selectedLeague) return

      async function getSeasons() {
        const seasonIds = (selectedLeague?.seasons as IIdName[])?.map(season => (season.id))
        const seasons = await Promise.all(seasonIds.map(async (id) => (
          await getSeason(id).unwrap()
        )))
        setSeasonList(seasons)
      }

      getSeasons()
    }, [selectedLeague])

    /**
     * List of divisions for season
     */
    const divisionList: IFEDivision[] = useMemo(() => {
      return seasonList.find(season => season.id === values.season)?.divisions || []
    }, [seasonList, values.season])

    /**
     * List of subdivisions for division
     */
    const subdivisionList: IBESubdivision[] = useMemo(() => {
      return divisionList?.find(division => division.id === values.division)?.sub_division || []
    }, [divisionList, values.division])

    return (
      <>
        <Select
          showSearch
          disabled={!seasonList.length}
          loading={isLoading || isFetching}
          label="Season *"
          placeholder="Select season"
          optionFilterProp="label"
          value={values.season}
          onChange={handleChange('season')}
          options={seasonList.map(season => ({ value: season.id, label: season.name }))}
          error={touched.season ? errors.season as string : ''}
          onBlur={handleBlur('season')}
        />
        <Select
          showSearch
          disabled={!values.season || !divisionList.length}
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
          disabled={!values.division || !subdivisionList.length}
          label="Subivision/Pool *"
          placeholder="Select subdivision/pool"
          optionFilterProp="label"
          value={values.subdivision}
          onChange={handleChange('subdivision')}
          options={subdivisionList.map(division => ({ value: division.id, label: division.name }))}
          error={touched.subdivision ? errors.subdivision as string : ''}
          onBlur={handleBlur('subdivision')}
        />
      </>
    )
  }, (prev, next) =>
    prev.selectedLeague === next.selectedLeague
)
