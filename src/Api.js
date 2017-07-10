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
    return fetchAuthenticated(`http://localhost:5000/api/v1/shares`)
        .then(res => res.json())
        .then(json => json.shares)
};

const updateShare = (share) => {
    return fetchAuthenticated(`http://localhost:5000/api/v1/shares/${share.id}`,
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
    return fetchAuthenticated(`http://localhost:5000/api/v1/stations`)
        .then(res => res.json())
        .then(json => json.stations);
};

const login = (email, password) => {
    return fetchAuthenticated(`http://localhost:5000/api/v1/login`,
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
    return fetchAuthenticated(`http://localhost:5000/api/v1/logout`,
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


export default {getShares, getStations, updateShare, login, logout}
