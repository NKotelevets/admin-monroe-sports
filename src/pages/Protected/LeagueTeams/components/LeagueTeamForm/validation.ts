import * as Yup from 'yup'
import { ILeagueForm } from '@/common/interfaces/league.ts'

export const leagueTeamValidationSchema = Yup.object<ILeagueForm>().shape({
  name: Yup.string().required('Name is required'),
  masterTeam: Yup.string()
    .test(
      'fieldA-required-if-fieldB-empty',
      'Master Team is required',
      function(value) {
        const { masterTeamAdmin } = this.parent
        if (!masterTeamAdmin || masterTeamAdmin.trim() === '') {
          return !!value && value.trim() !== ''
        }
        return true
      }
    ),
  masterTeamAdmin: Yup.string().test(
    'fieldB-required-if-fieldA-filled',
    'Master Team Admin is required',
    function(value) {
      const { masterTeam } = this.parent
      if (!masterTeam || masterTeam.trim() === '') {
        return !!value && value.trim() !== ''
      }
      return true
    }
  ),
  league: Yup.string().required('League is required'),
  division: Yup.string().required('Division is required'),
  subdivision: Yup.string().required('Subdivision is required')
})
