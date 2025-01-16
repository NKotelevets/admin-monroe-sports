import { IMatch, IParticipant } from '@/common/interfaces/bracket'

/**
 * Resolves seed conflicts by clearing seeds for conflicting participants.
 *
 * @param {IParticipant} participant - The current participant to evaluate.
 * @param {IParticipant} updatedParticipant - The updated participant data.
 * @param {string} value - The new seed value to check for conflicts.
 * @returns {IParticipant} - The updated participant with conflicts resolved.
 */
const resolveSeedConflict = (
  participant: IParticipant,
  updatedParticipant: IParticipant,
  value: string
): IParticipant => {
  const hasSeedConflict =
    participant.seed === +value &&
    participant.subDivision === updatedParticipant.subDivision &&
    participant.id !== updatedParticipant.id
  return hasSeedConflict ? { ...participant, seed: null } : participant
}

export const updateCurrentParticipant = (participants: IParticipant[], id: string, name: string, value: string) => {
  // Find the current participant being updated
  const currentParticipant = participants.find((participant) => participant.id === id)
  if (!currentParticipant) return

  if (name === 'subdivision')
    return { ...currentParticipant, [name]: value, seed: null }

  return { ...currentParticipant, [name]: value }
}

/**
 * Updates participants of a match by applying the new value and resolving conflicts.
 *
 * @param {IMatch} match - The current match being updated.
 * @param {string} id - The ID of the participant to update.
 * @param {string} value - The new value to set.
 * @param {'seed' | 'subDivision'} name - The property being updated.
 * @returns {IParticipant[]} - The updated list of participants.
 */
export const updateMatchParticipants = (
  match: Partial<IMatch>,
  id: string,
  value: string,
  name: 'seed' | 'subDivision'
): IParticipant[] => {
  const currentParticipant = match?.matchParticipants?.find((p) => p.id === id) || []
  if (!currentParticipant) return match?.matchParticipants || []

  let updatedParticipant = { ...currentParticipant, [name]: name === 'seed' ? +value : value }

  if (name === 'seed') {
    updatedParticipant  = { ...currentParticipant, seed: +value }
  } else {
    updatedParticipant  = { ...currentParticipant, subDivision: value, seed: null }
  }

  return match?.matchParticipants?.map((participant) =>
    participant.id === id
      ? updatedParticipant as IParticipant
      : resolveSeedConflict(participant, updatedParticipant as IParticipant, value)
  ) || []
}

/**
 * Updates bracketMatches by applying updated participants and resolving conflicts.
 *
 * @param {IMatch[]} bracketMatches - The list of all bracketMatches.
 * @param {IMatch} match - The match being updated.
 * @param {IParticipant[]} updatedParticipants - The updated participants of the match.
 * @param {string} value - The new value to check for conflicts.
 * @param updatedParticipant
 * @returns {IMatch[]} - The updated list of bracketMatches.
 */
export const updateMatches = (
  bracketMatches: IMatch[],
  match: Partial<IMatch>,
  updatedParticipants: IParticipant[],
  updatedParticipant: IParticipant,
  value: string
): Partial<IMatch>[] => {
  return bracketMatches.map((m) => {
    if (m.id === match.id) {
      return { ...match, matchParticipants: updatedParticipants }
    }

    return {
      ...m,
      matchParticipants: m.matchParticipants.map((participant) => {
        const hasSeedConflict =
          participant.seed === +value &&
          participant.subDivision === updatedParticipant.subDivision

        if (hasSeedConflict) {
          return { ...participant, seed: null }
        }

        return participant
      })
    }
  })
}

