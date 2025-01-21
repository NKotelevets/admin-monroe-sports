import { Flex } from 'antd'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'
import { PATH_TO_EDIT_SEASON } from '@/common/constants/paths.ts'
import styled from '@emotion/styled'
import { ExportPlayoffButton } from '../ExportPlayoffButton'
import { PopulateBracketsButton } from '@/pages/Protected/Seasons/components/PopulateBracketsButton.tsx'

export const SeasonFormControls = () => {
  const { showBracketPage } = useSeasonFormContext()

  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)
  if (!showBracketPage || !isEditPage) return <></>

  return (
    <Flex>
      <Controls>
        <ExportPlayoffButton />
        <PopulateBracketsButton />
      </Controls>
    </Flex>
  )
}

// Styled Components
const Controls = styled(Flex)`
    margin-top: 8px;
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
`
