// Module imports
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import React from 'react'





// Local imports
import { ValidatedInput } from '.'
import { actions } from '../store'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  login: actions.user.login,
}, dispatch)
const mapStateToProps = ({ user }) => ({ user })





@connect(mapStateToProps, mapDispatchToProps)
class Login extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    email: '',
    isLoggingIn: false,
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
    const { login } = this.props
    const {
      email,
      password,
    } = this.state
    event.preventDefault()

    this.setState({ isLoggingIn: true })

    const results = await login(email, password)

    this.setState({ isLoggingIn: false })

    console.log(results)
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  render () {
    const {
      email,
      isLoggingIn,
      password,
    } = this.state
    const { user } = this.props

    return (
      <form
        className="login"
        onSubmit={this._handleSubmit}>
        {isLoggingIn && (
          <div>
            Loading...
          </div>
        )}

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

          <ValidatedInput
            aria-label="Password"
            id="password"
            name="password"
            onChange={this._handleChange}
            placeholder="Password"
            required
            type="password"
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





export { Login }
