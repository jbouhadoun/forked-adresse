import {useState} from 'react'
import PropTypes from 'prop-types'

import Button from '@codegouvfr/react-dsfr/Button'
import {StyledForm} from './signalement.styles'
import SignalementRecapModal from './signalement-recap-modal'
import SignalementNumeroForm from './signalement-numero/signalement-numero-form'
import SignalementNumeroDeleteForm from './signalement-numero/signalement-numero-delete-form'
import {getExistingLocationLabel} from './use-signalement'

export default function SignalementForm({signalement, createSignalement, onEditSignalement, onClose, address, setIsEditParcellesMode, isEditParcellesMode}) {
  const [showRecapModal, setShowRecapModal] = useState(false)

  const getCenterCoords = () => {
    const splittedHash = window.location.hash.split('/')
    return [Number.parseFloat(splittedHash[2]), Number.parseFloat(splittedHash[1])]
  }

  const handleSubmit = e => {
    e.preventDefault()
    setShowRecapModal(true)
  }

  return (
    <>
      {!signalement && (
        <StyledForm>
          {address && (<section>
            <h4>
              Signalement
            </h4>
            <h5>
              Adresse concernée
            </h5>
            <div className='form-row'>
              {getExistingLocationLabel(address)}
            </div>
            <div className='form-row'>
              {address.codePostal} {address.commune.nom}
            </div>
            <br />
            <Button
              type='button'
              style={{color: 'white', marginBottom: 10}}
              onClick={() => createSignalement('LOCATION_TO_UPDATE')}
            >
              Signaler un changement
            </Button>
            <Button
              type='button'
              style={{color: 'white', marginBottom: 10}}
              onClick={() => createSignalement('LOCATION_TO_DELETE')}
            >
              Demander la suppression
            </Button>
          </section>)}
          <section>
            <h5>
              Adresse non référencée
            </h5>
            <Button
              type='button'
              style={{color: 'white', marginBottom: 10}}
              onClick={() => createSignalement('LOCATION_TO_CREATE')}
            >
              Signaler un numéro manquant
            </Button>
          </section>
        </StyledForm>
      )}

      {(signalement?.type === 'LOCATION_TO_UPDATE' || signalement?.type === 'LOCATION_TO_CREATE') && (
        <SignalementNumeroForm
          setIsEditParcellesMode={setIsEditParcellesMode}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement}
          isEditParcellesMode={isEditParcellesMode}
          {...(signalement?.type === 'LOCATION_TO_UPDATE' ? {address, initialPositionCoords: [address.lon, address.lat]} : {initialPositionCoords: getCenterCoords()})}
        />)}

      {signalement?.type === 'LOCATION_TO_DELETE' && (
        <SignalementNumeroDeleteForm
          address={address}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
          signalement={signalement} />)}
      {showRecapModal && <SignalementRecapModal onSubmit={onClose} onClose={() => setShowRecapModal(false)} signalement={signalement} address={address} onEditSignalement={onEditSignalement} />}
    </>
  )
}

SignalementForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  address: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    codePostal: PropTypes.string,
    commune: PropTypes.object,
    position: PropTypes.object,
    positions: PropTypes.array,
    positionType: PropTypes.string,
    parcelles: PropTypes.array,
    displayBBox: PropTypes.array,
    lat: PropTypes.number,
    lon: PropTypes.number,
    voie: PropTypes.object
  }).isRequired,
  signalement: PropTypes.object,
  onEditSignalement: PropTypes.func.isRequired,
  setIsEditParcellesMode: PropTypes.func.isRequired,
  createSignalement: PropTypes.func.isRequired,
  isEditParcellesMode: PropTypes.bool,
}
