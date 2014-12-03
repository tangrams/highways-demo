/*jslint browser: true*/
/*global Tangram, gui */

(function () {
    'use strict';

    /*** Map ***/

    var map = L.map('map', {
        maxZoom: 20,
        minZoom: 2,
        inertia: false,
        keyboard: true,
        zoomAnimation: false
    });

    var layer = Tangram.leafletLayer({
        vectorTileSource: {
            type: 'GeoJSONTileSource',
            url:  window.location.protocol+'//vector.mapzen.com/osm/all/{z}/{x}/{y}.json'
        },
        vectorLayers: 'layers.yaml',
        vectorStyles: 'styles.yaml',
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
    });

}());
