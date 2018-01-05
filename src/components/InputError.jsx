import React, { Component } from 'react';

class InputError extends Component {

  render() {
    
    const { errorMessage, visible } = this.props;
    const classNames = visible ? 'input-error visible' : 'input-error';
    
    return (
      <div className={classNames}>
        <div>{errorMessage}</div>
      </div>
    );
  }

}

export default InputError;