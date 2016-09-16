import React, {Component} from 'react';
import UserRating from './UserRating.jsx';

export default class Profile extends Component {
  constructor (props) {
    super (props);
    console.log(props);
    this.state = {
      notfound: false,
      name: 'loading..',
      rating: 'loading..',
      aboutMe: 'loading..',
      starRating: null
    }
  }

  componentWillMount(){
    this.getProfileInfo();
  }


  getProfileInfo(){
    var context = this;
    $.ajax({
      url: '/api/profile/' + this.props.params.id,
      method: 'GET',
      success: function(response){
        if (response.notfound) {
          context.setState({notFound: true});
        }
        console.log('response',response.user)

        var name = response.user.firstName + ' ' + response.user.lastName;
        var rating = response.user.rating;
        var aboutMe = response.user.aboutMe;
        var numberOfRatings = response.user.numberOfRatings;
        var sumOfRatings = response.user.sumOfRatings;
        var starRating = numberOfRatings === 0 ? null : sumOfRatings / numberOfRatings;

        context.setState({
          name: name,
          rating: rating,
          aboutMe: aboutMe,
          picture: response.user.photo,
          starRating: starRating
        })
      }
    })
  }

  render(){

    var starRating = this.state.starRating;
    if (this.state.notfound) {
      return (<div>User not found!</div>)
    }
    return (
    <div className="user-profile container">
      <div className="col-md-4 profile-left">
        <div className="profile-image">
          <img src={this.state.picture} alt=""></img>
        </div>
        <h4>{ this.state.name }</h4>
        <div>
          {this.state.starRating ? (<UserRating editable={'false'} starRating={ starRating }/>) : 'Unrated'} 
        </div>


        <p className="user-description">
          { this.state.aboutMe ? this.state.aboutMe : 'User hasn\'t filled out description yet.'}
        </p>
      </div>
      <div className="col-md-8 profile-right">
        <h2>Seller / Buyer History</h2>
        <div className="history-list">
          History list goes here
        </div>
      </div>
    </div>
    )
  }


}