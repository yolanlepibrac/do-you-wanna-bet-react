import React, { Component } from 'react';

import ItemEditProfile from './ItemEditProfile';
import { Button, FormGroup, FormControl, ControlLabel, Dropdown, DropdownButton  } from "react-bootstrap";
import API from '../utils/API';
import { displayLoading } from "../redux/actions/index";
import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
import { DropdownMenu, MenuItem, DropdownItem, DropdownToggle } from 'react-bootstrap-dropdown-menu';


import { resetAccountState } from "../redux/actions/index";
import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { connectAccount } from "../redux/actions/index";

const Months = [  'janvier',  'fevrier',  'mars',  'avril',  'mai',  'juin',  'juillet',  'aout',  'septembre',  'octobre',  'novembre',  'decembre']
const Days = [  31,  28,  31,  30,  31,  30,  31,  31,  30,  31,  30,  31]
const heightItem = 100;
const borderWidth = 4;
const coloWin = "rgba(87,201,108)"
const coloLoose = "rgba(255,82,82)"
var listeOfDate = []
var currentYear = new Date().getFullYear()
for(var i=currentYear;i>1930;i--){
  listeOfDate.push(i)
}

function mapDispatchToProps(dispatch) {
  return {
    resetAccountState: () => dispatch(resetAccountState()),
    changeAccountState: (article) => dispatch(changeAccountState(article)),
    displayLoading: (boolean) => dispatch(displayLoading(boolean)),
    connectAccount: (boolean) => dispatch(connectAccount(boolean)),
    accountStateRedux:dispatch.accountStateRedux,
  };
};


class MyAccountContainerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      month : "Month",
      year : "Year",
      day : "Day",
      tabOfDay : ["Choose Month"],
      numberOfBetsFinished:0,
      account:this.props.accountState.account,
      toggleChangeAccountState:false,
      oldPassword : "",
      oldCPassword : "",
      newPassword : "",
      changePasswordOpen : false,
    };
  }



  componentDidMount = () => {
    var numberOfBetsFinished = 0
    var won = this.props.accountState.account.won ? this.props.accountState.account.won : 0
    for (var i = 0; i < this.props.accountState.bets.length; i++) {
      if(!this.props.accountState.bets[i].current){
        numberOfBetsFinished++
      }
    }
    if(numberOfBetsFinished>0){
      var percentWon =  won / numberOfBetsFinished
    }else{
      percentWon = 0
    }
    this.setState({
      percentWon : percentWon,
      numberOfBetsFinished:numberOfBetsFinished,
      won : won,
    })
    var centerX = (heightItem+borderWidth*2) / 2;
    var centerY = (heightItem+borderWidth*2) / 2;
    var radius = heightItem/2;

    var canvas = document.getElementById("canvasWon");
    var context = canvas.getContext('2d');

    context.beginPath();
    context.arc(centerX, centerY, radius, -Math.PI/2, 2*Math.PI*percentWon-Math.PI/2, false);
    context.lineWidth = borderWidth;
    context.strokeStyle = coloWin;
    context.stroke();

    var canvasLoose = document.getElementById("canvasLoose");
    var contextLoose = canvasLoose.getContext('2d');
    contextLoose.beginPath();
    contextLoose.arc(centerX, centerY, radius,  2*Math.PI*percentWon-Math.PI/2, 3*Math.PI/2, false);
    contextLoose.lineWidth = borderWidth;
    contextLoose.strokeStyle = coloLoose;
    contextLoose.stroke();
  }



  setToDatabase = (account) => {
    var context = this;
    API.setUserInfo(account, this.props.accountState.account.id).then(function(data){
      localStorage.setItem("email", account.email)
      context.props.changeAccountState(account);
      context.setState({toggleChangeAccountState:false})
    })
  }



  returnItemList = (stateValue, stateKey) => {
    return <div style={{cursor:"pointer"}} class="dropdown-item">{stateValue}</div>
  }

  setMonth = (value) => {
    this.putInState(value, "birthMonth")
  }

  putInState = (stateKey, stateValue) => {
    console.log(stateValue)
    if(stateKey === "birthMonth"){
      this.setNumberOfDay(stateValue)
    }
    this.setState({
      [stateKey] : stateValue
    })
  }

  setNumberOfDay = (month) => {
    var numberDay = 0
    for (var i = 0; i < Months.length; i++) {
      if(month === Months[i] ){
        numberDay = Days[i]
      }
    }
    var tabDay = []
    for(var i=1;i<=numberDay;i++){
      tabDay.push(i)
    }
    this.setState({
      tabOfDay : tabDay,
    })

  }




  disconnect = () => {
    this.props.resetAccountState()
    this.props.logout()
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
        API.setUserInfo({"imageProfil" : reader.result}, localStorage.email).then(function(data){
          console.log(data.data.email)
          API.getUserDataByEmail(data.data.email).then(function(data2){
              context.props.changeAccountState(data2.data.userData);
              console.log(data2.data.userData)
            })
        })
      }else{
        alert('Image too big, choose another one please')
      }
    }
    if(file){
      reader.readAsDataURL(file)
    }
    this.forceUpdate()
  }


  onInputChange = (key, value) => {
    var newAccount = this.state.account
    newAccount[key] = value
    console.log(key)
    this.setState({
      account : newAccount
    })
    console.log(this.state.account)
  }

  toggleChangeAccountState = () => {
    this.setState({
      toggleChangeAccountState : !this.state.toggleChangeAccountState
    })
  }

  changePassword = () => {
    this.setState({changePasswordOpen : !this.state.changePasswordOpen})
  }

  ValidateChangePassword = () => {
    this.setState({changePasswordOpen : false})
    console.log(this.state.oldPassword)
    console.log(this.state.oldCPassword)
    console.log(this.state.newPassword)
    if(this.state.oldPassword === "" || this.state.oldPassword === undefined || this.state.oldPassword !== this.state.oldCPassword || this.state.newPassword === ""){
      return
    }else{
      API.updatePassword(this.props.accountState.account.id, this.state.oldPassword, this.state.newPassword).then((data) => {
        console.log(data.data)
      })
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  render(){

      let listeOfDate = []
      var currentYear = new Date().getFullYear()
      for(var i=currentYear;i>1930;i--){
        listeOfDate.push(i)
      }
      return (
        <div className="MyAccountContainer" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div style={{height:"100%", width:"95%", marginTop:10}}>
            <h5>SETTINGS</h5>
            <div style={{position:"absolute", top:15, right:15, width:40, height:40, backgroundImage:"url("+ require('../assets/images/exit.png') +")", backgroundSize:"cover", borderRadius:"50%", backgroundColor:"rgba(240,240,240,1)", boxShadow:"0px 0px 3px 1px rgba(0,0,0,0.3)"}} onClick={this.disconnect}>
            </div>


            <div style={{paddingBottom:10, width: '100%', display: 'flex', flexDirection: 'column', flexWrap:'wrap', marginTop:30, marginBottom:10, alignItems:"flex-start", overflowX:"hidden", }}>
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid"}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent:"space-between", alignItems:"center", width:"100%"}}>
                  <div style={{marginLeft:10}}>Profile</div>
                  {this.state.toggleChangeAccountState?
                      <div onClick={() => this.setToDatabase(this.state.account)} style={{width:75, height:25, borderRadius:7, fontSize:15, color:"white", backgroundColor:"rgba(200,200,200,1)"}}>Submit
                      </div>
                    :
                    <div onClick={this.toggleChangeAccountState} style={{width:75, height:25, borderRadius:7, fontSize:15, color:"white", backgroundColor:"rgba(200,200,200,1)"}}>Edit
                    </div>
                  }
                </div>
              </div>
              {this.state.toggleChangeAccountState?
                <div onClick={this.toggleChangeAccountState} style={{width:30, marginLeft:5, height:25, borderRadius:7, fontSize:15, color:"white", backgroundColor:"rgba(200,200,200,1)"}}>X
                </div>
                :
                null
              }


              <div style={{width:"100%", height:"100%", display:"flex", flexDirection:"column",  paddingLeft:10}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems:"flex-start",paddingTop:20}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems:"flex-start"}}>
                      <strong style={{ textAlign:"left", fontSize:13, marginBottom:10}}>Profile Picture</strong>
                      <label for="file-input">
                        {this.props.accountState.account.imageProfil ?
                          <img width="160" height="160" src={this.props.accountState.account.imageProfil} style={{cursor:"pointer", borderWidth:0, borderStyle:"solid", borderRadius:"10%", borderWidth:this.state.toggleChangeAccountState?1:0, borderStyle:"solid", borderColor:"rgba(100,100,100,1)"}}/>
                          :
                          <img width="160" height="160" src={require('../assets/images/connectBig.png')} style={{cursor:"pointer", borderWidth:1, borderStyle:"solid", borderRadius:"10%", borderWidth:this.state.toggleChangeAccountState?1:0, borderStyle:"solid", borderColor:"rgba(100,100,100,1)"}}/>
                        }
                      </label>
                      {this.state.toggleChangeAccountState ?
                        <input id="file-input" type="file" onChange={(e)=>this._handleImageChange(e, this)} style={{display: "none"}}/>
                        :null
                      }
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems:"flex-start", width:"100%"}}>
                    <ItemEditProfile placeHolder={"Name"} value={this.state.account.userName} heightSize={1} onChange={this.onInputChange} keyForState={"userName"} changePossible={this.state.toggleChangeAccountState}/>
                    <ItemEditProfile placeHolder={"email"} value={this.state.account.email} heightSize={1} onChange={this.onInputChange} keyForState={"email"} changePossible={this.state.toggleChangeAccountState}/>
                    <ItemEditProfile placeHolder={"phone"} value={ this.state.account.phone} heightSize={1} onChange={this.onInputChange} keyForState={"phone"} changePossible={this.state.toggleChangeAccountState}/>
                  </div>
                </div>

                <div style={{width:"100%", display : "flex", flexDirection:"column",}}>
                  <strong style={{ textAlign:"left", fontSize:13}}>Birth</strong>
                  <div style={{width:"100%", display : "flex", flexDirection:"row", alignItems:"space-between", justifyContent:"space-between",paddingRight:2}}>
                      <button style={{width:100, backgroundColor:"rgba(245,245,245,1)", color:"black", height:30, fontSize:15, padding:0, margin:0}} class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.accountState.account.birthYear ? this.props.accountState.account.birthYear : "Year"}
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={{height:200, overflow:"auto"}}>
                        {listeOfDate.map((year)=>this.returnItemList(year, "birthYear"))}
                      </div>
                      <button style={{width:100, backgroundColor:"rgba(245,245,245,1)", color:"black", height:30, fontSize:15, padding:0, margin:0}} class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.accountState.account.birthMonth ? this.props.accountState.account.birthMonth : "Month"}
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{height:200, overflow:"auto"}}>
                        {Months.map((month)=>this.returnItemList(month, "birthMonth"))}
                      </div>
                      <button style={{width:100, backgroundColor:"rgba(245,245,245,1)", color:"black", height:30, fontSize:15, padding:0, margin:0}} class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.accountState.account.birthDay ? this.props.accountState.account.birthDay : "Day"}
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{height:200, overflow:"auto"}}>
                        {this.state.tabOfDay.map((day)=>this.returnItemList(day, "birthDay"))}
                      </div>
                  </div>
                </div>
              </div>

            </div>

            <div style={{paddingBottom:10, width: '100%', display: 'flex', flexDirection: 'column', flexWrap:'wrap',  alignItems:"flex-start", overflowX:"hidden", overflowY:"auto", position:"relative"}}>
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid"}}>
                <div style={{marginLeft:10}}>General</div>
              </div>
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems:"flex-start", paddingLeft:10}}>
                <div>{"bets made  : " + this.props.accountState.bets.length}</div>
                <div>{"bets won   : " + this.state.won}</div>
                <div>{"bets lost  : " + (this.state.numberOfBetsFinished-this.state.won)}</div>
                <div>{"witness of : " + this.props.accountState.witnessOf.length}</div>
                <div>{"friends    : " + this.props.accountState.friends.length}</div>
              </div>
              <canvas id={"canvasWon"} width={heightItem+borderWidth*2} height={heightItem+borderWidth*2} style={{position:"absolute", bottom:0, zIndex:100, right:20}}>
              </canvas>
              <canvas id={"canvasLoose"} width={heightItem+borderWidth*2} height={heightItem+borderWidth*2} style={{position:"absolute", bottom:0, zIndex:100,right:20}}>
              </canvas>
              <div style={{position:"absolute", bottom:0, zIndex:100, right:20, fontSize:30, width:heightItem+borderWidth*2, height:heightItem+borderWidth*2, display:"flex", textAlign:"center", alignItems:"center", justifyContent:"center", color:"black"}}>{this.state.percentWon*100 + "%"}
              </div>
            </div>


            <div style={{paddingBottom:10, width: '100%', display: 'flex', flexDirection: 'column', flexWrap:'wrap', marginTop:10, alignItems:"flex-start", overflowX:"hidden", overflowY:"auto"}}>
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems:"flex-start",  paddingTop:10, paddingBottom:10, borderBottomWidth:1, borderBottomColor:"rgba(200,200,200,1)", borderBottomStyle:"solid"}}>
                <div style={{marginLeft:10}}>Security</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", marginLeft:10, marginBottom:5, marginTop:5}}>
                <strong style={{width: 200, textAlign:"left", fontSize:13}}>{"Password"}</strong>
                <div style={{width: 10, display: 'flex', flexDirection: 'column', alignItems:"left", marginBottom:5, marginTop:5, fontSize:15, justifyContent:"flex-start", marginLeft:0, marginRight:0,}}>
                  <div style={{width: 200, height:30*this.props.heightSize, textAlign:"left", display: 'flex', flexDirection: 'column', justifyContent:"center", backgroundColor:"rgba(245,245,245,1)", borderRadius:3, paddingLeft:20, marginRight:20, color:"black", borderWidth:1, borderStyle:"solid", borderColor:"rgba(150,150,150,1)"}}>
                  {"•••••••••"}
                </div>
                <button style={{width: 200, height:30, fontSize:16, textAlign:"center", justifyContent:"flex-start", marginLeft:0, padding:0, color:"white", borderWidth:0}} type="button" class="btn btn-secondary btn-lg" onClick={this.changePassword}>Modifie</button>
                </div>
              </div>
            </div>

            {this.state.changePasswordOpen ?
              <div>
                <div onClick={this.changePassword}>CANCEL
                </div>
                <div controlId="oldPassword" bsSize="small">
                  <div>Password</div>
                  <input id="oldPassword" value={this.state.oldPassword} onChange={this.handleChange} type="password"/>
                </div>
                <div controlId="oldCPassword" bsSize="small">
                  <div>Password</div>
                  <input id="oldCPassword" value={this.state.oldCPassword} onChange={this.handleChange} type="password"/>
                </div>
                <div controlId="newPassword" bsSize="small">
                  <div>Confirm Password</div>
                  <input id="newPassword" value={this.state.newPassword} onChange={this.handleChange} type="password"/>
                </div>
                <div onClick={this.ValidateChangePassword}>Validate
                </div>
              </div>
              :null
            }

          </div>
        </div>
      )

  }
}


const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
  }
}

const MyAccountContainer = connect(mapStateToProps, mapDispatchToProps)(MyAccountContainerComponent);
export default MyAccountContainer;
