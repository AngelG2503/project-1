const apiKey = window.mapToken;
const listingGeometry = window.listingGeometry;
const listingTitle = window.listingTitle;

const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
    center: listingGeometry,
    zoom: 9
});
console.log(listingGeometry)
const marker = new maplibregl.Marker({color:"#fe424d"})
  .setLngLat(listingGeometry)
  .setPopup(new maplibregl.Popup({offset:25})
  .setHTML(`<h4>${listingTitle}</h4><p>Exact Location will be provided after booking</p>`))
  .addTo(map);

map.addControl(new maplibregl.NavigationControl());
