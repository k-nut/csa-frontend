import _ from "lodash";

const BASE_URL = process.env.REACT_APP_API || "http://localhost:5000/api/v1";

const fetchAuthenticated = (url, params) => {
  return fetch(url, {
    ...{
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache"
      },
      ...params
    }
  });
};

const dictToQueryString = dict => {
  const params = _.map(dict, (value, key) => `${key}=${value}`);
  return `?${params.join("?")}`;
};

const getShares = () => {
  return fetchAuthenticated(`${BASE_URL}/shares`)
    .then(res => res.json())
    .then(json => json.shares);
};

const getSharesPayments = () => {
  return fetchAuthenticated(`${BASE_URL}/shares/payment_status`)
    .then(res => res.json())
    .then(json => json.shares);
};

const updateShare = share => {
  const url = share.id
    ? `${BASE_URL}/shares/${share.id}`
    : `${BASE_URL}/shares`;
  return fetchAuthenticated(url, {
    method: "post",
    body: JSON.stringify(share)
  })
    .then(res => res.json())
    .then(json => json.share);
};

const updateDeposit = deposit => {
  return fetchAuthenticated(`${BASE_URL}/deposits/${deposit.id}`, {
    method: "post",
    body: JSON.stringify(deposit)
  })
    .then(res => res.json())
    .then(json => json.deposit);
};

const addDeposit = deposit => {
  return fetchAuthenticated(`${BASE_URL}/deposits/`, {
    method: "put",
    body: JSON.stringify(deposit)
  })
    .then(res => res.json())
    .then(json => json.deposit);
};

const getStations = () => {
  return fetchAuthenticated(`${BASE_URL}/stations`)
    .then(res => res.json())
    .then(json => json.stations);
};

const login = (email, password) => {
  return fetchAuthenticated(`${BASE_URL}/login`, {
    method: "post",
    body: JSON.stringify({ email, password })
  }).then(res => {
    if (res.status !== 200) {
      throw new Error("Login failed");
    }
    return res.json();
  });
};

const logout = () => {
  return fetchAuthenticated(`${BASE_URL}/logout`).then(res => res.json());
};

const getShare = id => {
  return fetchAuthenticated(`${BASE_URL}/shares/${id}`)
    .then(res => res.json())
    .then(json => json.share);
};

const getShareDeposits = id => {
  return fetchAuthenticated(`${BASE_URL}/shares/${id}/deposits`)
    .then(res => res.json())
    .then(json => json.deposits);
};

const getPerson = id => {
  return fetchAuthenticated(`${BASE_URL}/person/${id}`).then(res => res.json());
};

const getUserEmails = () => {
  return fetchAuthenticated(`${BASE_URL}/users`).then(res => res.json());
};

const getShareEmails = shareId => {
  return fetchAuthenticated(`${BASE_URL}/shares/${shareId}/emails`).then(res =>
    res.json()
  );
};

const getBets = shareId => {
  return fetchAuthenticated(`${BASE_URL}/shares/${shareId}/bets`).then(res =>
    res.json()
  );
};

const getMembers = filters => {
  const url = `${BASE_URL}/members`;
  const queryParams = filters ? dictToQueryString(filters) : "";
  return fetchAuthenticated(`${url}${queryParams}`).then(res => res.json());
};

const deleteBet = (shareId, betId) => {
  return fetchAuthenticated(`${BASE_URL}/shares/${shareId}/bets/${betId}`, {
    method: "DELETE"
  });
};

const updateBet = (shareId, bet) => {
  return fetchAuthenticated(`${BASE_URL}/shares/${shareId}/bets`, {
    method: "POST",
    body: JSON.stringify(bet)
  }).then(res => res.json());
};

const patchMember = (memberId, updatedFields) => {
  return fetchAuthenticated(`${BASE_URL}/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify(updatedFields)
  }).then(res => res.json());
};

const mergeShares = (share1, share2) => {
  return fetchAuthenticated(`${BASE_URL}/shares/merge`, {
    method: "post",
    body: JSON.stringify({ share1, share2 })
  }).then(res => res.json());
};

const uploadFile = file => {
  const formData = new FormData();
  formData.append("file", file);
  return fetchAuthenticated(`${BASE_URL}/deposits/upload`, {
    method: "post",
    body: formData,
    headers: {}
  }).then(res => res.json());
};

export default {
  getShares,
  getStations,
  getPerson,
  updateShare,
  login,
  logout,
  getShare,
  updateDeposit,
  addDeposit,
  mergeShares,
  uploadFile,
  getSharesPayments,
  getShareDeposits,
  getUserEmails,
  getBets,
  deleteBet,
  updateBet,
  getShareEmails,
  getMembers,
  patchMember
};
