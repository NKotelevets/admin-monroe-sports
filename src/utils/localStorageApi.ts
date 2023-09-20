type LocalStorageKeysType = "accessToken" | "refreshToken";

class LocalStorage {
  get<T = unknown>(key: LocalStorageKeysType): T | null {
    const _value = localStorage.getItem(key) || "";
    return _value ? JSON.parse(_value) : _value;
  }
  set(key: LocalStorageKeysType, value: unknown) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  removeItem(key: LocalStorageKeysType) {
    return localStorage.removeItem(key);
  }
  clear() {
    return localStorage.clear();
  }
}

const lsApi = new LocalStorage();

export { lsApi };
