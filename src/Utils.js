import { includes } from "lodash";

export function filterNameAndStation(searchText) {
  return share => {
    if (!searchText) {
      return true;
    }
    const term = searchText.toLowerCase();
    const nameMatches = share.name && includes(share.name.toLowerCase(), term);
    const stationMatches =
      share.station_name && includes(share.station_name.toLowerCase(), term);
    return nameMatches || stationMatches;
  };
}
