export class LocalSessionStorage {
    static prefix = 'ntelio.admin';  
  
    static setItem(key, value) {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(this.prefix + key, serializedValue);
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
      }
    }
  
    static getItem(key, defaultValue) {
      try {
        const item = localStorage.getItem(this.prefix + key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return defaultValue;
      }
    }
  
    static removeItem(key) {
      try {
        localStorage.removeItem(this.prefix + key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
    }
  
    static clear() {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.prefix))
          .forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.error('Error clearing items from localStorage:', error);
      }
    }
  }