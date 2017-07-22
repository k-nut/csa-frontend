const BASE_URL = process.env.REACT_APP_API || 'http://localhost:5000/api/v1';

const fetchAuthenticated = (url, params) => {
    return fetch(url, { ...{
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        }, ...params},
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
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }
    )
        .then(res => res.json())
        .then(json => json.share)
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
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }
    )
        .then(res => res.json())
};

const logout = () => {
    return fetchAuthenticated(`${BASE_URL}/logout`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            credentials: 'include'
        })
        .then(res => res.json())
};

const getShare = (id) => {
    return fetchAuthenticated(`${BASE_URL}/shares/${id}`)
        .then(res => res.json())
        .then(json => json.share)
}


export default {getShares, getStations, updateShare, login, logout, getShare}
