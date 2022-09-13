export function getItem<T>(key: string, defaultValue: T): T {
  let storage = defaultValue
  try {
    const value = localStorage.getItem(key)
    if (value) {
      storage = JSON.parse(value)
    }
  } catch (e) {
    console.log(`getItem: [${key}] --- `, e)
  }
  return storage
}

export function setItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log(`setItem: [${key}] --- `, e)
  }
}
