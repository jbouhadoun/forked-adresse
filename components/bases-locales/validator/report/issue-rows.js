import React from 'react'
import PropTypes from 'prop-types'
import FaEye from 'react-icons/lib/fa/eye'

import theme from '../../../../styles/theme'

class IssueRows extends React.Component {
  static propTypes = {
    issue: PropTypes.shape({
      message: PropTypes.string.isRequired,
      rows: PropTypes.array.isRequired
    }).isRequired,
    rows: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['error', 'warning']).isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    selected: false
  }

  handleClick = () => {
    const {issue, type, onClick} = this.props
    onClick(issue, type)
  }

  render() {
    const {issue, rows, type, selected} = this.props
    const warningRows = issue.rows.length

    return (
      <div className='issue' onClick={this.handleClick}>
        <div>
          <b>{
            warningRows === rows.length ?
              'Toutes les lignes' :
              warningRows === 1 ?
                `La ligne ${issue.rows[0]}` :
                `${warningRows} lignes`
          }</b> {warningRows === 1 ? 'comporte' : 'comportent'} l’avertissement :

          <span className='colored'> {issue.message}</span>

          {selected && (
            <span className='eye'><FaEye /></span>
          )}
        </div>

        <style jsx>{`
            .colored {
              color: ${type === 'error' ? theme.errorBorder : theme.warningBorder};
            }

            .issue:hover {
              cursor: pointer;
              text-decoration: underline;
            }

            .eye {
              margin-left: 1em;
              font-size: 20px;
            }
        `}</style>
      </div>
    )
  }
}

export default IssueRows
