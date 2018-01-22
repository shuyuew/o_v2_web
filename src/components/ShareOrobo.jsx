import React, { Component } from 'react';
import UserAuth from '../API/auth';

let UserData, shareUrl;

class ShareOrobo extends Component {

  componentWillMount() {
    UserData = UserAuth.getUserData();
    shareUrl = window.location.protocol + '//' + window.location.hostname + '/sign-up?ref=' + UserData.affiliate.affiliate_code;
  }

  componentDidMount() {

    document.getElementById('orobo-facebook-share').onclick = function() {
      FB.ui({
        method: 'share',
        display: 'popup',
        href: encodeURI(shareUrl),
      }, function(response){
        console.log('share callback ', response);
      });
    }

    window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);
    
      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };
    
      return t;
    }(document, "script", "twitter-wjs"));
  }

  render() {

    const tweetUrl = 'Register at Orobo with this link: ' + shareUrl;

    return(
      <div className="share-orobo text-center">
    
        <div className="share-orobo__referal">
          <h4>Referral Code:</h4>
          <div>{UserData.affiliate.affiliate_code}</div>
          
          <div className="sharing-buttons">
            <button id="orobo-facebook-share" type="button">Share on Facebook</button>
            <a className="twitter-share-button"
              href={'https://twitter.com/intent/tweet?url=/&text=' + encodeURIComponent(tweetUrl) }>Tweet</a>
          </div>
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
    )
  }
}

export default ShareOrobo;