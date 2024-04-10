import React from 'react';
import { TileLayer, Polygon, Map} from 'react-leaflet';
//import { parse } from 'wellknown';

var parse = require('wellknown');
const wktData1 = "POLYGON ((123.7879 24.07208,123.7879 24.07181,123.7896 24.07181,123.7896 )) POLYGON((123.5646 24.19708, 123.5646 24.19569, 123.5651 24.19569, 123.5651)) ";
const geojsonData1 = parse(wktData1);

const mapJpn0 = ({ }) => {
    return (
        <>
            <h1>Hello</h1>

            <Map center={[24.1, 123.7]} zoom={10}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon positions={geojsonData1.coordinates[0]} />
            </Map>

        </>
    );

};

export default mapJpn0;





