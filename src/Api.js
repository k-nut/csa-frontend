const getShares = () => {
    return fetch(`http://localhost:5000/api/v1/shares`)
        .then(res => res.json())
        .then(json => json.shares)
};

const updateShare = (share) => {
    return fetch(`http://localhost:5000/api/v1/shares/${share.id}`,
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
    return fetch(`http://localhost:5000/api/v1/stations`)
        .then(res => res.json())
        .then(json => json.stations);
};


export default {getShares, getStations, updateShare}
