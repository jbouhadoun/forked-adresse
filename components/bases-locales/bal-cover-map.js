import React from 'react'
import {renderToString} from 'react-dom/server'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {AlertTriangle} from 'react-feather'

import theme from '@/styles/theme'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const popupHTML = ({nom, code, departement, nomClient}) => renderToString(
  <div>
    <p>
      <b>Adresses de {nom}</b>
    </p>
    <div>Commune : {code}</div>
    <div>Département : {departement}</div>
    <div>Provenance : {nomClient}</div>
  </div>
)

class BalCoverMap extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    popup: PropTypes.object,
    setSources: PropTypes.func.isRequired,
    setLayers: PropTypes.func.isRequired
  }

  static defaultProps = {
    popup: null
  }

  state = {
    zoomActivated: false,
    warningZoom: false
  }

  componentDidMount() {
    const {map, setSources, setLayers} = this.props
    const sources = [{
      name: 'data',
      type: 'vector',
      format: 'pbf',
      promoteId: 'code',
      tiles: [`${ADRESSE_URL}/deploiement/couverture-tiles/{z}/{x}/{y}.pbf`]
    }]
    const layers = [
      {
        id: 'bal-polygon-fill',
        type: 'fill',
        source: 'data',
        'source-layer': 'communes',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'nomClient'], 'Moissonneur'],
            theme.colors.darkGreen,
            theme.colors.green
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.2
          ]
        },
        filter: ['==', '$type', 'Polygon']
      },
      {
        id: 'bal-polygon-outline',
        type: 'line',
        source: 'data',
        'source-layer': 'communes',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'nomClient'], 'Moissonneur'],
            theme.colors.darkGreen,
            theme.colors.green
          ],
          'line-width': 1
        },
        filter: ['==', '$type', 'Polygon']
      }
    ]

    setSources(sources)
    setLayers(layers)

    map.once('load', () => {
      map.doubleClickZoom.disable()

      map.on('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
      map.on('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
      map.on('wheel', this.onWheel.bind(this))

      map.on('dblclick', this.onDblClick.bind(this))
      map.on('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
    })
  }

  componentDidUpdate() {
    const {map} = this.props

    if (this.state.zoomActivated) {
      map.scrollZoom.enable()
    } else {
      map.scrollZoom.disable()
    }

    if (this.state.warningZoom) {
      const timer = setTimeout(() => this.setState({warningZoom: false}), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }

  componentWillUnmount() {
    const {map} = this.props

    map.off('styledata', this.onStyleData)

    map.off('mousemove', 'bal-polygon-fill', this.onMouseMove.bind(this, 'bal-polygon-fill'))
    map.off('mouseleave', 'bal-polygon-fill', this.onMouseLeave.bind(this, 'bal-polygon-fill'))
    map.off('wheel', this.onWheel.bind(this))

    map.off('dblclick', this.onDblClick.bind(this))
    map.off('click', 'bal-polygon-fill', this.onClick.bind(this, 'bal-polygon-fill'))
  }

  onMouseMove = (layer, event) => {
    const {map, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = 'pointer'

    const [feature] = event.features

    if (this.highlighted) {
      map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: false})
    }

    this.highlighted = feature.id
    map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: true})

    popup.setLngLat(event.lngLat)
      .setHTML(popupHTML(feature.properties))
      .addTo(map)
  }

  onMouseLeave = () => {
    const {map, popup} = this.props
    const canvas = map.getCanvas()
    canvas.style.cursor = ''

    if (this.highlighted) {
      map.setFeatureState({source: 'data', sourceLayer: 'communes', id: this.highlighted}, {hover: false})
    }

    popup.remove()
  }

  onClick = (layer, event) => {
    const [feature] = event.features

    Router.push(
      `/commune/${feature.id}`
    )
  }

  onWheel = () => {
    if (this.state.zoomActivated) {
      this.setState({warningZoom: false})
    } else {
      this.setState({warningZoom: true})
    }
  }

  onDblClick = () => {
    this.setState(state => ({
      zoomActivated: !state.zoomActivated
    }))
  }

  render() {
    return (
      <div>
        {this.state.warningZoom && (
          <div className='warning'>
            <AlertTriangle color='orange' alt='Avertissement' />
            <div className='warning-text'>
              Double-cliquez sur la carte pour activer le zoom
            </div>
          </div>
        )}

        <style jsx>{`
          .warning {
            z-index: 1;
            position: absolute;
            display: flex;
            align-items: center;
            padding: 1em;
            margin: 1em;
            background: #ffffffc4;
          }

          .warning-text {
            margin-left: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default BalCoverMap
