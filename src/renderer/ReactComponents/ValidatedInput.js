// Module imports
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { orderBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'





// Local constants
const invalidTypeMessages = {
  email: 'Not a valid email address',
  url: 'Not a valid URL',
}





class ValidatedInput extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    hasBeenFocused: false,
    messages: [],
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

  _validate = (messages = []) => {
    const { onValidate } = this.props
    const {
      badInput,
      patternMismatch,
      tooLong,
      tooShort,
      typeMismatch,
      valid,
      valueMissing,
    } = this._input.validity

    if (!valid) {
      if (badInput || typeMismatch) {
        const defaultMessage = invalidTypeMessages[this._input.type] || `Doesn't match field type (${this._input.type})`

        messages.push({
          icon: 'exclamation-triangle',
          message: this._input.getAttribute('data-badinput-explainer') || defaultMessage,
        })
      }

      if (patternMismatch) {
        const message = this._input.getAttribute('data-pattern-explainer')

        if (message) {
          messages.push({
            icon: 'exclamation-triangle',
            message,
          })
        }
      }

      if (tooLong) {
        messages.push({
          icon: 'exclamation-triangle',
          message: this._input.getAttribute('data-maxlength-explainer') || `Must be fewer than ${this._input.getAttribute('maxlength')} characters`,
        })
      }

      if (tooShort) {
        messages.push({
          icon: 'exclamation-triangle',
          message: this._input.getAttribute('data-minlength-explainer') || `Must be longer than ${this._input.getAttribute('minlength')} characters`,
        })
      }

      if (valueMissing) {
        messages.push({
          icon: 'exclamation-triangle',
          message: this._input.getAttribute('data-required-explainer') || 'This field is required',
        })
      }
    }

    this.setState({ messages: orderBy(messages, ['priority'], ['desc']) })

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

    comparedProps = comparedProps.map(fieldName => this.props[fieldName] === prevProps[fieldName])

    if (comparedProps.includes(false)) {
      this._validate()
    }
  }

  isValid = () => {
    if (this._input) {
      return this._input.validity.valid
    }

    return true
  }

  render () {
    const { hasBeenFocused } = this.state
    const {
      className,
      disabled,
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

        {/* <FontAwesomeIcon
          className="validity-indicator"
          data-t="validated-input:validity-icon"
          hidden={!hasBeenFocused || this.isValid()}
          icon="exclamation-triangle"
          fixedWidth /> */}

        {this.renderMessages()}
      </div>
    )
  }

  renderMessages = () => {
    const {
      hasBeenFocused,
      messages,
    } = this.state

    console.log(this.state)

    return (
      <ul
        className="messages"
        data-t="validated-input:message-list"
        hidden={!hasBeenFocused}>
        {messages.map(({ icon, message, type }) => (
          <li
            key={message}
            className={`${type || 'error'} message`}
            data-t="validated-input:message-list:item">
            {/* <FontAwesomeIcon
              icon={icon}
              fixedWidth /> */}
            {message}
          </li>
        ))}
      </ul>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get renderProps () {
    const renderProps = {
      ...this.props,
      onBlur: this._handleBlur,
      onInput: this._handleInput,
      ref: _input => {
        this.props.inputRef(_input)
        this._input = _input
      },
    }

    delete renderProps.className
    delete renderProps.inputRef
    delete renderProps.onValidate

    return renderProps
  }
}





ValidatedInput.defaultProps = {
  inputRef: () => {},
  onBlur: () => {},
  onInput: () => {},
  onValidate: () => {},
}

ValidatedInput.propTypes = {
  inputRef: PropTypes.func,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
  onValidate: PropTypes.func,
}





export { ValidatedInput }
