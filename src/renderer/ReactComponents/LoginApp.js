// Module imports
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import React from 'react'





// Local imports
import {
  PasswordInput,
  ValidatedInput,
} from '.'





// Local imports
import { actions } from '../store'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  // addItem: actions.inventory.addItem,
}, dispatch)
const mapStateToProps = ({ user }) => ({ user })





class LoginApp extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    password: '',
    validity: {
      email: true,
      password: true,
    },
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    const {
      name,
      validity,
      value,
    } = target

    this.setState(currentState => ({
      [name]: value,
      validity: {
        ...currentState.validity,
        [name]: validity
      },
    }))
  }

  _handleSubmit = async event => {
    const {
      email,
      password,
    } = this.state
    event.preventDefault()

    console.log('submitting!')

    const results = await axios.post('http://trezy.local:3001/auth/login', {
      email,
      password,
    })

    console.log('submitted!', results)
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  render () {
    const {
      email,
      password,
    } = this.state

    return (
      <form onSubmit={this._handleSubmit}>
        <fieldset>
          <label htmlFor="email">
            Email
          </label>

          <ValidatedInput
            aria-label="Email"
            id="email"
            name="email"
            onChange={this._handleChange}
            placeholder="Email"
            required
            type="email"
            value={email} />
        </fieldset>

        <fieldset>
          <label htmlFor="password">
            Password
          </label>

          <PasswordInput
            aria-label="Password"
            id="password"
            name="password"
            onChange={this._handleChange}
            placeholder="Password"
            required
            showWarnings
            showSuggestions
            showStrength
            value={password} />
        </fieldset>

        <menu>
          <div className="primary">
            <button
              type="submit">
              Log In
            </button>
          </div>

          <div className="secondary"></div>
        </menu>
      </form>
    )
  }
}




connect(LoginApp)

export { LoginApp }
