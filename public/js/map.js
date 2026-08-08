
mapboxgl.accessToken = mapToken;

const defaultCoordinates = [77.1025, 28.7041];
const listingCoordinates = listingGeometry && Array.isArray(listingGeometry.coordinates)
    ? listingGeometry.coordinates
    : defaultCoordinates;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v9",
    zoom: 9,
    center: listingCoordinates
});

const popupContent = document.createElement("div");
const popupTitle = document.createElement("h6");
const popupLocation = document.createElement("p");

popupTitle.textContent = listingTitle;
popupLocation.textContent = listingLocation;
popupContent.append(popupTitle, popupLocation);

new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(listingCoordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
    .addTo(map);
