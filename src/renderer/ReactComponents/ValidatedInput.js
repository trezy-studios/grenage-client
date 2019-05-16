// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { orderBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import zxcvbn from 'zxcvbn'





// Local imports
import { capitalize } from '../helpers'





// Local constants
const invalidTypeMessages = {
  email: 'Not a valid email address',
  url: 'Not a valid URL',
}
class Message {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  types = {
    error: {
      icon: 'bomb',
      priority: 3,
    },
    warning: {
      icon: 'exclamation-triangle',
      priority: 2,
    },
    info: {
      icon: 'comment',
      priority: 1,
    },
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (type, message) {
    this.message = message
    this.type = type
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get icon () {
    return this.types[this.type].icon
  }

  get priority () {
    return this.types[this.type].priority
  }
}





class ValidatedInput extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    hasBeenFocused: false,
    isPasswordValid: true,
    isValid: true,
    messages: [],
    passwordStrength: 0,
    showPassword: false,
  }





  static defaultProps = {
    className: '',
    disabled: false,
    inputRef: () => {},
    maxLength: null,
    minLength: null,
    onBlur: () => {},
    onInput: () => {},
    onValidate: () => {},
    pattern: null,
    required: false,
    showStrength: false,
    showErrors: true,
    showInfo: false,
    showWarnings: false,
    type: 'text',
    value: '',
  }

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    inputRef: PropTypes.func,
    maxLength: PropTypes.string,
    minLength: PropTypes.string,
    onBlur: PropTypes.func,
    onInput: PropTypes.func,
    onValidate: PropTypes.func,
    pattern: PropTypes.string,
    required: PropTypes.bool,
    showStrength: PropTypes.bool,
    showErrors: PropTypes.bool,
    showInfo: PropTypes.bool,
    showWarnings: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.string,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleBlur = event => {
    const { onBlur } = this.props

    this._handleInteraction()

    onBlur(event)
  }

  _handleInput = event => {
    const { onInput } = this.props

    this._handleInteraction()

    onInput(event)
  }

  _handleInteraction = () => {
    const { hasBeenFocused } = this.state

    if (!hasBeenFocused) {
      this.setState({ hasBeenFocused: true })
    }
  }

  _handleShowPasswordClick = event => {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
    this._input.focus()
  }

