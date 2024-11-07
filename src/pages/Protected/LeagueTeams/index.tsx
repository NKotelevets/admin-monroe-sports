import { Page } from '@/layouts/Page.tsx'
import { useState } from 'react'

const DELETE_TERMS = {
  singular: 'league team',
  plural: 'league teams'
}

const LeagueTeams = () => {
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null)



  return (
    <Page
      title="League Teams"
      onCreate={alert}
      onDelete={alert}
      deleteTerm={DELETE_TERMS}
      selectedIds={selectedIds}
    >
      <div onClick={() => setSelectedIds(null)}>hellow</div>
    </Page>
  )
}

export default LeagueTeams
