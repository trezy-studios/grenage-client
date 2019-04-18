// Module imports
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import zxcvbn from 'zxcvbn'





// Local imports
import { ValidatedInput } from '.'





class PasswordInput extends ValidatedInput {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _validate () {
    const {
      showWarnings,
      showSuggestions,
    } = this.props

    const messages = []
    const passwordEvaluation = zxcvbn(this._input.value)

    let isValid = true

    if (showWarnings && passwordEvaluation.feedback.warning) {
      messages.push({
        icon: 'exclamation-triangle',
        message: passwordEvaluation.feedback.warning,
        priority: 99,
      })

      isValid = false
    }

    if (showSuggestions && passwordEvaluation.feedback.suggestions.length) {
      for (const suggestion of passwordEvaluation.feedback.suggestions) {
        messages.push({
          icon: 'comment',
          type: 'info',
          message: `Suggestion: ${suggestion}`,
          priority: -1,
        })
      }
    }

    this.setState({
      passwordStrength: passwordEvaluation.score,
      isValid,
    })

    super._validate(messages)
  }

  _handleShowPasswordClick = event => {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
    this._input.focus()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)


    this.state = {
      ...this.state,
      isValid: true,
      passwordStrength: 0,
      showPassword: false,
    }
  }

  render () {
    const {
      hasBeenFocused,
      showPassword,
      passwordStrength,
    } = this.state

    const {
      disabled,
      showStrength,
    } = this.props

    const classNames = [
      'validated-input',
      'password-input',
      (this.props.className || ''),
    ]

    return (
      <div
        className={classNames.join(' ')}
        data-t="password-input:wrapper">
        <input
          data-t="password-input:input"
          {...this.renderProps} />

        <button
          aria-label={showPassword ? 'Hide password from view' : 'Make password visible.'}
          className="show-password"
          data-t="password-input:reveal-button"
          disabled={disabled}
          onClick={this._handleShowPasswordClick}
          tabIndex={-1}
          type="button">
          {/* <FontAwesomeIcon icon={showPassword ? 'eye-slash' : 'eye'} fixedWidth /> */}
        </button>

        {showStrength && (
          <meter
            className="strength-meter"
            data-t="password-input:strength-meter"
            low="2"
            high="3"
            max="4"
            optimum="4"
            value={passwordStrength} />
        )}

        {/* <FontAwesomeIcon
          className="validity-indicator"
          data-t="password-input:validity-icon"
          hidden={!hasBeenFocused || this.isValid()}
          icon="exclamation-triangle"
          fixedWidth /> */}

        {this.renderMessages()}
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get renderProps () {
    const {
      isValid,
      showPassword,
    } = this.state
    const renderProps = {
      ...super.renderProps,
      type: showPassword ? 'text' : 'password',
    }

    delete renderProps.onValidate
    delete renderProps.className
    delete renderProps.showStrength
    delete renderProps.showWarnings
    delete renderProps.showSuggestions

    if (!isValid) {
      renderProps.pattern = '$.^'
    }

    return renderProps
  }
}





export { PasswordInput }
