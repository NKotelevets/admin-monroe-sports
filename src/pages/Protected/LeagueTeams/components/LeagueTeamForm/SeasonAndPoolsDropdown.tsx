import React, { useEffect, useMemo, useState } from 'react'
import { IFELeague, ILeagueForm } from '@/common/interfaces/league.ts'
import { useFormikContext } from 'formik'
import { useLazyGetSeasonDetailsQuery } from '@/redux/seasons/seasons.api.ts'
import { IBESubdivision, IFEDivision } from '@/common/interfaces/division.ts'
import { IIdName } from '@/common/interfaces'
import Select from '@/components/Inputs/Select.tsx'
import { IFESeason } from '@/common/interfaces/season.ts'

/**
 * A dropdown component for selecting a season, division, and subdivision/pool.
 *
 * @param {Object} props - Component properties.
 * @param {IFELeague | null} props.selectedLeague - The currently selected league whose seasons, divisions, and
 * subdivisions are displayed.
 *
 * @returns {ReactElement} - A set of dropdowns for selecting a season, division, and subdivision/pool.
 *
 * @remarks
 * - Integrates with Formik for form state management.
 * - Fetches season details asynchronously based on the selected league.
 * - Filters divisions and subdivisions dynamically based on selected values.
 */
export const SeasonAndPoolsDropdown = React.memo(
  (props: { selectedLeague: IFELeague | null }) => {
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
     * Fetches the list of seasons associated with the selected league.
     * This runs whenever the `selectedLeague` prop changes.
     */
    useEffect(() => {
      if (!selectedLeague) return

      async function getSeasons() {
        const seasonIds = (selectedLeague?.seasons as IIdName[])?.map(season => season.id)
        const seasons = await Promise.all(
          seasonIds.map(async (id) => await getSeason(id).unwrap())
        )
        setSeasonList(seasons)
      }

      getSeasons()
    }, [selectedLeague])

    /**
     * Computes the list of divisions for the selected season.
     */
    const divisionList: IFEDivision[] = useMemo(() => {
      return seasonList.find(season => season.id === values.season)?.divisions || []
    }, [seasonList, values.season])

    /**
     * Computes the list of subdivisions for the selected division.
     */
    const subdivisionList: IBESubdivision[] = useMemo(() => {
      return divisionList?.find(division => division.id === values.division)?.sub_division || []
    }, [divisionList, values.division])

    return (
      <>
        {/* Dropdown for selecting a season */}
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
          error={touched.season ? (errors.season as string) : ''}
          onBlur={handleBlur('season')}
        />

        {/* Dropdown for selecting a division/pool */}
        <Select
          showSearch
          disabled={!values.season || !divisionList.length}
          label="Division/Pool *"
          placeholder="Select division/pool"
          optionFilterProp="label"
          value={values.division}
          onChange={handleChange('division')}
          options={divisionList.map(division => ({ value: division.id, label: division.name }))}
          error={touched.division ? (errors.division as string) : ''}
          onBlur={handleBlur('division')}
        />

        {/* Dropdown for selecting a subdivision/pool */}
        <Select
          showSearch
          disabled={!values.division || !subdivisionList.length}
          label="Subdivision/Pool *"
          placeholder="Select subdivision/pool"
          optionFilterProp="label"
          value={values.subdivision}
          onChange={handleChange('subdivision')}
          options={subdivisionList.map(subdivision => ({ value: subdivision.id, label: subdivision.name }))}
          error={touched.subdivision ? (errors.subdivision as string) : ''}
          onBlur={handleBlur('subdivision')}
        />
      </>
    )
  },
  (prev, next) => (
    prev.selectedLeague === next.selectedLeague
  )
)
