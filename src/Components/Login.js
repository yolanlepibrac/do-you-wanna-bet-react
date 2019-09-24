import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../utils/API';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Redirect } from 'react-router';
import {browserHistory} from "react-router";
import PropTypes from 'prop-types'

import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { displayLoading } from "../redux/actions/index";
import { connectAccount } from "../redux/actions/index";
import { getUserFriends } from "../redux/actions/index";
import { getUserBets } from "../redux/actions/index";
import { getUserWitnessOf } from "../redux/actions/index";

import { bindActionCreators } from "redux";

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
	    changeAccountState,
	    getUserBets,
	    getUserFriends,
	    getUserWitnessOf,
	    displayLoading,
	    connectAccount,
	   },dispatch);
};


export class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: "",
            impossibleToConnect : false,
            friendsStored:false,
            betsStored : false,
            witnessOfStored:false,
        }

    }



  send = () => {
    if(this.state.email.length === 0){
        return;
    }
    if(this.state.password.length === 0){
        return;
    }
    this.props.login(this.state.email, this.state.password)
  }

  handleChange = event => {
      this.setState({
          [event.target.id]: event.target.value
      });
  }




    render() {
        return(
            <div className="Login"  style={{ marginTop:0}}>
              {this.state.impossibleToConnect ?
                <div style={{color:"red", fontSize:13, margin:5, marginBottom:15}}>Impossible to connect (password and email does not match).
                </div>
                : null
              }
                <FormGroup controlId="email" bsSize="small">
                  <div>Email</div>
                  <FormControl autoFocus type="email" onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="password" bsSize="small">
                  <div>Password</div>
                  <FormControl  onChange={this.handleChange} type="password"/>
                </FormGroup>
                <Button
                  onClick={this.send}
                  block
                  bsSize="small"
                  type="submit"
                  style={{backgroundColor:"rgba(240,240,240,1)", color:"black"}}
                >
                Connexion
                </Button>
            </div>
        )
    }
}




const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default Login;
