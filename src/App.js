import React, { Component } from 'react';
import './App.css';
import { createStore } from 'redux';
import Spinner from 'react-bootstrap/Spinner'
import API from './utils/API';
import YolanHeder from './components/YolanHeader';
import AppContainer from './components/AppContainer';
import NoAccount from './components/NoAccount';
import Utils from './utils/Utils';

import { connect } from "react-redux";

import { changeAccountState } from "./redux/actions/index";
import { displayLoading } from "./redux/actions/index";
import { getUserFriends } from "./redux/actions/index";
import { getUserBets } from "./redux/actions/index";
import { getUserWitnessOf } from "./redux/actions/index";
import { setSheetSelected } from "./redux/actions/index";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (userData) => dispatch(changeAccountState(userData)),
    getUserBets: (tabOfBets) => dispatch(getUserBets(tabOfBets)),
    getUserFriends: (tabOfFriends) => dispatch(getUserFriends(tabOfFriends)),
    getUserWitnessOf: (tabOfWitnessOf) => dispatch(getUserWitnessOf(tabOfWitnessOf)),
    displayLoading: (boolean) => dispatch(displayLoading(boolean)),
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
  };
};

class AppComponent extends React.Component {

  constructor (props) {
    super(props)
    this.dataStored = 0;
    this.state = {
      connected: false,
      displayLoading:false,
      impossibleToConnect : false,
      messageError: "",
     }
  }



  componentDidMount = () => {
    if(localStorage.connected === "true" && localStorage.email.length>0 && localStorage.email !== "undefined"){
      Utils.loginAlreadyConnected(localStorage.email, localStorage.onglet, this)
    }
  }

  login = (email, password) => {
    this.setState({displayLoading:true})
    var log = new Promise((resolve, reject)=>{
      API.login(email, password).then((dataCurrentUser)=>{
        console.log(dataCurrentUser)
        this.props.changeAccountState(dataCurrentUser.data.user.userData);
        this.props.getUserFriends(dataCurrentUser.data.user.friends);
        this.props.getUserBets(dataCurrentUser.data.user.bets);
        this.props.getUserWitnessOf(dataCurrentUser.data.user.witnessOf);
        resolve(true)
      })
    })
    log.then(()=>{
      this.setState({
        displayLoading:false,
        onglet : "bet on",
        connected:true,
        email:email,
      })
      localStorage.setItem("connected" , true)
      localStorage.setItem("email" , email)
    }).catch((error)=>{
      console.log(error);
      this.setState({displayLoading:false})
    })
  }



      signUp = (email, userName, imageProfil, password, cpassword) => {
        var context = this;
        this.setState({displayLoading:true})

        if(userName.length === 0){
          context.setState({
            displayLoading:false,
            impossibleToConnect : true,
            messageError : "Please choose a user name"
          })
            return;
        }
        if(email.length === 0){
          context.setState({
            displayLoading:false,
            impossibleToConnect : true,
            messageError : "Please fill your email"
          })
            return;
        }
        if(imageProfil.length === 0){
          context.setState({
            displayLoading:false,
            impossibleToConnect : true,
            messageError : "Please pick a profile picture"
          })
            return;
        }
        if(password.length === 0 || password !== cpassword){
            context.setState({
              displayLoading:false,
              impossibleToConnect : true,
              messageError : "Carefull, password and confirm password does not match or are invalid"
            })
            return;
        }
        var _send = {
            id:'_' + Math.random().toString(36).substr(2, 9),
            email: email,
            userName: userName,
            password: password,
            imageProfil: imageProfil,
            bets:[],
            witnessOf:[],
            friends:[],
        }

        API.signup(_send).then(function(data){
          if(data.status === 200){
            context.props.changeAccountState(data.data.userData);
            context.props.getUserFriends([]);
            context.props.getUserBets([]);
            context.props.getUserWitnessOf([]);
            context.setState({
              email : email,
              onglet : "bet on",
              connected:true,
            })
            localStorage.setItem("connected" , true)
            localStorage.setItem("email" , email)
            context.setState({
              displayLoading:false,
              impossibleToConnect : false,
              messageError : ""
            });
          }else if(data.status === 204){
            context.setState({
              displayLoading:false,
              impossibleToConnect : true,
              messageError : "This email is already used"
              })
          }
        },function(error){
            context.setState({
              displayLoading:false,
              impossibleToConnect : true,
              messageError : "error with server"
            });
        })
      }

      logout = () => {
        this.dataStored = 0
        localStorage.setItem("connected" , false)
        localStorage.setItem("email" , "")
        localStorage.setItem("email" , "bet on")
        this.setState({connected:false})
      }

      setOnglet = (onglet) => {
        localStorage.setItem("onglet", onglet)
        console.log(localStorage.onglet)
        this.setState({
          onglet:onglet
        })
      }

  render(){
    return (
      <div className="App" >
        {!this.state.displayLoading  ?
          <div>
            <header className="App-header">
              <YolanHeder height={30} fontSize={15} backgroundColor={'rgba(0, 125, 33)'}>Do you wanna bet
              </YolanHeder>
            </header>
            <div className="App-container">

              { this.state.connected ?
                <AppContainer logout={this.logout} setOnglet={this.setOnglet} ongletselected={this.state.onglet}/>
                :
                <div style={{width:"100vw"}}>
                  <NoAccount login={this.login} register={this.signUp}/>
                  <img src={require('./assets/images/betOnWhite.png')} alt="logo" style={{position:"absolute", left:0, width:"100vw", top:100, zIndex:4}}/>
                </div>
              }
              {this.state.impossibleToConnect ?
                <div style={{color:"red", fontSize:16, margin:5, marginBottom:15, marginTop:"70vh"}}>{this.state.messageError}
                </div>
                : null
              }

            </div>
          </div>
          :
          <div style={{width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Spinner animation="border" />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connected:state.account.connectedRedux,
    displayLoading:state.helper.displayLoadingRedux,
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default App;
