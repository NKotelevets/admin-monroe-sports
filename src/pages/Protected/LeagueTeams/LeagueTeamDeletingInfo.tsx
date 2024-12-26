import { MonroeBlueText } from '@/components/Elements'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice'

import { PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths'
import DeletingInfoPage from '@/layouts/DeletingInfoPage.tsx'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_LEAGUE_TEAMS}>League Teams</a> },
  { title: <MonroeBlueText>Deleting info</MonroeBlueText> }
]

/**
 * LeagueTeamDeletingInfo Page
 *
 * This component renders a page that provides an overview of league teams that could not be deleted due to errors.
 * It displays a table summarizing the records with deletion issues, allowing users to navigate to specific team details
 * and address the errors.
 *
 * Returns:
 * - A `Page` component containing a `Table` that lists league team deletion errors.
 *
 * Example:
 * ```jsx
 * <LeagueTeamDeletingInfo />
 * ```
 */
const LeagueTeamDeletingInfo = () => {
  const { deletedRecordsErrors } = useLeagueTeamsSlice()

  return (
    <DeletingInfoPage
      title="Deleting info"
      subtitle="This panel provides a summary of deleted league teams, listing the rows with errors. Click on the team name to view the
          details and correct the error that is preventing deletion."
      breadcrumbs={BREADCRUMB_ITEMS}
      dataSource={deletedRecordsErrors}
      objectColumnTitle="Team Name"
      pathToObject={PATH_TO_LEAGUE_TEAMS}
    />
  )
}

export default LeagueTeamDeletingInfo
