const BASE_URL = process.env.REACT_APP_API || 'http://localhost:5000/api/v1';

const fetchAuthenticated = (url, params) => {
    return fetch(url, {
        ...{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            }, ...params
        },
    })
};

const getShares = () => {
    return fetchAuthenticated(`${BASE_URL}/shares`)
        .then(res => res.json())
        .then(json => json.shares)
};

const updateShare = (share) => {
    return fetchAuthenticated(`${BASE_URL}/shares/${share.id}`,
        {
            method: 'post',
            body: JSON.stringify(share),
        }
    )
        .then(res => res.json())
        .then(json => json.share)
};

const updateDeposit = (deposit) => {
    return fetchAuthenticated(`${BASE_URL}/deposits/${deposit.id}`,
        {
            method: 'post',
            body: JSON.stringify(deposit),
        }
    )
        .then(res => res.json())
        .then(json => json.deposit)
};

const addDeposit = (deposit) => {
    return fetchAuthenticated(`${BASE_URL}/deposits/`,
        {
            method: 'put',
            body: JSON.stringify(deposit),
        }
    )
        .then(res => res.json())
        .then(json => json.deposit)
};

const getStations = () => {
    return fetchAuthenticated(`${BASE_URL}/stations`)
        .then(res => res.json())
        .then(json => json.stations);
};

const login = (email, password) => {
    return fetchAuthenticated(`${BASE_URL}/login`,
        {
            method: 'post',
            body: JSON.stringify({email, password}),
        }
    )
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Login failed');
            }
            return res.json()
        })
};

const logout = () => {
    return fetchAuthenticated(`${BASE_URL}/logout`)
        .then(res => res.json())
};

const getShare = (id) => {
    return fetchAuthenticated(`${BASE_URL}/shares/${id}`)
        .then(res => res.json())
        .then(json => json.share)
}

const mergeShares = (share1, share2) => {
    return fetchAuthenticated(`${BASE_URL}/shares/merge`, {
            method: 'post',
            body: JSON.stringify({share1, share2}),
        }
    ).then(res => res.json())
}


export default {getShares, getStations, updateShare, login, logout, getShare, updateDeposit, addDeposit, mergeShares}
