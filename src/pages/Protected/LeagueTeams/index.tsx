import { Page } from '@/layouts/Page.tsx'
import { useCallback, useState } from 'react'
import { LeagueTeamsTable } from './components/LeagueTeamsTable'

const DELETE_TERMS = {
  singular: 'league team',
  plural: 'league teams'
}

const LeagueTeams = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [singleDeleting, setSingleDeleting] = useState<boolean>(false)

  const onDeleteModalClose = useCallback(() => {
    if (singleDeleting) {
      setSelectedIds([])
    }
    setSingleDeleting(false)
  }, [singleDeleting])

  return (
    <Page
      title="League Teams"
      onCreate={alert}
      onDelete={alert}
      onDeleteModalClose={onDeleteModalClose}
      deleteTerm={DELETE_TERMS}
      selectedIds={selectedIds}
      singleDeleting={singleDeleting}
    >
      <LeagueTeamsTable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setSingleDeleting={setSingleDeleting}
      />
    </Page>
  )
}

export default LeagueTeams
