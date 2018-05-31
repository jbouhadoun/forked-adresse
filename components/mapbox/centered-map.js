/* eslint react/no-danger: off, react/style-prop-object: off */
import React from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const fullscreenStyle = {
  height: '100vh',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

class Mapbox extends React.Component {
  render() {
    const {center, fullscreen, onStyleLoad, children} = this.props

    return (
      <Map
        onStyleLoad={onStyleLoad}
        style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        center={center}
        containerStyle={fullscreen ? fullscreenStyle : containerStyle}>
        {children}
      </Map>
    )
  }
}

Mapbox.propTypes = {
  center: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onStyleLoad: PropTypes.func,
  fullscreen: PropTypes.bool
}

Mapbox.defaultProps = {
  onStyleLoad: null,
  fullscreen: false
}

export default Mapbox
