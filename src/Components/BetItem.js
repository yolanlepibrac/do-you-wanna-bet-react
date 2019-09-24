
import React, { Component } from 'react';
import '../App.css';
import { connect } from "react-redux";

import { setSheetSelected } from "../redux/actions/index";
import API from '../utils/API';
import Spinner from 'react-bootstrap/Spinner'
import Utils from '../utils/Utils';

const sizeIconMobile = 40;
function mapDispatchToProps(dispatch) {
  return {
    setSheetSelected: (nameSheet) => dispatch(setSheetSelected(nameSheet)),
    sheetSelected:dispatch.sheetSelected,
    friends:dispatch.friends,
  };
};

class BetItemComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      players1 : [],
      players2 : [],
      witness : [],
      clickabe:false,
      displayLoading : true,
      tabOfPlayer1IsLoad : false,
      tabOfPlayer2IsLoad : false,
      witnessIsLoad : false,
      imTheWitness : false,
      iWon : false,
      acceptedByMe:undefined,
     }
  }


  getFriendsWithTabId = (tabOfFriendID, key) => {
        var newTabOfFriendID = [];
        var copiedTabOfFriendID = [];
        Object.assign(copiedTabOfFriendID, tabOfFriendID);


        for (var i = 0; i < copiedTabOfFriendID.length; i++) {
          if(copiedTabOfFriendID[i]===undefined ||copiedTabOfFriendID[i]===null){
            copiedTabOfFriendID.splice(i, 1);
            break;
          }
          if(typeof(copiedTabOfFriendID[i])==="string"){
            copiedTabOfFriendID[i] = {id:copiedTabOfFriendID[i], accepted:undefined}
          }
        //  console.log(copiedTabOfFriendID[i])
          if(copiedTabOfFriendID[i].id === this.props.accountState.account.id){
            newTabOfFriendID.push({user:this.props.accountState.account, accepted:copiedTabOfFriendID[i].accepted});
            this.setState({acceptedByMe:copiedTabOfFriendID[i].accepted})
            //console.log(copiedTabOfFriendID[i].accepted)
            copiedTabOfFriendID.splice(i, 1)

          }else{

            for (var j = 0; j < this.props.accountState.friends.length; j++) {
              if(copiedTabOfFriendID[i] !== undefined && this.props.accountState.friends[j] !== undefined){
                if(this.props.accountState.friends[j].id === copiedTabOfFriendID[i].id){
                  newTabOfFriendID.push({user:this.props.accountState.friends[j],accepted:copiedTabOfFriendID[i].accepted})
                  copiedTabOfFriendID.splice(i, 1)
                }
              }
              //console.log(this.props.accountState.friends[j].id)

            }
          }
        }

        if(copiedTabOfFriendID.length>0){
          API.getUsersDataByID(copiedTabOfFriendID.map((friendObject)=>(friendObject.id))).then((data)=>{
            var tabWithAccepted = []
            for (var i = 0; i < data.data.usersData.length; i++) {
              if(copiedTabOfFriendID[i] !== undefined){
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:copiedTabOfFriendID[i].accepted}
              }else{
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:undefined}
              }
            }
            var newFullTab = newTabOfFriendID.concat(tabWithAccepted);
            this.setState({[key]: newFullTab});
            //console.log(newFullTab)
          });
        }else{
            this.setState({[key]: newTabOfFriendID});
            //console.log(newTabOfFriendID)
        }

  }

  componentDidMount = () => {
    //console.log(this.props.bet)
    let bet = this.props.bet
    /*
    this.getFriendsWithTabId(bet.players1, "players1")
    this.getFriendsWithTabId(bet.players2, "players2")
    this.getFriendsWithTabId([bet.witness], "witness")
    */
    let betDate = bet.expiration
    let todayDate = Utils.dateToString(new Date())
    var isPassed = this.checkIfDateIsPassed(betDate, todayDate)
    if(this.checkIfDateIsPassed(betDate, todayDate)){
      this.setState({isPassed : true})
    }

  }

  checkIfDateIsPassed = (betDate, todayDate) => {
     let isPassed = false
     if(betDate !== "never" && betDate !== undefined){
       //console.log(betDate)
       //console.log(todayDate)
       let betDateYear = parseInt(betDate.substr(betDate.length-4, betDate.length-1))
       let todayDateYear = parseInt(todayDate.substr(todayDate.length-4, todayDate.length-1))
       //console.log(betDateYear)
       //console.log(todayDateYear)
       if(todayDateYear>betDateYear){
         isPassed = true
       }else if (todayDateYear === betDateYear){
         let betDateMonth = parseInt(betDate.substr(betDate.length-7, betDate.length-3))
         let todayDateMonth = parseInt(todayDate.substr(todayDate.length-7, todayDate.length-3))
         //console.log(betDateMonth)
         //console.log(todayDateMonth)
         if(todayDateMonth>betDateMonth){
           isPassed = true
         }else if(todayDateMonth===betDateMonth){
           let betDateDay = parseInt(betDate.substr(betDate.length-10, betDate.length-6))
           let todayDateDay = parseInt(todayDate.substr(todayDate.length-10, todayDate.length-6))
           //console.log(betDateDay)
           //console.log(todayDateDay)
           if(todayDateDay>betDateDay){
             isPassed = true
           }
         }
       }
     }
     return isPassed
   }



  onClick = () => {

    console.log(this.state)
    let betWithPlayersInfo={};
    const returnedTarget = Object.assign(betWithPlayersInfo, this.props.bet);
    betWithPlayersInfo.playersDetail = {}
    betWithPlayersInfo.playersDetail.players1 = this.props.bet.players1
    betWithPlayersInfo.playersDetail.players2 = this.props.bet.players2
    betWithPlayersInfo.playersDetail.witness = this.props.bet.witness[0]
    this.props.setBetSelected(betWithPlayersInfo)
    this.props.setSheet()
      //console.log(betWithPlayersInfo)

  }

  displayWinOrLoose = () => {
    if(this.state.iWon && !this.state.imTheWitness){
      return(
        <div style={{position:"absolute", width:20, height:20, top:30, right:20, backgroundImage:"url("+ require('../assets/images/won.png') +")", backgroundSize:"cover"}}>
        </div>
      )
    }else if(!this.state.iWon && !this.state.imTheWitness){
      return(
        <div style={{position:"absolute", width:20, height:20, top:30, right:20, backgroundImage:"url("+ require('../assets/images/lost.png') +")", backgroundSize:"cover"}}>
        </div>
      )
    }else{
      return(
        <div style={{position:"absolute", width:30, height:30, top:25, right:10, backgroundImage:"url("+ require('../assets/images/right.png') +")", backgroundSize:"cover"}}>
        </div>
      )
    }
  }




  render(){

    if(this.props.bet.players1 === undefined || this.props.bet.players2 === undefined){
      return(
        <div className="BetItem">
          <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Spinner animation="border" />
          </div>
        </div>
      )
    }else{
      if(this.props.bet.players1[0].user === undefined || !this.props.bet.players2[0].user === undefined){
        return(
          <div className="BetItem">
            <div style={{width:"10%", height:"10%", display:"flex", justifyContent:"center", alignItems:"center"}}>
              <Spinner animation="border" />
            </div>
          </div>
        )
      }else{
        return(
          <div className="BetItem" style={{backgroundColor:this.props.bet.current?"white":"rgba(250,250,250,1)"}} onClick={()=>this.onClick()}>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start",alignItem:"center",textAlign:"center", paddingTop:10, paddingBottom:10}}>
              <div style={{width:70, height:70, position:"relative"}}>
                {this.props.bet.players1.length>0 ?
                    <img width={50} height={50} src={this.props.bet.players1[0].user.imageProfil} style={{position:"absolute", top:0, left:0, cursor:"pointer", borderWidth:0, borderStyle:"solid", borderRadius:"50%"}}/>
                    :
                    <div style={{width:50, height:50, backgroundColor:"red"}}>
                    </div>
                }
                {this.props.bet.players2.length>0 ?
                    <img width={50} height={50} src={this.props.bet.players2[0].user.imageProfil} style={{position:"absolute", top:20, left:20, cursor:"pointer", borderWidth:0, borderStyle:"solid", borderRadius:"50%"}}/>
                    :
                    <div style={{width:50, height:50, backgroundColor:"red"}}>
                    </div>
                }
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", marginLeft:20,}}>
                <div style={{fontSize:13, color:this.props.bet.current?"black":"rgba(187,187,187,1)"}}>{this.props.bet.title}</div>
                <div style={{fontSize:12, color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>{this.props.bet.issue}</div>
                <div style={{fontSize:10, color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>{"create : " + this.props.bet.creation}</div>
                <div style={{fontSize:10, color:this.props.bet.current?"rgba(150,150,150,1)":"rgba(210,210,210,1)"}}>{"expiration : " + this.props.bet.expiration}</div>
              </div>

              {this.props.bet.current?
                <div style={{position:"absolute", width:30, height:30, top:25, right:10, backgroundImage:"url("+ require('../assets/images/right.png') +")", backgroundSize:"cover"}}>
                </div>
                :
                this.displayWinOrLoose()
              }
              </div>
            <div style={{width:"100%", height:1, backgroundColor:"rgba(150,150,150,1)"}}>
            </div>

          </div>
        )
      }

    }
  }
}

const mapStateToProps = (state) => {
  return {
    accountState:state.account.accountStateRedux,
    sheetSelected:state.helper.sheetSelected,
  }
}

const BetItem = connect(mapStateToProps, mapDispatchToProps)(BetItemComponent);
export default BetItem;
