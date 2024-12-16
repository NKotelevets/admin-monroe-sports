import { useEffect, useState } from 'react'

import { MonroeBlueText } from '@/components/Elements'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { PATH_TO_SEASONS } from '@/common/constants/paths'
import { Page } from '@/layouts/Page'
import { SeasonForm } from '@/pages/Protected/Seasons/components/SeasonForm'

const INITIAL_BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS}>Seasons</a>
  },
  {
    title: <MonroeBlueText>Create season</MonroeBlueText>
  }
]

const CreateSeason = () => {
  const { selectedLeague } = useSeasonSlice()
  const [selectedLeagueTournament, setSelectedLeagueTournament] = useState<string | undefined>('')
  const { isCreateBracketPage, setIsCreateBracketPage, setSelectedBracketId, setSelectedLeague } = useSeasonSlice()

  useEffect(() => {
    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
    if (selectedLeague && !selectedLeagueTournament) setSelectedLeagueTournament(selectedLeague.name)

    setSelectedLeague(null)
  }, [])

  const BREAD_CRUMB_ITEMS = isCreateBracketPage ? [
    { title: <a href={PATH_TO_SEASONS}>Seasons</a> },
    {
      title: (
        <a
          onClick={() => {
            setIsCreateBracketPage(false)
            setSelectedBracketId(null)
          }}
        >
          Create season
        </a>
      )
    },
    { title: <MonroeBlueText>Create Bracket</MonroeBlueText> }
  ] : INITIAL_BREAD_CRUMB_ITEMS

  return (
    <Page
      title="Create Season"
      breadcrumbs={BREAD_CRUMB_ITEMS}
    >
      <SeasonForm />
    </Page>
  )
}

export default CreateSeason
