import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../utils/API';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { displayLoading } from "../redux/actions/index";
import { connectAccount } from "../redux/actions/index";
import { getUserFriends } from "../redux/actions/index";
import { getUserBets } from "../redux/actions/index";
import { getUserWitnessOf } from "../redux/actions/index";


function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (article) => dispatch(changeAccountState(article)),
    displayLoading: (boolean) => dispatch(displayLoading(boolean)),
    connectAccount: (boolean) => dispatch(connectAccount(boolean)),
    getUserBets: (tabOfBets) => dispatch(getUserBets(tabOfBets)),
    getUserFriends: (tabOfFriends) => dispatch(getUserFriends(tabOfFriends)),
    getUserWitnessOf: (tabOfWitnessOf) => dispatch(getUserWitnessOf(tabOfWitnessOf)),
    accountStateRedux:dispatch.accountStateRedux,
  };
};


export class SignupComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : "",
            userName: "",
            password: "",
            cpassword: "",
            imageProfil:"",
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }

    _handleImageChange(e, context) {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend  = () => {
        console.log("done")
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
          border:0,
        });
        if(reader.result.length < 6500000){
          this.setState({
            imageProfil : reader.result
          })
          console.log(reader.result)
        }else{
          alert('Image too big, choose another one please')
        }
      }
      if(file){
        reader.readAsDataURL(file)
      }
      this.forceUpdate()
    }

    send = (event, context) => {
        this.props.register(this.state.email, this.state.userName, this.state.imageProfil, this.state.password, this.state.cpassword)
    }


    handleChange = event => {
      this.setState({
        [event.target.id]: event.target.value
      });
    }


    render() {
        return(
            <div className="Login" style={{ marginTop:0}}>
                <FormGroup controlId="userName" bsSize="small" >
                  <div>Full name</div>
                  <FormControl autoFocus type="userName" value={this.state.userName} onChange={this.handleChange} style={{width:"100%"}}/>
                </FormGroup>
                <FormGroup controlId="email" bsSize="small">
                  <div>Email</div>
                  <FormControl  type="email" value={this.state.email} onChange={this.handleChange}/>
                </FormGroup>
                <FormGroup controlId="password" bsSize="small">
                  <div>Password</div>
                  <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                </FormGroup>
                <FormGroup controlId="cpassword" bsSize="small">
                  <div>Confirm Password</div>
                  <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                </FormGroup>
                <label for="file-input">
                  {this.state.imageProfil ?
                    <img width="50" height="50" src={this.state.imageProfil} style={{cursor:"pointer", borderWidth:0, borderStyle:"solid", borderRadius:"10%"}}/>
                    :
                    <img width="50" height="50" src={require('../assets/images/connectBig.png')} style={{cursor:"pointer", borderWidth:1, borderStyle:"solid", borderRadius:"10%"}}/>
                  }
                </label>
                <input id="file-input" type="file" onChange={(e)=>this._handleImageChange(e, this)} style={{display: "none"}}/>
                <Button
                  onClick={(event) => this.send(event, this)}
                  block
                  bsSize="small"
                  type="submit"
                  style={{backgroundColor:"rgba(240,240,240,1)", color:"black"}}
                  >
                  Inscription
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

const Signup = connect(mapStateToProps, mapDispatchToProps)(SignupComponent);
export default Signup;
