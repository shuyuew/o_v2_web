import React, { Component } from 'react';

import InputError from './InputError';

class HomepageInput extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      errorVisible: false,
      errorMessage: 'Invalid Field'
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.blurHandle = this.blurHandle.bind(this);
  }
  
  handleChange(event) {
    
    if (this.props.maxLength && (event.target.value.length > parseInt(this.props.maxLength))) {
      return;
    }
    
    this.props.onInputUpdate({
      name: event.target.name,
      value: event.target.value
    });
  }
  
  blurHandle(e) {
    //TODO Do other validations on input fields
  }
  
  componentDidMount() {
    if (this.nameInput) {
      this.nameInput.focus();
    }
  }

  render() {
    
    const {
      placeholder,
      type,
      id,
      name,
      label,
      required,
      focus,
      maxLength,
      value
    } = this.props;
    
    const { errorVisible, errorMessage } = this.state;
    
    return (
      <div className="form-group">
        <input
          ref={(input) => { focus ? this.nameInput = input : null; }} 
          name={name}
          aria-label={label}
          type={type} 
          className="form-control" 
          id={id} 
          value={value}
          required={required}
          placeholder={placeholder} 
          onBlur={this.blurHandle}
          onChange={this.handleChange} />
        
        <InputError 
          visible={errorVisible}
          errorMessage={errorMessage} />
        
      </div>
    );
  }

}


export default HomepageInput;