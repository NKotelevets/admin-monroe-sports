import { Modal } from 'antd'

export const useBracketIssues = () => {

  const handleBracketIssues = async (error?: string) => {
    if (error?.includes('score')) {
      const ignore = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: 'Playoff phase is not ready',
          content: `It seems that there is at least one Game with Scores pending to be added and this might impact on Teams placed on the Brackets. You may proceed, but reviewing it is advisable.`,
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false)
        })
      })

      return {
        ignore,
        score: ignore
      }
    }

    if (error?.includes('game')) {
      const ignore =  await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: 'Playoff phase is not ready',
          content: `It seems that this Season still has upcoming Games and this might impact on Teams placed on the Brackets. You may proceed, but reviewing it is advisable.`,
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        })
      })

      return {
        ignore,
        games: ignore
      }
    }

    return {
      ignore: false,
      score: false,
      games: false
    }
  }

  return {
    handleBracketIssues
  }
}
