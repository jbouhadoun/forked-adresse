import React from 'react'
import PropTypes from 'prop-types'

import NumeroForm from './numero-form'
import EditNumero from './edit-numero'

const getStatus = item => {
  let status = null

  if (item.deleted) {
    status = 'deleted'
  } else if (item.created) {
    status = 'created'
  } else if (item.edited) {
    status = 'edited'
  }

  return status
}

class NumeroItem extends React.Component {
  state = {
    editing: false,
    position: null
  }

  static propTypes = {
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string.isRequired,
    numero: PropTypes.shape({
      numeroComplet: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      deleteItem: PropTypes.func.isRequired,
      updateNumero: PropTypes.func.isRequired,
      select: PropTypes.func.isRequired
    }).isRequired
  }

  delete = async () => {
    const {numero, actions} = this.props
    await actions.deleteItem(numero)
  }

  cancel = async () => {
    const {numero, actions} = this.props

    try {
      await actions.cancelChange(numero)
    } catch (error) {
      this.setState({error})
    }
  }

  handlePosition = position => {
    this.setState({position})
  }

  edit = async () => {
    const {position} = this.state
    const {numero, actions} = this.props

    try {
      if (position) {
        await actions.updateNumero(numero, {
          positions: [{
            coords: [position.lng, position.lat]
          }]
        })

        this.setState({editing: false})
      }
    } catch (error) {
      this.setState({error})
    }
  }

  toggleEdit = () => {
    this.setState(state => {
      return {
        editing: !state.editing
      }
    })
  }

  render() {
    const {editing, error} = this.state
    const {codeCommune, codeVoie, numero, actions} = this.props
    const item = {
      name: numero.numeroComplet,
      status: getStatus(numero),
      handleClick: () => actions.select(codeCommune, codeVoie, numero.numeroComplet)
    }

    return (
      <EditNumero item={item} toggleForm={this.toggleEdit}>
        {editing && (
          <NumeroForm
            numero={numero}
            handlePosition={this.handlePosition}
            updateNumero={this.edit}
            deleteNumero={this.delete}
            cancelChange={this.cancel}
            error={error}
          />
        )}
      </EditNumero>
    )
  }
}

export default NumeroItem
