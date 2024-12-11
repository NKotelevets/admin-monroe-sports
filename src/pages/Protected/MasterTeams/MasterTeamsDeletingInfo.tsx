import { MonroeBlueText } from '@/components/Elements'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'

import DeletingInfoPage from '@/layouts/DeletingInfoPage.tsx'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Deleting info</MonroeBlueText> }
]

const MasterTeamsDeletingInfo = () => {
  const { deletedRecordsErrors } = useMasterTeamsSlice()

  return (
    <DeletingInfoPage
      title="Deleting info"
      subtitle="This panel provides a summary of deleted master teams, listing the rows with errors. Click on the name to view the
          details and correct the error that is preventing deletion."
      breadcrumbs={BREADCRUMB_ITEMS}
      dataSource={deletedRecordsErrors}
      objectColumnTitle="Team Name"
      pathToObject={PATH_TO_MASTER_TEAMS}
    />
  )
}

export default MasterTeamsDeletingInfo

