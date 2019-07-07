// This uses the Singleton pattern to store the current state
export default class AuthState {
  static instance;

  constructor() {
    if (AuthState.instance) {
      return AuthState.instance;
    }

    this.accessToken = null;
    AuthState.instance = this;
  }

  setToken(token) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }
}
