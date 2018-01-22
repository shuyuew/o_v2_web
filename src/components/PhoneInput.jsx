import React from 'react';
import CONFIG from '../data/config';

const PhoneInput = ({
  currency,
  list,
  isOpen,
  onDropBlur,
  onDropFocus,
  updateCurrency,
  updatePhone
}) => {

  const currenciesList = list.filter((opt) => opt.id != currency.id);
  
  return (
    <div className="phone-select">

      {currency !== null && 
        <div className="phone-select__dropdown">
          <div onClick={onDropFocus}>
            <img src={CONFIG.IMAGE_URL + currency.flag} alt={currency.country_name}/>
          </div>

          {isOpen && 
            <div className="listing">
              {currenciesList.map((option) => (
                <div onClick={() => { updateCurrency(option) }} key={option.id}>
                  <img src={CONFIG.IMAGE_URL + option.flag} alt={option.country_name}/>
                </div>
              ))}
            </div>
          }
        </div>
      }
      
      {currency !== null &&
        <div className="phone-select__ext">+{currency.country_code}</div>
      }

      <div className="phone-select__input">
        <div>
          <input type="number" name="phone" onChange={updatePhone} />
        </div>
      </div>

    </div>
  )
}

export default PhoneInput;