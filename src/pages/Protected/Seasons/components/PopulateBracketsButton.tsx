import { useNotification } from '@/hooks/useNotification.ts'
import { SwapOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { usePopulateBracketsMutation } from '@/redux/seasons/seasons.api.ts'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { useBracketIssues } from '../hooks/useBracketIssues'
import { TPopulateBracketsBody } from '@/common/types/season.ts'

export const PopulateBracketsButton = () => {
  const { notify } = useNotification()
  const { bracketData } = useSeasonFormContext()
  const { handleBracketIssues } = useBracketIssues()

  const [populateBrackets, { isLoading }] = usePopulateBracketsMutation()

  const handlePopulateBrackets = async (ignore?: { score?: boolean, games?: boolean }) => {
    if (!bracketData) return

    const populateBracketBody: TPopulateBracketsBody = {
      id: bracketData.id!,
      name: bracketData.name,
      division: bracketData.subdivisionsNames,
      number_of_teams: bracketData.playoffTeams,
      matches: bracketData.matches,
      published: true
    }

    populateBrackets({
      id: bracketData.id!,
      body: {
        ...populateBracketBody,
        ignore_feature_games: ignore?.games || false,
        ignore_future_games: ignore?.games || false,
        ignore_noscore_games: ignore?.score || false
      }
    })
      .unwrap()
      .then(() => {
        notify('Bracket successfully populated', 'success')
      })
      .catch(async (error) => {
        if (error.status === '409' && error.data.details) {
          const result = await handleBracketIssues(error.data.details)
          if (result.ignore) {
            handlePopulateBrackets({games: result.games, score: result.score})
          }
        }

        notify(
          error?.data?.details || error?.data?.detail || 'Something went wrong. Please, try again!',
          'error'
        )
      })
  }

  return (
    <Button
      iconPosition="start"
      icon={<SwapOutlined />}
      loading={isLoading}
      disabled={isLoading}
      type="primary"
      className="h-32"
      onClick={() => handlePopulateBrackets()}
    >
      Populate Brackets
    </Button>
  )
}
