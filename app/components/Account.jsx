import React, { Component } from 'react';
import {Link} from 'react-router';
import UserRating from './UserRating.jsx';

export default class UserSetting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.id,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      photo: this.props.user.photo,
      phone: this.props.user.phone,
      starRating: this.props.user.starRating,
      editing: this.props.user.editing,
      userEmail: this.props.user.userEmail,
      userPhone: this.props.user.userPhone,
      userAddress: this.props.user.userAddress,
      aboutMe: ''
    };
    this.setUser = this.setUser.bind(this);
    this.handleChangeAboutMe = this.handleChangeAboutMe.bind(this);
  }

  setUser (user) {
    var userStarRating = user.user.numberOfRatings === 0 ? 0 : user.user.sumOfRatings / user.user.numberOfRatings;
    var userEmail = user.user.email || 'please provide email';
    var userAddress = user.user.address || 'please provide address';
    var userPhone = user.user.phone || 'please provide phone number';
    this.setState({
      id: user.user.id,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      userEmail: userEmail,
      userPhone: userPhone,
      userAddress: userAddress,
      photo: user.user.photo,
      aboutMe: user.user.aboutMe,
      starRating: userStarRating
    })
  }

  componentWillMount() {
    const context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        context.setUser(user);
      }
    });
  }

  editProfile () {
    this.setState({
      editing: !this.state.editing
    })
  }

  handleChangeAboutMe (event) {
    this.setState({aboutMe: event.target.value});
  }

  saveProfile () {
    this.editProfile();
    const context = this;

    $.ajax({
      method: 'POST',
      url: '/api/account/aboutMe',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({aboutMe: context.state.aboutMe}),
      success: function(response) {
      }, error: function(error) {
        console.error('Error: ', error);
      }
    })
  }

  handleSubmit(setSomething, e) {
    e.preventDefault();
    var valid = true;
    var filter = function validateURL(textval) {     //  Verify if entered email is valid
      var emailregex = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/;
      return emailregex.test(textval);
    };

    if ($('#user-email').val() === '' && setSomething === 'email') {
      $('.emailError').show();
      $('.addressError').hide();
      $('.phoneError').hide();
      $('.passwordError').hide();
      valid = false;
    }

    if ($('#user-address').val() === '' && setSomething === 'address') {
      $('.addressError').show();
      $('.emailError').hide();
      $('.phoneError').hide();
      $('.passwordError').hide();
      valid = false;
    }

    if ($('#user-phone').val() === '' && $('#user-phone').val().length <= 6 && setSomething === 'phone') {
      $('.phoneError').show();
      $('.emailError').hide();
      $('.addressError').hide();
      $('.passwordError').hide();
      valid = false;
    }
    // If entered value is valid, set state with entered value
    if (valid === true) {
      var stateObj = {};
      $('.phoneError').hide();
      $('.emailError').hide();
      $('.addressError').hide();
      $('.passwordError').hide();

      if (setSomething === 'passWord') {
        stateObj[setSomething] = $('#user-password').val();
      }
      if (setSomething === 'email') {
        stateObj[setSomething] = $('#user-email').val();
      }
      if (setSomething === 'address') {
        stateObj[setSomething] = $('#user-address').val();
      }
      if (setSomething === 'phone') {
        stateObj[setSomething] = $('#user-phone').val();
      }

      this.setState({user: stateObj});

      var context = this;
      $.ajax({                    //  Ajax request to update user info
        method: 'GET',
        url: 'api/user_data',
        success: function(userData) {
          $.ajax({
            method: 'PUT',
            url: '/users',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({userData: context.state.user}),
            success: function(newUserInformation) {
              console.log('Updated user info: ', newUserInformation);
            },
            error: function(error) {
              console.log('error');
            }
          });
        }
      });

      //  Clean up input field after submit button is clicked
      $('#user-email').val('');
      $('#user-address').val('');
      $('#user-password').val('');
    }
  }


  handleToggle(stateToChange) {    //  Shows and hides input fields
    var s = {};
    s[stateToChange] = !this.state[stateToChange];
    this.setState(s);
  }

  render() {  //  On click, shows input field
    // var passCheck = this.state.passWord ? <div><form onSubmit={this.handleSubmit.bind(this, 'passWord')}><input id='user-password' type='password' placeholder='Type new password' className="input-xlarge"></input>
    //                                         <button type='submit' className="setting-btn passwordBtn btn btn-primary btn-sm">Submit</button></form>
    //                                         <div className="passwordError alert alert-danger fade in" role="alert">
    //                                         <strong>Woah! Invalid Password </strong><small>Please enter a valid password</small></div>
    //                                       </div> : '';
    var mailCheck = this.state.email ? <div><form onSubmit={this.handleSubmit.bind(this, 'email')}><input id='user-email' type="email" placeholder={this.state.userEmail} className="account-input"></input>
                                          <button type='submit' className="setting-btn emailBtn btn btn-primary btn-sm">Submit</button></form>
                                          <div className="emailError alert alert-danger fade in" role="alert">
                                          <strong>Woah! Invalied email </strong><small>Please enter a valid email address</small></div>
                                       </div> : '';
    var addressCheck = this.state.address ? <div><form onSubmit={this.handleSubmit.bind(this, 'address')}><input id='user-address' type='text' placeholder={this.state.userAddress} className="account-input"></input>
                                              <button type='submit' className="setting-btn addressBtn btn btn-primary btn-sm">Submit</button></form>
                                              <div className="addressError alert alert-danger fade in" role="alert">
                                              <strong>Woah! Invalid address </strong><small>Please enter a valid address</small></div>
                                            </div> : '';
    var phoneCheck = this.state.phone ? <div><form onSubmit={this.handleSubmit.bind(this, 'phone')}><input id='user-phone' type='tel' placeholder={this.state.userPhone} className="account-input"></input>
                                          <button type='submit' className="setting-btn phoneBtn btn btn-primary btn-sm">Submit</button></form>
                                          <div className="phoneError alert alert-danger fade in" role="alert">
                                          <strong>Woah! Invalid Phone number </strong><small>Please enter a valid phone number</small></div>
                                        </div> : '';

    var starRating = this.state.starRating;

    var aboutMe = this.state.editing ?
    /* EDITING */
      <div className="row">
        <div className="row">
          <div className="input-group-md">
            <textarea className="form-control about-me-description" name="aboutMe" value={this.state.aboutMe} onChange={ this.handleChangeAboutMe }/>
          </div>
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary btn-sm edit" aria-label="Left Align" onClick={ () => this.saveProfile()}>
            <span>save</span>
          </button>
        </div>
      </div> :
      /* NOT EDITING */
      <div className="row">

        <div className="row">
            <p className="about-me-description">{this.state.aboutMe}</p>
        </div>

        <div className="row">
          <button type="button" className="btn btn-primary btn-sm edit" aria-label="Left Align" onClick={ () => this.editProfile() } >
            <span aria-hidden="true">edit about me</span>
          </button>
        </div>

      </div>

    return (
      <div style = {{margin: 100}} className="container">
        <div className="row">
          <div className="col-md-4">
              <img src={this.state.photo} alt="Oops! Can't find your photo" className="img-responsive profile-image"/>
          </div>
          <div className="col-md-4">

            <Link to={'/profile/' + this.state.id}>
              <h3 className="account-name">{this.state.firstName} {this.state.lastName}</h3>
            </Link>

            <div className="row settings">
              <h4 className="">Settings</h4>
                <div>
                  <Link to='/account' onClick={this.handleToggle.bind(this, 'email')}><h6>Change Email</h6></Link>
                  {mailCheck}
                </div>
                <div>
                  <Link to='/account' onClick={this.handleToggle.bind(this, 'address')}><h6>Change Address</h6></Link>
                  {addressCheck}
                </div>
                <div>
                  <Link to='/account' onClick={this.handleToggle.bind(this, 'phone')}><h6>Change Phone Number</h6></Link>
                  {phoneCheck}
                </div>

            </div>
          </div>
        </div>

        <div className="row account">
          <div className="col-md-4">
            {this.state.starRating ? (<UserRating editable={'false'} starRating={ starRating }/>) : <div></div>}
          </div>
          <div className="col-md-8">
            <h4>About me</h4>
              {aboutMe}
          </div>
        </div>
      </div>
    );
  }
}
