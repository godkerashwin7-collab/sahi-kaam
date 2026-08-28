// ============================================================
// SAHI KAAMWALA — Address search + map picker
// ------------------------------------------------------------
// Uses OpenStreetMap tiles + the free Nominatim geocoding API.
// No API key or billing account needed. Nominatim has a fair-use
// rate limit (~1 request/second) — fine for this use case, but if
// you outgrow it, look at Google Places Autocomplete or Mapbox.
//
// Supports multiple independent map instances on the same page
// (e.g. one always-visible on the homepage, one inside a booking
// form) via SahiAddressMap.create({...}).
// ============================================================

(function () {
  const DEFAULT_CENTER = [19.0760, 72.8777]; // Mumbai
  const SEARCH_DEBOUNCE_MS = 400;

  function el(id) { return document.getElementById(id); }

  /**
   * Creates one independent address picker instance.
   * config:
   *   mapId          - id of the map container div
   *   searchInputId  - id of the text input for searching
   *   suggestionsId  - id of the dropdown container for results
   *   locateBtnId    - id of the "use my location" button (optional)
   *   addressFieldId - id of a text/textarea to receive the chosen address (optional)
   *   latFieldId     - id of a hidden input to receive latitude (optional)
   *   lngFieldId     - id of a hidden input to receive longitude (optional)
   *   onChange(result)- callback fired whenever a location is chosen, with
   *                      { address, lat, lng }
   */
  function create(config) {
    let map = null;
    let marker = null;
    let searchTimer = null;
    let initialized = false;

    function setAddressText(text) {
      if (config.addressFieldId) {
        const f = el(config.addressFieldId);
        if (f) f.value = text;
      }
    }

    function setCoords(lat, lon) {
      if (config.latFieldId) { const f = el(config.latFieldId); if (f) f.value = lat; }
      if (config.lngFieldId) { const f = el(config.lngFieldId); if (f) f.value = lon; }
    }

    function notifyChange(address, lat, lon) {
      if (typeof config.onChange === "function") {
        config.onChange({ address, lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    }

    function setMarker(lat, lon) {
      if (!map) return;
      const latlng = [lat, lon];
      if (marker) {
        marker.setLatLng(latlng);
      } else {
        marker = L.marker(latlng, { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          reverseGeocode(pos.lat, pos.lng);
        });
      }
      map.setView(latlng, 16);
    }

    async function reverseGeocode(lat, lon) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
        );
        const data = await res.json();
        if (data && data.display_name) {
          setAddressText(data.display_name);
          setCoords(lat, lon);
          const searchInput = el(config.searchInputId);
          if (searchInput) searchInput.value = data.display_name;
          notifyChange(data.display_name, lat, lon);
        }
      } catch (err) {
        console.warn("Reverse geocode failed:", err);
      }
    }

    async function searchAddress(query) {
      const suggestionsBox = el(config.suggestionsId);
      if (!suggestionsBox) return;
      if (!query || query.trim().length < 3) {
        suggestionsBox.classList.add("sr-hidden");
        suggestionsBox.innerHTML = "";
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
        );
        const results = await res.json();
        if (!results || !results.length) {
          suggestionsBox.innerHTML = `<div class="addr-suggestion-empty">No matches — try a nearby landmark or area name.</div>`;
          suggestionsBox.classList.remove("sr-hidden");
          return;
        }
        suggestionsBox.innerHTML = results.map((r, i) =>
          `<button type="button" class="addr-suggestion-item" data-idx="${i}">${r.display_name}</button>`
        ).join("");
        suggestionsBox.classList.remove("sr-hidden");

        suggestionsBox.querySelectorAll(".addr-suggestion-item").forEach(btn => {
          btn.addEventListener("click", () => {
            const r = results[parseInt(btn.getAttribute("data-idx"), 10)];
            const searchInput = el(config.searchInputId);
            if (searchInput) searchInput.value = r.display_name;
            setAddressText(r.display_name);
            setCoords(r.lat, r.lon);
            setMarker(parseFloat(r.lat), parseFloat(r.lon));
            notifyChange(r.display_name, r.lat, r.lon);
            suggestionsBox.classList.add("sr-hidden");
            suggestionsBox.innerHTML = "";
          });
        });
      } catch (err) {
        console.warn("Address search failed:", err);
      }
    }

    function useCurrentLocation() {
      const btn = config.locateBtnId ? el(config.locateBtnId) : null;
      if (!navigator.geolocation) {
        alert("Location access isn't available on this browser/device.");
        return;
      }
      const originalText = btn ? btn.textContent : "";
      if (btn) { btn.textContent = "📍 Locating..."; btn.disabled = true; }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMarker(pos.coords.latitude, pos.coords.longitude);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        },
        (err) => {
          console.warn("Geolocation failed:", err);
          alert("Couldn't get your location. Please allow location access, or search your address instead.");
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    function setFromExternal(address, lat, lon) {
      // Used to pre-fill this picker from a value chosen in another picker
      // (e.g. carry the homepage location into the booking form).
      if (!initialized) init();
      if (!map) return;
      const searchInput = el(config.searchInputId);
      if (searchInput) searchInput.value = address;
      setAddressText(address);
      setCoords(lat, lon);
      setMarker(parseFloat(lat), parseFloat(lon));
    }

    function init() {
      const mapEl = el(config.mapId);
      if (!mapEl || typeof L === "undefined") return;

      if (!initialized) {
        map = L.map(config.mapId, { attributionControl: true }).setView(DEFAULT_CENTER, 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        map.on("click", (e) => {
          setMarker(e.latlng.lat, e.latlng.lng);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        const searchInput = el(config.searchInputId);
        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimer);
            const query = e.target.value;
            searchTimer = setTimeout(() => searchAddress(query), SEARCH_DEBOUNCE_MS);
          });
        }
        document.addEventListener("click", (e) => {
          const wrap = searchInput ? searchInput.closest(".addr-search-wrap") : null;
          if (wrap && !e.target.closest(`#${config.mapId}`) && !wrap.contains(e.target)) {
            const box = el(config.suggestionsId);
            if (box) box.classList.add("sr-hidden");
          }
        });

        if (config.locateBtnId) {
          const locateBtn = el(config.locateBtnId);
          if (locateBtn) locateBtn.addEventListener("click", useCurrentLocation);
        }

        initialized = true;
      } else {
        // Container may have been hidden (display:none) when the map first
        // initialized, so Leaflet needs a nudge to recalculate its size.
        map.invalidateSize();
      }
    }

    return { init, setFromExternal };
  }

  window.SahiAddressMap = { create };
})();
