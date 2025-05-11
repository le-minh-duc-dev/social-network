export class LocalStorageService
  implements ExternalStorageService<string, string>
{
  saveItem(key: string, item: string) {
    localStorage.setItem(key, item)
  }
  
  getItem(key: string) {
    return localStorage.getItem(key)
  }
}
