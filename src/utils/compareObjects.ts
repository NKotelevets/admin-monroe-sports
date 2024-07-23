// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareObjects = (obj1: Record<string, any>, obj2: Record<string, any>) => {
  const differences: Record<string, boolean> = {}

  for (const key in obj1) {
    if (obj2[key]) {
      if (obj1[key] !== obj2[key]) {
        differences[key] = true
      }
    } else {
      differences[key] = true
    }
  }

  return differences
}

