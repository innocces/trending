export function safeParse<T>(value: string): T {
  try {
    value = JSON.parse(value)
  } catch (e) {
    console.log(`parse error --- `, e)
  }
  return value as T
}

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

export function addListener<T>(
  key: string,
  fn: (newValue: T, oldValue: T) => void
) {
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === key) {
      const newestValue = safeParse<T>(event.newValue ?? '')
      const prevValue = safeParse<T>(event.oldValue ?? '')
      fn?.(newestValue, prevValue)
    }
  })
}
