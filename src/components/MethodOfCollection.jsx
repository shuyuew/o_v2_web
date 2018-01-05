import React, { Component } from 'react';

class MethodOfCollection extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onParameterUpdate = this.onParameterUpdate.bind(this);
  }
  
  handleChange(e) {
    const channelToUpdateWith = this.props.channels.find((obj) => obj.id === e.target.value);
  
    if (channelToUpdateWith.settlement_channel_parameters.length) {
      for (var i = 0; i < channelToUpdateWith.settlement_channel_parameters.length; i++) {
        if (channelToUpdateWith.settlement_channel_parameters[i].options_data.length) {
          channelToUpdateWith.settlement_channel_parameters[i].value = channelToUpdateWith.settlement_channel_parameters[i].options_data[0].id;
        }

        if (channelToUpdateWith.settlement_channel_parameters[i].settlement_channel_parameter_options.length) {
          channelToUpdateWith.settlement_channel_parameters[i].value = channelToUpdateWith.settlement_channel_parameters[i].settlement_channel_parameter_options[0].id;
        }
      }
    }

    this.props.updateSelectedChannel(channelToUpdateWith);

  }


  onParameterUpdate(data) {
    this.props.updateChannelParameter({
      name: data.target.name,
      val: data.target.value
    });
  }

  componentDidMount() {
    this.props.updateSelectedChannel(this.props.selectedChannel);
  }

  render() {
    
    const { 
      channels,
      selectedChannel 
    } = this.props;
    
    return (
      <div className="method-collection">
        <h1 className="orobo-title">Method of Collection</h1>
        
        <div className="form-group">
          <div className="method-select">
            <div>
              <label htmlFor="method-select">Select a method</label>
            </div>
            <div>
              <select className="form-control" value={selectedChannel.id} onChange={this.handleChange} name="method_select" id="method-select">
                {channels.map((channel, index) => (
                  <option key={channel.id} value={channel.id}>{channel.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        
        {selectedChannel.settlement_channel_parameters.length > 0 &&
          selectedChannel.settlement_channel_parameters.map((channelParam, index) => { 
            
            if (channelParam.has_options) {
              return <SelectWrapper key={channelParam.id} channelData={channelParam} updateParameter={this.onParameterUpdate} />;
            } else { 
              return <InputWrapper key={channelParam.id} channelData={channelParam} updateParameter={this.onParameterUpdate} />
            }
            
          })
        }

      </div>
    );
  }

}



const inputLabel = (type) => {
  switch (type) {
    case 'mobile_number':
      return 'Mobile Number';

    case 'account_name':
      return 'Account Name';

    case 'receiver_phone_number':
      return 'Receiver Phone Number';

    case 'account_number':
      return 'Account Number';

    case 'mobile_network':
      return 'Mobile Network';

    case 'sort_code':
      return 'Banks';
  }
}


const SelectWrapper = (props) => {

  const optionItems = props.channelData.settlement_channel_parameter_options.length ? props.channelData.settlement_channel_parameter_options : props.channelData.options_data;
  
  return (
    <div className="form-group">
      <label htmlFor={props.channelData.id}>{inputLabel(props.channelData.parameter)}:*</label>
      <select required 
        className="form-control" 
        name={props.channelData.parameter} 
        id={props.channelData.id} 
        onChange={props.updateParameter}>
        {optionItems.map((channelOption, index) => (
          <option key={channelOption.id} value={channelOption.id || channelOption.country_currency_id}>{channelOption.title}</option> 
        ))}
      </select>
    </div>
  );
};


const InputWrapper = (props) => {
  
  const attributesData = {
    className: 'form-control',
    required: true,
    name: props.channelData.parameter,
    id: props.channelData.parameter,
    type: props.channelData.parameter === 'account_name' ? 'text' : 'number'
  };

  return (
    <div className="form-group">
      <label htmlFor={attributesData.id}>{inputLabel(props.channelData.parameter)}:*</label>
      <input {...attributesData} onChange={props.updateParameter}/>
    </div>
  );
};

export default MethodOfCollection;