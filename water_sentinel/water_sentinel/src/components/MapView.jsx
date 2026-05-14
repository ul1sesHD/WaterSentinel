import React, { useState } from 'react'
import { DeckGL } from '@deck.gl/react'
import { ColumnLayer } from '@deck.gl/layers'
import { Map } from 'react-map-gl/maplibre'

const INITIAL_VIEW = {
  longitude: 26.5,
  latitude: -28.5,
  zoom: 5,
  pitch: 45,
  bearing: 0
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

function getColor(phosphorus, min, max) {
  const norm = (phosphorus - min) / (max - min)
  if (norm > 0.66) return [255, 71, 87, 200]
  if (norm > 0.33) return [255, 165, 2, 200]
  return [46, 213, 115, 200]
}

export default function MapView({ stations }) {
  const [tooltip, setTooltip] = useState(null)

  const pMin = Math.min(...stations.map(s => s['Dissolved Reactive Phosphorus']))
  const pMax = Math.max(...stations.map(s => s['Dissolved Reactive Phosphorus']))

  const layer = new ColumnLayer({
    id: 'stations',
    data: stations,
    getPosition: d => [d.Longitude, d.Latitude],
    getElevation: d => d['Electrical Conductance'] * 3,
    elevationScale: 50,
    getFillColor: d => getColor(d['Dissolved Reactive Phosphorus'], pMin, pMax),
    radius: 8000,
    pickable: true,
    onHover: info => {
      if (info.object) {
        setTooltip({
          x: info.x,
          y: info.y,
          obj: info.object
        })
      } else {
        setTooltip(null)
      }
    },
  })

  return (
    <div className="map-container">
      <DeckGL initialViewState={INITIAL_VIEW} controller layers={[layer]}>
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}>
          <div><b>Lat:</b> {tooltip.obj.Latitude.toFixed(4)}</div>
          <div><b>Lon:</b> {tooltip.obj.Longitude.toFixed(4)}</div>
          <div><b>Alkalinity:</b> {tooltip.obj['Total Alkalinity'].toFixed(1)}</div>
          <div><b>Conductance:</b> {tooltip.obj['Electrical Conductance'].toFixed(1)}</div>
          <div><b>Phosphorus:</b> {tooltip.obj['Dissolved Reactive Phosphorus'].toFixed(1)}</div>
        </div>
      )}
    </div>
  )
}
