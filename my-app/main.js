import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import WebGLVectorLayer from 'ol/layer/WebGLVector';
import { Geometry } from 'ol/geom';

// var maxExtent = [80.05844110726194,26.34796712822462,88.2015218371264,30.44742963310623];


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [-53235000, 4000000],
    //extent: [-53300000, 3900000, -53150000, 4100000],
    zoom: 11
  })
});

const source = new ol.Feature({
  geometry: new ol.geom.Point([50, 50])
});
const meteorites = new WebGLVectorLayer({
  source: source,
  style: {
    'circle-radius': 7,
    'circle-fill-color': 'rgba(255, 0, 0, 0.5)',
  },
});
