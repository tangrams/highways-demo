/*jslint browser: true*/
/*global Tangram, gui */

(function () {
    'use strict';

    /*** Config ***/

    var tile_source = {
        source: {
            type: 'GeoJSONTileSource',
            url:  window.location.protocol+'//vector.mapzen.com/osm/all/{z}/{x}/{y}.json'
        },
        layers: 'layers.yaml',
        styles: 'styles.yaml'
    };

    var locations = {
        'London': [51.508, -0.105, 15],
        'New York': [40.70531887544228, -74.00976419448853, 16],
        'Seattle': [47.609722, -122.333056, 15],
        'Oakland': [37.80975004772091, -122.27886199951173, 14]
    };

    var osm_debug = false;

    /*** URL parsing ***/
    var url_hash = window.location.hash.slice(1, window.location.hash.length).split(',');

    // Get location from URL
    var map_start_location = locations['New York'];
    if (url_hash.length === 1 && url_hash != "") {
        map_start_location = locations[url_hash[0]];
    }
    else if (url_hash.length === 3) {
        map_start_location = url_hash.slice(0, 3);
    }

    // Put current state on URL
    function updateURL() {
        var center = map.getCenter();
        window.location.hash = [center.lat, center.lng, map.getZoom()].join(',');
    }

    /*** Map ***/

    var map = L.map('map', {
        maxZoom: 20,
        minZoom: 2,
        inertia: false,
        keyboard: true,
        zoomAnimation: false
    });

    var layer = Tangram.leafletLayer({
        vectorTileSource: tile_source.source,
        vectorLayers: tile_source.layers,
        vectorStyles: tile_source.styles,
        numWorkers: 2,
        attribution: 'Map data &copy; OpenStreetMap contributors | <a href="https://github.com/tangrams/tangram" target="_blank">Source Code</a>',
        unloadInvisibleTiles: false,
        updateWhenIdle: false
    });
    window.layer = layer;

    var scene = layer.scene;
    window.scene = scene;

    // Update URL hash on move
    map.attributionControl.setPrefix('');
    map.setView(map_start_location.slice(0, 2), map_start_location[2]);
    map.on('moveend', updateURL);

    // Resize map to window
    function resizeMap() {
        document.getElementById('map').style.width = window.innerWidth + 'px';
        document.getElementById('map').style.height = window.innerHeight + 'px';
        map.invalidateSize(false);
    }
    window.addEventListener('resize', resizeMap);

    /***** Render loop *****/

    window.addEventListener('load', function () {
        // Scene initialized
        layer.on('init', function() {
            resizeMap();
            updateURL();
        });
        layer.addTo(map);

        if (osm_debug == true) {
            window.osm_layer =
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    { opacity: 0.5 })
                .addTo(map)
                .bringToFront();
        }
    });

}());
