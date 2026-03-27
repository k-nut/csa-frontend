import authState from "./AuthState";
import { AddDeposit, Bet, Deposit } from "../models";

const BASE_URL = process.env.REACT_APP_API || "http://localhost:5000/api/v1";

export interface ShareModel {
  archived: boolean;
  difference_today: number;
  expected_today: number;
  id: number;
  name: string;
  note: string;
  number_of_deposits: number;
  station_name: string;
  total_deposits: number;
  total_security: number;
}
// eslint-disable-next-line
type Member = any;

class Api {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authState.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      authState.clearToken();
    } else if (response.status === 403) {
      // Currently, the API only ever returns a 403 response if the user
      // needs to change their password before they can interact with
      // the endpoint.
      authState.requirePasswordChange();
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  getShares = () => {
    return this.request<{ shares: ShareModel[] }>("/shares").then(
      (data) => data.shares
    );
  };

  getShare = (id: string) => {
    return this.request<{ share: ShareModel }>(`/shares/${id}`).then(
      (data) => data.share
    );
  };

  getShareDeposits = (id: string) => {
    return this.request<{ deposits: Deposit[] }>(`/shares/${id}/deposits`).then(
      (data) => data.deposits
    );
  };

  getSharesPayments = (): Promise<ShareModel[]> => {
    return this.request<{ shares: ShareModel[] }>(
      "/shares/payment_status"
    ).then((data) => data.shares);
  };

  login = (email: string, password: string) => {
    return this.request("/login", {
      method: "POST",
      headers: {},
      body: JSON.stringify({ email, password }),
    });
  };

  updateShare = (share: ShareModel) => {
    const endpoint = share.id ? `/shares/${share.id}` : "/shares";
    return this.request<{ share: ShareModel }>(endpoint, {
      method: "POST",
      body: JSON.stringify(share),
    }).then((data) => data.share);
  };

  patchShare = (
    shareId: number,
    update: Partial<Pick<ShareModel, "note" | "archived">>
  ) => {
    return this.request<{ share: ShareModel }>(`/shares/${shareId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    }).then((data) => data.share);
  };

  patchDeposit = (id: number, deposit: Partial<Deposit>) => {
    return this.request<{ deposit: Deposit }>(`/deposits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(deposit),
    }).then((data) => data.deposit);
  };

  addDeposit = (deposit: AddDeposit): Promise<Deposit> => {
    return this.request<{ deposit: Deposit }>("/deposits/", {
      method: "POST",
      body: JSON.stringify(deposit),
    }).then((data) => data.deposit);
  };

  getStations = () => {
    return this.request<{ stations: any[] }>("/stations").then(
      (data) => data.stations
    );
  };

  getUserEmails = () => {
    return this.request("/users");
  };

  getShareEmails = (shareId: number) => {
    return this.request(`/shares/${shareId}/emails`);
  };

  getBets = (shareId: number): Promise<Bet[]> => {
    return this.request<{ bets: Bet[] }>(`/shares/${shareId}/bets`).then(
      (data) => data.bets
    );
  };

  getMembers = (filters?: { active: boolean }) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters as any)}`
      : "";
    return this.request(`/members${queryParams}`);
  };

  deleteBet = (shareId: number, betId: number) => {
    return this.request(`/shares/${shareId}/bets/${betId}`, {
      method: "DELETE",
    });
  };

  postBet = (shareId: number, bet: Bet) => {
    const { share_id, ...payload } = bet;
    return this.request(`/shares/${shareId}/bets`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  putBet = (bet: Bet) => {
    const { id, share_id, ...payload } = bet;
    return this.request(`/bets/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  };

  updateBet = (shareId: number, bet: Bet) => {
    if (bet.id) {
      return this.putBet(bet);
    }
    return this.postBet(shareId, bet);
  };

  patchMember = (memberId: number, updatedFields: Partial<Member>) => {
    return this.request(`/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify(updatedFields),
    });
  };

  deleteMember = (memberId: number) => {
    return this.request(`/members/${memberId}`, {
      method: "DELETE",
    });
  };

  createMember = (member: Member) => {
    return this.request("/members", {
      method: "POST",
      body: JSON.stringify(member),
    });
  };

  mergeShares = (share1: number, share2: number) => {
    return this.request("/shares/merge", {
      method: "POST",
      body: JSON.stringify({ share1, share2 }),
    });
  };

  // TODO: Change to `PUT /users/${userId}/password`
  changePassword = (password: string) => {
    const userId = authState.getId();
    return this.request(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ password }),
    });
  };

  // TODO: Move to AuthSate or AuthService and have it called from there
  logout() {
    authState.clearToken();
  }
}

export default new Api();
