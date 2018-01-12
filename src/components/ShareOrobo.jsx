import React from 'react';
import UserAuth from '../API/auth';

const UserData = UserAuth.getUserData();

console.log(UserData);

const ShareOrobo = (props) => (
  <div className="share-orobo text-center">
    
    <div className="share-orobo__referal">
      <h4>Referral Code:</h4>
      <div>{UserData.affiliate.affiliate_code}</div>
      <div>Click code to share</div>
    </div>

    <div className="share-orobo__earning">
        <span>You've earned</span>
        <span>{UserData.affiliate.balance}</span>
    </div>

    <div className="share-orobo__event">
      <div>
        <h5 className="text-uppercase">Get A dollar</h5>
        <p>Share your referral code with friends and give them a discount on their first order, you'll get a discount.too</p>
        <p>Tip: Include your referral code in your app review when you rate us on the App Store.</p>
      </div>

      <div>
        <h5 className="text-uppercase">Like us?</h5>
        <div>Rate Us</div>
      </div>
    </div>

  </div>
);

export default ShareOrobo;