  _validate = (messages = []) => {
    const {
      onValidate,
      showWarnings,
      showInfo,
      type,
    } = this.props
    const {
      badInput,
      patternMismatch,
      tooLong,
      tooShort,
      typeMismatch,
      valid,
      valueMissing,
    } = this._input.validity

    const newState = {}
    let passwordEvaluation = null

    if (type === 'password') {
      newState.isPasswordValid = true

      passwordEvaluation = zxcvbn(this._input.value)

      newState.passwordStrength = passwordEvaluation.score

      if (showWarnings && passwordEvaluation.feedback.warning) {
        messages.push(new Message('warning', passwordEvaluation.feedback.warning))
        newState.isPasswordValid = false
      }

      if (showInfo && passwordEvaluation.feedback.suggestions.length) {
        for (const suggestion of passwordEvaluation.feedback.suggestions) {
          messages.push(new Message('info', `Suggestion: ${suggestion}`))
        }
      }
    }

    if (!valid) {
      if (badInput || typeMismatch) {
        const defaultMessage = invalidTypeMessages[this._input.type] || `Doesn't match field type (${this._input.type})`

        messages.push(new Message('error', this._input.getAttribute('data-badinput-explainer') || defaultMessage))
      }

      if (patternMismatch) {
        const message = this._input.getAttribute('data-pattern-explainer')

        if (message) {
          messages.push(new Message('error', message))
        }
      }

      if (tooLong) {
        const message = this._input.getAttribute('data-maxlength-explainer') || `Must be fewer than ${this._input.getAttribute('maxlength')} characters`

        messages.push(new Message('error', message))
      }

      if (tooShort) {
        const message = this._input.getAttribute('data-minlength-explainer') || `Must be longer than ${this._input.getAttribute('minlength')} characters`

        messages.push(new Message('error', message))
      }

      if (valueMissing) {
        const message = this._input.getAttribute('data-required-explainer') || 'This field is required'

        messages.push(new Message('error', message))
      }
    }

    this.setState({
      ...newState,
      messages: orderBy(messages, ['priority'], ['desc']),
    })

    onValidate({
      type: 'validate',
      target: this._input,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this._input.value) {
      this._validate()
    }
  }

  componentDidUpdate (prevProps) {
    let comparedProps = [
      'pattern',
      'value',
      'required',
      'type',
      'minLength',
      'maxLength',
    ]

    if (!comparedProps.every(fieldName => this.props[fieldName] === prevProps[fieldName])) {
      this._validate()
    }
  }

  isValid = () => {
    if (this._input) {
      return this._input.validity.valid && this.state.isPasswordValid
    }

    return true
  }

  render () {
    const {
      hasBeenFocused,
      showPassword,
      passwordStrength,
    } = this.state
    const {
      className,
      disabled,
      showStrength,
      type,
    } = this.props

    const classNames = [
      'validated-input',
      (disabled ? 'disabled' : ''),
      (className || ''),
    ]

    return (
      <div
        className={classNames.join(' ')}
        data-t="validated-input:wrapper">
        <input
          data-t="validated-input:input"
          {...this.renderProps} />

        {(type === 'password') && (
          <button
            aria-label={showPassword ? 'Hide password from view' : 'Make password visible.'}
            className="show-password"
            data-t="password-input:reveal-button"
            disabled={disabled}
            onClick={this._handleShowPasswordClick}
            tabIndex={-1}
            type="button">
            <FontAwesomeIcon icon={showPassword ? 'eye-slash' : 'eye'} fixedWidth />
          </button>
        )}

        <div
          data-animate
          data-animation="pulse"
          data-animation-duration="1s"
          hidden={!hasBeenFocused || this.isValid()}>
          <FontAwesomeIcon
            className="validity-indicator"
            data-t="validated-input:validity-icon"
            icon="exclamation-triangle"
            fixedWidth />
        </div>

        {(type === 'password') && showStrength && (
          <meter
            className="strength-meter"
            data-t="password-input:strength-meter"
            low="2"
            high="3"
            max="4"
            optimum="4"
            value={passwordStrength} />
        )}

        {this.renderMessages()}
      </div>
    )
  }

  renderMessages = () => {
    const {
      showErrors,
      showInfo,
      showWarnings,
    } = this.props
    const {
      hasBeenFocused,
      messages,
    } = this.state

    return (
      <ul
        className="messages"
        data-t="validated-input:message-list"
        hidden={!hasBeenFocused}>
        {messages.map(({ icon, message, type }) => {
          let shouldShow = true

          switch (type) {
            case 'error':
              shouldShow = showErrors
              break
            case 'info':
              shouldShow = showInfo
              break
            case 'warning':
              shouldShow = showWarnings
              break
          }

          if (!shouldShow) {
            return null
          }

          return (
            <li
              key={message}
              className={`${type} message`}
              data-t="validated-input:message-list:item">
              <FontAwesomeIcon
                icon={icon}
                fixedWidth />
              {message}
            </li>
          )
        })}
      </ul>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get renderProps () {
    const { type } = this.props
    const {
      isValid,
      showPassword,
    } = this.state
    const renderProps = {
      ...this.props,
      onBlur: this._handleBlur,
      onInput: this._handleInput,
      ref: _input => {
        this.props.inputRef(_input)
        this._input = _input
      },
      type: ((type === 'password') && showPassword) ? 'text' : type,
    }

    delete renderProps.className
    delete renderProps.inputRef
    delete renderProps.onValidate
    delete renderProps.showErrors
    delete renderProps.showStrength
    delete renderProps.showWarnings
    delete renderProps.showInfo

    if (!isValid) {
      renderProps.pattern = '$.^'
    }

    return renderProps
  }
}





export { ValidatedInput }
