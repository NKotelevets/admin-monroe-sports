import { Button, Flex } from 'antd'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { PATH_TO_EDIT_SEASON } from '@/common/constants/paths.ts'
import { FileExcelOutlined, SwapOutlined } from '@ant-design/icons'
// import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
// import { useUpdateSeasonMutation } from '@/redux/seasons/seasons.api.ts'
// import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
// import { ICreateBESeason } from '@/common/interfaces/season.ts'
// import { format } from 'date-fns'
import MonroeModal from '@/components/MonroeModal.tsx'
import { createPortal } from 'react-dom'
// import { BEST_RECORD_WINS, POINTS } from '@/common/constants/league.ts'
// import { useAuthSlice } from '@/redux/hooks/useAuthSlice.ts'
import { useState } from 'react'
import styled from '@emotion/styled'
// import { useNotification } from '@/hooks/useNotification.ts'

export const SeasonFormControls = () => {
  const { showBracketPage } = useSeasonFormContext()
  // const { selectedBracketId } = useSeasonSlice()
  // const { access } = useAuthSlice()
  // const { notify } = useNotification()
  const [showModal, setShowModal] = useState(false)
  // const [updateSeason] = useUpdateSeasonMutation()
  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)

  if (!showBracketPage || !isEditPage) return <></>

  // const handleExport = async () => {
  //   if (selectedBracketId) {
  //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}teams/seasons/export-bracket`, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${access}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         id: selectedBracketId
  //       })
  //     })
  //     const fileData = await response.blob()
  //
  //     if (!fileData) return
  //
  //     let bracketName = 'bracket'
  //
  //     currentData?.divisions.map((div) =>
  //       div.brackets?.map((bracket) => {
  //         if (bracket.id === selectedBracketId) {
  //           bracketName = bracket.name
  //         }
  //       })
  //     )
  //
  //     const blob = new Blob([fileData], { type: 'text/csv' })
  //     const url = URL.createObjectURL(blob)
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', `${bracketName}.csv`)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     URL.revokeObjectURL(url)
  //   }
  // }
  //
  // const handlePopulateBrackets = async (values: ICreateSeasonFormValues) => {
  //   const editSeasonBody: ICreateBESeason = {
  //     name: values.name,
  //     league_id: values.league,
  //     start_date: format(new Date(values.startDate as unknown as string), 'yyyy-MM-dd'),
  //     expected_end_date: format(new Date(values.expectedEndDate as unknown as string), 'yyyy-MM-dd'),
  //     divisions: values.divisions.map((division) => ({
  //       name: division.name,
  //       description: division.description,
  //       sub_division: division.subdivisions.map((subdivision) => ({
  //         name: subdivision.name,
  //         description: subdivision.description,
  //         playoff_format: subdivision.playoffFormat === BEST_RECORD_WINS ? 0 : 1,
  //         standings_format: subdivision.standingsFormat !== POINTS ? 0 : 1,
  //         tiebreakers_format: subdivision.tiebreakersFormat !== POINTS ? 0 : 1,
  //         changed: subdivision.changed,
  //         brackets: subdivision.brackets.map((bracket) => ({
  //           id: bracket.id as number,
  //           name: bracket.name,
  //           number_of_teams: bracket.playoffTeams,
  //           published: true,
  //           matches: bracket.matches.map((match) => ({
  //             bottom_team: match.bottomTeam || '',
  //             top_team: match.topTeam || '',
  //             game_number: match.gameNumber || null,
  //             match_integer_id: match.id,
  //             is_not_first_round: match.isNotFirstRound || false,
  //             start_time: null,
  //             tournament_round_text: match.tournamentRoundText || '',
  //             next_match_id: match.nextMatchId,
  //             match_participants: match.participants
  //               .map((p) => ({
  //                 sub_division: p.subpoolName,
  //                 seed: p.seed,
  //                 is_empty: p.isEmpty
  //               }))
  //               .filter((p) => p?.sub_division)
  //           })),
  //           subdivision: bracket.subdivisionsNames
  //         }))
  //       }))
  //     }))
  //   }
  //
  //   setShowModal(true)
  //
  //   updateSeason({
  //     id: data!.id as string,
  //     body: editSeasonBody
  //   }).then(() => {
  //     notify('Bracket successfully populated', 'success')
  //   })
  // }

  return (
    <Flex>
      <Controls>
        <Button
          icon={<FileExcelOutlined />}
          iconPosition="start"
          type="default"
          // onClick={handleExport}
        >
          Export Playoff Template CSV
        </Button>

        <Button
          iconPosition="start"
          disabled
          icon={<SwapOutlined />}
          type="primary"
          className="h-32"
          // onClick={() => handlePopulateBrackets(values)}
        >
          Populate Brackets
        </Button>
      </Controls>

      {showModal &&
        createPortal(
          <MonroeModal
            okText="Confirm"
            onOk={() => {
              setShowModal(false)
            }}
            onCancel={() => {
              setShowModal(false)
            }}
            title="Playoff phase is not ready"
            type="warn"
            content={
              <p>
                It seems that there is at least one Game with Scores pending to be added and this might impact on
                Teams placed on the Brackets. You may proceed, but reviewing it is advisable.
              </p>
            }
          />,
          document.body
        )}

    </Flex>
  )
}

const Controls = styled(Flex)`
    margin-top: 8px;
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
`
