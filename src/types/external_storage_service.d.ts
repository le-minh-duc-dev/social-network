interface ExternalStorageService<K, T> {
  saveItem: (key: K, item: T) => void
  getItem: (key: K) => T | null
}
