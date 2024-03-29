class AuthState {
  onChange?: () => void;
  needsPasswordChange = false;
  loading = true;

  constructor() {
    this.clearToken = this.clearToken.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  clearToken() {
    this.loading = false;
    localStorage.removeItem("authToken");
    localStorage.removeItem("authId");

    this.onChange?.();
  }

  setToken(token: string, id: string) {
    this.loading = false;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authId", id);

    this.onChange?.();
  }

  requirePasswordChange() {
    this.loading = false;
    this.needsPasswordChange = true;
    this.onChange?.();
  }

  get isLoggedIn() {
    return Boolean(this.getToken());
  }

  getId() {
    return localStorage.getItem("authId");
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

export default new AuthState();
