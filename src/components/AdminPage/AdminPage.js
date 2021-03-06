import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import MainComponent from './MainComponent/MainComponent'
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  user: state.user,
});

class AdminPage extends Component {

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }


  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('/home');
    }
  }


  render() {
    let content;

      if(this.props.user.userName){
        content = ( <div>
        <Nav history={this.props.history} />
          <MainComponent /> 
          </div>)
      }
    return (
      <div>

      {content}
        
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(AdminPage);

