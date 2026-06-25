export interface User {
  _id: string;
  name: string;
  email: string;
  level: string;
  createdAt?: string;
  updatedAt?: string;
}

export function saveUserSession(user: User): void {
  try {
    localStorage.setItem('vm_user_session', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
}

export function getUserSession(): User | null {
  try {
    const data = localStorage.getItem('vm_user_session');
    if (!data) return null;
    return JSON.parse(data) as User;
  } catch (error) {
    console.error('Failed to parse user session:', error);
    return null;
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem('vm_user_session');
  } catch (error) {
    console.error('Failed to clear user session:', error);
  }
}
