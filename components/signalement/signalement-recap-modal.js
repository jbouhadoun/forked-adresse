import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import {StyledForm} from './signalement.styles'
import ParcellesList from '../base-adresse-nationale/parcelles-list'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import {sendSignalement} from '@/lib/api-signalement'
import {getExistingLocationLabel, getPositionTypeLabel} from './use-signalement'
import Modal from '../common/modal'

export default function SignalementRecapModal({signalement, onEditSignalement, onClose, address, onSubmit}) {
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await sendSignalement(signalement)
      setSubmitStatus('success')
      setTimeout(() => {
        onSubmit()
      }, 2000)
    } catch {
      setSubmitStatus('error')
    }
  }

  const {numero, suffixe, nomVoie, positions, parcelles, nom} = signalement.changesRequested

  return ReactDOM.createPortal(<Modal title='Votre demande de signalement' onClose={onClose}>
    <StyledForm onSubmit={handleSubmit}>
      {signalement.type === 'LOCATION_TO_UPDATE' && <section>
        <h4>Récapitulatif</h4>
        <div className='signalement-recap'>
          <div>
            <h5>Lieu concerné</h5>
            <p>
              {getExistingLocationLabel(address)}
            </p>
            {address.positions && <>
              <h6>Positions : </h6>
              {address.positions.map(({position, positionType}, index) => {
                return <React.Fragment key={index}><b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]}, {position.coordinates[1]}<br /></React.Fragment> // eslint-disable-line react/no-array-index-key
              })}
            </>}
            {address.parcelles && <>
              <h6>Parcelles : </h6>
              <ParcellesList parcelles={address.parcelles} />
            </>}
          </div>
          <div>
            <h5>Modifications demandées</h5>
            <p>
              {numero} {suffixe} {nomVoie} {nom}
            </p>
            {positions && <>
              <h6>Positions : </h6>
              {positions.map(({position, positionType}, index) => {
                return <React.Fragment key={index}><b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]}, {position.coordinates[1]}<br /></React.Fragment> // eslint-disable-line react/no-array-index-key
              })}
            </>}
            {parcelles && <>
              <h6>Parcelles : </h6>
              {<ParcellesList parcelles={parcelles} />}
            </>}
          </div>
        </div>
      </section>}
      <section>
        <h4>Contact</h4>
        <p>
          Pour vous tenir informé de l&apos;avancement de votre signalement, merci de renseigner vos coordonnées.
        </p>
        <div className='form-row'>
          <Input
            label='Nom'
            nativeInputProps={{
              value: signalement.author.lastName,
              onChange: event => onEditSignalement('author', 'lastName')(event.target.value)}}
          />

          <Input
            label='Prénom'
            nativeInputProps={{
              value: signalement.author.firstName,
              onChange: event => onEditSignalement('author', 'firstName')(event.target.value)}}
          />
        </div>

        <Input
          label='Email*'
          nativeInputProps={{
            required: true,
            type: 'email',
            value: signalement.author.email,
            onChange: event => onEditSignalement('author', 'email')(event.target.value)}}
        />
      </section>
      {submitStatus === 'success' && (
        <div className='fr-alert fr-alert--success'>
          <p>
            Votre signalement a bien été envoyée.
          </p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className='fr-alert fr-alert--error'>
          <p>
            Une erreur est survenue lors de l&apos;envoi de votre signalement. Veuillez réessayer ultérieurement.
          </p>
        </div>
      )}
      <div className='form-controls'>
        <Button
          disabled={submitStatus === 'loading' || submitStatus === 'success'}
          style={{color: 'white'}}
          type='submit'
        >
          Envoyer le signalement
        </Button>
        <Button type='button' priority='secondary' onClick={onClose}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  </Modal>, document.querySelector('#alert-root'))
}

SignalementRecapModal.propTypes = {
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
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}
