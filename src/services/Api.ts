import AuthState from "./AuthState";
import axios, { Axios } from "axios";
import { AddDeposit, Bet, Deposit } from "../models";

const BASE_URL = process.env.REACT_APP_API || "http://localhost:5000/api/v1";
const authState = new AuthState();

// TODO: Define proper types
type Share = any;
type Member = any;

class Api {
  client: Axios;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = authState.getToken();
        if (!token) {
          return config;
        }
        return {
          ...config,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        };
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            authState.clearToken();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getShares() {
    return this.client.get("/shares").then((response) => response.data.shares);
  }

  getShare(id: string) {
    return this.client
      .get(`/shares/${id}`)
      .then((response) => response.data.share);
  }

  getShareDeposits(id: string) {
    return this.client
      .get(`/shares/${id}/deposits`)
      .then((response) => response.data.deposits);
  }

  getSharesPayments() {
    return this.client
      .get(`/shares/payment_status`)
      .then((response) => response.data.shares);
  }

  login(email: string, password: string) {
    return this.client
      .post("/login", { email, password }, { headers: undefined })
      .then((response) => response.data);
  }

  updateShare(share: Share) {
    return this.client
      .post(share.id ? `/shares/${share.id}` : `/shares`, share)
      .then((response) => response.data.share);
  }

  patchShare(
    shareId: number,
    update: Partial<Pick<Share, "note" | "archived">>
  ) {
    return this.client
      .patch(`/shares/${shareId}`, update)
      .then((response) => response.data.share);
  }

  patchDeposit(id: number, deposit: Partial<Deposit>) {
    return this.client
      .patch(`/deposits/${id}`, deposit)
      .then((response) => response.data.deposit);
  }

  addDeposit(deposit: AddDeposit): Promise<Deposit> {
    return this.client
      .post(`/deposits/`, deposit)
      .then((response) => response.data.deposit);
  }

  getStations() {
    return this.client
      .get(`/stations`)
      .then((response) => response.data.stations);
  }

  getUserEmails() {
    return this.client.get(`/users`).then((response) => response.data);
  }

  getShareEmails(shareId: number) {
    return this.client
      .get(`/shares/${shareId}/emails`)
      .then((response) => response.data);
  }

  getBets(shareId: number) {
    return this.client
      .get(`/shares/${shareId}/bets`)
      .then((response) => response.data);
  }

  getMembers(filters?: { active: boolean }) {
    return this.client
      .get("/members", {
        params: filters,
      })
      .then((response) => response.data);
  }

  deleteBet = (shareId: number, betId: number) => {
    return this.client.delete(`/shares/${shareId}/bets/${betId}`);
  };

  postBet = (shareId: number, bet: Bet) => {
    return this.client
      .post(`/shares/${shareId}/bets`, bet)
      .then((response) => response.data);
  };

  putBet(bet: Bet) {
    const { id, share_id, ...payload } = bet;
    return this.client
      .put(`/bets/${id}`, payload)
      .then((response) => response.data);
  }

  updateBet = (shareId: number, bet: Bet) => {
    if (bet.id) {
      return this.putBet(bet);
    }
    return this.postBet(shareId, bet);
  };

  patchMember = (memberId: number, updatedFields: Partial<Member>) => {
    return this.client
      .patch(`/members/${memberId}`, updatedFields)
      .then((response) => response.data);
  };

  deleteMember(memberId: number) {
    return this.client.delete(`/members/${memberId}`);
  }

  createMember(member: Member) {
    return this.client.post(`/members`, member);
  }

  mergeShares(share1: number, share2: number) {
    return this.client
      .post(`/shares/merge`, { share1, share2 })
      .then((response) => response.data);
  }

  // TODO: Change to `PUT /users/${userId}/password`
  changePassword(password: string) {
    const userId = authState.getId();
    return this.client.patch(`/users/${userId}`, { password });
  }

  // TODO: Move to AuthSate or AuthService and have it called from there
  logout() {
    authState.clearToken();
  }
}

export default new Api();
