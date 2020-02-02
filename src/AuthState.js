// This uses the Singleton pattern to store the current state
export default class AuthState {
  static instance;

  constructor() {
    if (AuthState.instance) {
      return AuthState.instance;
    }

    AuthState.instance = this;
  }

  clearToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authId");
  }

  setToken(token, id) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authId", id);
  }

  getId() {
    return localStorage.getItem('authId');
  }

  getToken() {
    const token = localStorage.getItem("authToken");
    // Clean up string null value that might have gotten into local storage
    if (token === "null") {
      this.clearToken();
      return null;
    }
    return token;
  }
}
