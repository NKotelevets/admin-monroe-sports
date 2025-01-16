import { useCallback, useState } from 'react'

export const useAccordionFormContext = () => {
  const [activeKey, setActiveKey] = useState<string | string[]>('0')

  const handleCollapseChange = useCallback((key: string | string[]) => {
    setActiveKey(key)
  }, [])

  return {
    activeKey,
    setActiveKey,
    handleCollapseChange
  }
}
