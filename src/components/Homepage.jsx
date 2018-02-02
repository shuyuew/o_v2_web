import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';
import OroboAPI from '../API/api-service';
import UserAuth from '../API/auth';
import OroboCookies from '../helpers/cookies';

const UserData = UserAuth.getUserData();
const sendingCurrencyId = 227;
const receivingCurrencyId = 154;

class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      exchange_rate: 0,
      amount: '',
      receiving: '',
      fee: 0,
      categories: [],
      selectedCategory: {}
    }
    this.getStarted = this.getStarted.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.updateVendorCategory = this.updateVendorCategory.bind(this);
  }

  updateVendorCategory(e) {
    const categoryInfo = this.state.categories.find((category) => category.id == e.target.value);
    this.setState({ selectedCategory: categoryInfo });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const dataToStore = {
      amount: this.state.amount,
      selected_category: e.target.name === 'PayBillForm' ? this.state.selectedCategory : undefined,
      type: e.target.name === 'PayBillForm' ? 'bill-payment' : 'send-money',
      receiving: this.state.receiving,
      fee: this.state.fee,
      exchange_rate: this.state.exchange_rate
    }

    OroboCookies.setCookie('Action', dataToStore, {
      path: '/'
    });

    if (UserData) {
      if (e.target.name === 'PayBillForm') {
        this.props.history.push('/pay-bill');
      } else {
        this.props.history.push('/send-money');
      }
    } else {
      this.props.history.push('/login');
    }

  }

  onInputBlur(e) {
    OroboAPI.vendorFee({
      sending_currency: sendingCurrencyId,
      receiving_currency: receivingCurrencyId,
      amount: e.target.value,
      direction: 1
    }).then((response) => {
      if (response.data.PayLoad.status) {

        this.setState({
          exchange_rate: parseFloat(response.data.PayLoad.data.exchange_rate).toFixed(2),
          fee: parseFloat(response.data.PayLoad.data.fee).toFixed(2),
          amount: parseFloat(response.data.PayLoad.data.sending_amount).toFixed(2),
          receiving: parseFloat(response.data.PayLoad.data.receiving_amount).toFixed(2)
        });

      }
    }, (error) => {

    });
  }

  handleInputChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  togglePanel() {
    this.setState({ isOpened: !this.state.isOpened });
  }

  closePanel() {
    this.setState({ isOpened: false });
  }

  getStarted(type) {
    if (!UserData) {
      this.props.history.push('/login');
    } else {
      if (type === 'bill-payment') {
        this.props.history.push('/pay-bill');
      } else {
        this.props.history.push('/send-money');
      }
    }
  }

  componentWillMount() {
    
    OroboAPI.vendorCategories().then((response) => {
      if (response.data.PayLoad.status) {
        this.setState({ 
          categories: response.data.PayLoad.data.categories,
          selectedCategory: response.data.PayLoad.data.categories[0]
        });
      }
    }, (error) => {

    });

  }

  render() {

    const { 
      isOpened,
      amount,
      receiving,
      exchange_rate,
      fee,
      categories,
      selectedCategory
    } = this.state;

    return(
      <div id="orobo-homepage-wrapper">

        <nav className="nav-bar">

          <ul id="nav-first">
              <li><a href="">About</a></li>
              <li><a href="">Business</a></li>
              <li><a href="">Services</a></li>
              <li><a href="">Contact</a></li>
          </ul>

          <div id="nav-dropdown">
            <div className="bar1" ><span></span><span></span><span></span></div>
            <div className="dropdown-content">
                <a href="#homepage">Home</a>
                <a href="#paybill">Pay Bill</a>
                <a href="#sendmoney">Send Money</a>
                <a href="#vendors">Vendors / Agents</a>
                <a href="#help">Help</a>
                <a href="">Log in</a>
                <a href="">Sign Up</a>
            </div>
          </div>

          <ul id="nav-second">
            <li><a href="#homepage">Home</a></li>
            <li><a href="#paybill">Pay Bill</a></li>
            <li><a href="#sendmoney">Send Money</a></li>
            <li><a href="#vendors">Vendors / Agents</a></li>
            <li><a href="#help">Help</a></li>
            {!UserData && <li><Link to="/login">Log In</Link></li> }
            {!UserData && 
              <li className="nav-signup">
                <div>
                  <Link to="/sign-up">
                    <img className="signup-image" src="/images/i/Orobo_Smile_SignUp.png"/>
                  </Link>
                </div>
              </li>
            }
            
          </ul>

        </nav>


        <div className="parallax">
          <div id="lady-parallax" className="parallax-image"></div>
        </div>

        <div id="js-fullpage">
          <div id="loader-container">

            <header className="loader-header" id="#loader-header">

              <div className="loader-logo">
                <img src="/images/i/orobo_icon_small.png" className="wow rotateIn" data-wow-delay=".8s" alt="Image" />
              </div>

              <div className="loader-loader">
                <svg className="loader-inner" width="80px" height="80px" viewBox="0 0 80 80">
                  <path className="loader-circlebg" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
                  <path id="loader-circle" className="loader-circle" d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
                </svg>
              </div>

            </header>

            
            <section className="section parallax-section">
              <div className="b-wrapper">

                <div className="box-choice">
                  <p>Don'transfer money.</p>
                  <p>Transfer Happiness:)</p>
                  <p>Not only will you find our rates to be the "LOWEST" in the market but our unique App allows you to purchase airtime, pay your monthly utility bills, school fees, medical bills, purchase prescription, you can even pay contractors directly to build mom a new home:)</p>

                  <div className="btn-group">
                    <button id="payBills" onClick={this.togglePanel}>Pay Bills</button>
                    <button id="sendMoney" onClick={this.togglePanel}>Send Money</button>
                  </div>
                  <p className="btn-info">
                    <span><a href="https://orobo.com/vendors.php">Become A Vendor</a></span>
                    <span><a href="https://orobo.com/notify.php">Notify Me On Launch</a></span>
                  </p>
                </div>

                {isOpened && 
                  <div className="box-choice-tab">
                    <div className="close-choice" onClick={this.closePanel}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </div>
                    <div className="container-choice-tab payBill-left">
                        <form className="payBilltab" name="PayBillForm" onSubmit={this.handleFormSubmit}>
                          <p>Cross-Border Bill Payment</p>
                          <div className="exchange">
                              <div className="exchange-us">
                                <input type="number" placeholder="100.00" name="amount" value={amount} onChange={this.handleInputChange} onBlur={this.onInputBlur} required/>
                              </div>
                              <div className="exchange-ngn">
                                <input type="text" placeholder="34,126.15" name="receiving" value={receiving} disabled/>
                              </div>
                          </div>
                          <p><u>Exchange rate: {exchange_rate} NGN</u></p>
                          <div className="account">
                              <div className="style-select">
                                <label>
                                    <select onChange={this.updateVendorCategory}>
                                      {categories.map((item) => (
                                        <option key={item.id} value={item.id}>{item.title}</option>
                                      ))}
                                    </select>
                                </label>
                              </div>
                          </div>
                          <div className="box-choice-btn">
                              <button type="submit">Pay Bills</button>
                          </div>
                        </form>
                    </div>
                    <div className="container-choice-tab sendMoney-right">
                        <form className="sendMoneytab" name="SendMoneyForm" onSubmit={this.handleFormSubmit}>
                          <p>International Money Transfer</p>
                          <div className="exchange">
                              <div className="exchange-us">
                                <input type="number" placeholder="100.00" name="amount" value={amount} onChange={this.handleInputChange} onBlur={this.onInputBlur} required />
                              </div>
                              <div className="exchange-ngn">
                                <input type="text" placeholder="34,126.15" name="receiving" value={receiving} disabled />
                              </div>
                          </div>
                          <p><u>Exchange rate: {exchange_rate} NGN</u></p>
                          <div className="account">
                              <div className="style-select">
                                <label>
                                    <select>
                                      <option>Credit / Debit Card</option>
                                    </select>
                                </label>
                              </div>
                              <div className="style-account">
                                <input type="text" value={fee} disabled />
                              </div>
                          </div>
                          <div className="box-choice-btn">
                              <button type="submit" id="box-choice-sendMoney">Send Money</button>
                          </div>
                        </form>
                    </div>
                  </div>
                }
                

                <div className="foot-bar">
                  <ul>

                    <li className="foot-bar-list">
                      <div>
                        <img className="foot-bar-img" src="/images/i/foot-bar1.png" width="140pt" height="270pt"/>
                      </div>

                      <div className="foot-bar-content">
                        <p>Cross-Border Bill Payment</p>
                        <p>Your money into the right hands</p>
                        <p>Orobo is a revolutionary App that facilitates cross-border bill payments.</p>
                        <button type="button" onClick={() => { this.getStarted('bill-payment'); }}>Get Started</button>
                        <span>
                          <img className="message-bubble" src="/images/i/orange_i_icon.png" width="50pt" height="50pt" />
                        </span>
                      </div>
                    </li>

                    <li className="foot-bar-list">
                      <div>
                        <img className="foot-bar-img" src="/images/i/foot-bar2.png" width="140pt" height="270pt"/>
                      </div>

                      <div className="foot-bar-content">
                        <p>International Money Transfer</p>
                        <p>One fixed low fee on any amount</p>
                        <p>Orobo is a revolutionary App that facilitates cross-border bill payments.</p>
                        <button type="button" onClick={() => { this.getStarted('money-transfer'); }}>Get Started</button>
                        <span>
                          <img className="message-bubble" src="/images/i/orange_i_icon.png" width="50pt" height="50pt" />
                        </span>
                      </div>
                    </li>

                    <li className="foot-bar-list">
                      <div>
                        <img className="foot-bar-img" src="/images/i/foot-bar3.png" width="140pt" height="270pt"/>
                      </div>

                      <div className="foot-bar-content">
                        <p>International Money Transfer</p>
                        <p>One fixed low fee on any amount</p>
                        <p>Orobo is a revolutionary App that facilitates cross-border bill payments.</p>
                        <button type="button" onClick={() => { this.getStarted('money-transfer'); }}>Get Started</button>
                        <span>
                          <img className="message-bubble" src="/images/i/orange_i_icon.png" width="50pt" height="50pt" />
                        </span>
                      </div>
                    </li>

                  </ul>
                </div>

              </div>
            </section>


            <section className="section">
              <div className="b-container">

                <div className="b-app-container">

                  <div className="b-device">
                    <div className="b-slides-wrapper" id="phone1">

                      <div className="js-slide">
                        <img src="/images/i/1.png" className="b-slide fadeInLeft" alt="Image" />
                      </div>

                      <div className="js-slide">
                        <div className="b-slide b-slide_top fadeInDown slide-item-1"></div>
                        <div className="b-slide b-slide_bottom fadeInUp slide-item-1"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/3.png" className="b-slide fadeInRight" alt="Image" />
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/4.png" className="b-slide bounceIn" alt="Image" />
                      </div>

                      <div className="js-slide">
                        <div className="slide-item-2 b-slide b-slide_left fadeInLeft"></div>
                        <div className="slide-item-2 b-slide b-slide_right fadeInRight"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/6.png" className="b-slide fadeIn" alt="Image" />
                      </div>
                    </div>
                  </div>

                  <div className="shadow"></div>

                </div>

                <div className="b-content-wrapper">
                  <div className="badge badge_green">Cross-Border Bill-Payment.</div>
                  <h1 className="b-title">Orobo is a revolutionary App that facilitates cross-border bill payments. </h1>
                  <h1 className="b-title"></h1>
                  <p className="b-text"><em><strong>"Uncle said he paid the school. School said he didn't."</strong></em><br/>
                  <em>Pay bills directly or transfer money with an app built for me. <br/>
                  </em><br/>
                  Built for the African diaspora that pay bills or send money home to support their family and friends. Recipients have access to a full range of distribution channels - Cardless ATMs, ATMs, Telco Airtime, Mobile Wallets, Bank Accounts, Vouchers, or Over-the-Counter (OTC). </p>
                  <div><img src="/images/i/smile.png" alt="Image" /></div>
                </div>

              </div>
            </section>


            <section className="section">
              <div className="b-container">

                <div className="b-app-container">
                  <div className="b-device">
                    <div className="b-slides-wrapper" id="phone2">

                      <div className="js-slide">
                        <img src="/images/i/1.png" className="b-slide flipInY" alt="Image" />
                      </div>

                      <div className="js-slide">
                        <div className="slide-item-1 b-slide b-slide_top slideInDown"></div>
                        <div className="slide-item-1 b-slide b-slide_bottom slideInUp"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/3.png" className="b-slide rotateInDownLeft" alt="Image"/>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/4.png" className="b-slide zoomIn" alt="Image"/>
                      </div>

                      <div className="js-slide">
                        <div className="slide-item-2 b-slide b-slide_left rotateInDownLeft"></div>
                        <div className="slide-item-2 b-slide b-slide_right rotateInDownRight"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/6.png" className="b-slide fadeIn" alt="Image"/>
                      </div> 

                    </div>
                  </div>

                  <div className="shadow"></div>
                </div>

                <div className="b-content-wrapper">
                  <div className="badge badge_green">Lowest fees!</div>
                  <h1 className="b-title2">A fixed low fee, on any amount. Guaranteed.</h1>
                  <p className="b-text2">Not only will you find our rates to be the ‘LOWEST’ in the market but our unique App allows you to purchase airtime, pay your monthly utility bills, school fees, medical bills, purchase prescription, you can even pay contractors directly to build mom a new house:) </p>
                  <div><img src="/images/i/smile.png" alt="Image"/></div>
                </div>

              </div>
            </section>


            <section className="section">
              <div className="b-container">
                <div className="b-app-container">
                  <div className="b-device">
                    <div className="b-slides-wrapper" id="phone3">
                      <div className="js-slide">
                        <img src="/images/i/1.png" className="b-slide fadeIn" alt="Image"/>
                      </div>

                      <div className="js-slide">
                        <div className="slide-item-1 b-slide b-slide_top rotateInDownLeft"></div>
                        <div className="slide-item-1 b-slide b-slide_bottom rotateInUpRight"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/3.png" className="b-slide rotateInDownLeft" alt="Image"/>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/4.png" className="b-slide zoomInDown" alt="Image"/>
                      </div>

                      <div className="js-slide">
                        <div className="slide-item-2 b-slide b-slide_left slideInLeft"></div>
                        <div className="slide-item-2 b-slide b-slide_right slideInRight"></div>
                      </div>

                      <div className="js-slide">
                        <img src="/images/i/6.png" className="b-slide zoomInUp" alt="Image"/>
                      </div>
                    </div>
                  </div>

                  <div className="shadow"></div>
                </div>

                <div className="b-content-wrapper">
                  <div className="badge badge_green">African Vendors</div>
                  <h1 className="b-title">Thousands of Orobo vetted vendors throughout Africa.</h1>
                  <p className="b-text">The Orobo cross-border bill-payment platform gives you access to thousands of Orobo   vetted vendors throughout Africa and if your vendor isn’t listed simply add them yourself or send     us a <a href="mailto:vendor@orobo.com" className="b-text4">request</a> to add them. <br/>
                    <br/>
                    Orobo gives you the peace of mind that the money you send is going into the right hands. Oh, did we mention you can transfer cash too?
                  </p>
                  <p className="b-text"><img src="/images/i/smile.png" alt=""/></p>
                </div>

              </div>
            </section>


            <section className="section outro">
              <div className="b-container b-container_last">

                <div className="b-outro">
                  <div><img src="/images/i/logo_white.png" className="b-logo" alt="Image"/></div>
                  <h1 className="b-title2"></h1>
                  <p className="b-text2"><span className="transfer-text"><br/>We transfer more than money. We transfer happiness :)<br/><br/>
                  Orobo Corporate Offices.</span> <br/>
                      125 Village Boulevard, Princeton Forrestal Village<br/>
                      Princeton, New Jersey, 08540</p>
                  <div className="btn-group">
                      <a href="mailto:info@orobo.com" className="btn btn_apple" target="mailto:info@orobo.com">Request More Info <span></span></a>
                      <a href="" className="btn btn_apple">Download on the App Store</a>
                      <a href="" className="btn btn_apple">Download for Android</a>
                  </div>
                </div>
              
              </div>

              <footer id="footer">
                        <dl className="accordion flex-row" data-accordion-behaviour="small-screen-only">
                            <div className="flex-column copy">
                                <dt className="accordion-title">
                                    Orobo
                                    <span className="icon-chevron-down"></span>
                                </dt>
                                <dd className="accordion-body">
                                    <p><a href="/en/about-us">About us</a></p>
                                    <p><a href="/en/stories">Stories</a></p>
                                    <p><a href="/en/news">News</a></p>
                                    <p><a href="/en/careers">Careers</a></p>
                                    <p><a href="/en/sitemap">Sitemap</a></p>
                                </dd>
                            </div>
                            <div className="flex-column copy">
                                <dt className="accordion-title">
                                    Help and support
                                    <span className="icon-chevron-down"></span>
                                </dt>
                                <dd className="accordion-body">
                                    <p><a href="/en/help/faqs">FAQ</a></p>
                                    <p><a href="/contact-us">Contact us</a></p>
                                    <p><a href="/en/partners-and-affiliates">Partners and affiliates</a></p>
                                </dd>
                            </div>
                            <div className="flex-column copy">
                                <dt className="accordion-title">
                                    Legal
                                    <span className="icon-chevron-down"></span>
                                </dt>
                                <dd className="accordion-body">
                                    <p><a href="/en/about-us/terms-and-conditions">Terms and conditions</a></p>
                                    <p><a href="/privacy-policy">Privacy policy</a></p>
                                    <p><a href="/en/about-us/cookies-policy">Cookies policy</a></p>
                                </dd>
                            </div>
                            <div className="footer-social flex-column copy">
                                <dt>Follow us</dt>
                                <dd className="footer-social-icons">
                                    <a href="https://www.facebook.com/orobomoney/" data-socialfollownetwork="facebook" target="_blank" rel="noopener noreferrer" title="Follow us on Facebook">
                                      <span><i className="fa fa-facebook" aria-hidden="true"></i></span>
                                    </a>

                                    <a href="https://twitter.com/OroboMoney" data-socialfollownetwork="twitter" target="_blank" rel="noopener noreferrer" title="Follow us on Twitter">
                                      <span><i className="fa fa-twitter" aria-hidden="true"></i></span>
                                    </a>

                                    <a href="https://www.youtube.com/channel/UC-hG2gVaTNZ4n09Bd3NxnAA" data-socialfollownetwork="youtube" target="_blank" rel="noopener noreferrer" title="Follow us on Youtube">
                                      <span><i className="fa fa-youtube" aria-hidden="true"></i></span>
                                    </a>

                                    <a href="https://www.instagram.com/orobomoney/" data-socialfollownetwork="instagram" target="_blank" rel="noopener noreferrer" title="Follow us on Instagram">
                                      <span><i className="fa fa-instagram" aria-hidden="true"></i></span>
                                    </a>

                                    <a href="https://www.linkedin.com/company/orobomoney/" data-socialfollownetwork="linkedin" target="_blank" rel="noopener noreferrer" title="Follow us on LinkedIn">
                                      <span><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                                    </a>
                                </dd>
                            </div>
                            {!UserData && 
                              <div className="footer-locale flex-column copy">
                                  <dt>Sign up</dt>
                                  <dd>
                                    <Link className="button-cta" to="/sign-up">Sign up</Link>
                                  </dd>
                              </div>
                            }
                        </dl>
                        <div className="footer-disclaimer flex-row">
                            <div className="flex-column">
                                <p id="footer-company-info">
                                    Orobo Corp, 125 Village Boulevard, Princeton Forrestal Village, Princeton, NJ 08540.
                                    <span className="footer-copyright">&copy; Orobo 2018</span>
                                </p>
                            </div>
                        </div>
                    </footer>
            </section>

          </div>
        </div>

      </div>
    )
  }
  
}

export default withRouter(Homepage);