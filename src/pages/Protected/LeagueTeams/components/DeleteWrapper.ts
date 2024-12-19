import styled from '@emotion/styled'
import { colors } from '@/utils/colors.tsx'

export const DeleteWrapper = styled.div<{ disabled?: boolean }>`
    color: ${({ disabled }) => disabled !== true ? colors.primary : colors.dimLight};
`
