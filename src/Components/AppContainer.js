import React, { Component } from 'react';
import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { bounceInDown } from 'react-animations';
import styled, { keyframes } from 'styled-components';

import PrincipalMenu from './PrincipalMenu'
import BetMake from './ContainerMakeBet';
import ContainerBets from './ContainerBets';
import MyAccountContainer from './ContainerAccount';
import FriendsContainer from './ContainerFriends';
import JudgeContainer from './ContainerJudge';

import API from '../utils/API';

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (article) => dispatch(changeAccountState(article)),
    accountStateRedux:dispatch.accountStateRedux,
    sheetSelected:dispatch.sheetSelected,
  };
};

class AppContainerComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      betsMade : [],
      betsWitnessOf : [],
     }
  }



  componentDidMount = async () => {
    let betsMade = this.props.accountState.bets
    for(var i=0;i<betsMade.length;i++){
      this.getBetsInfo(betsMade[i], i).then(([bet, i])=>{
        let betMadeState = this.state.betsMade.slice();
        betMadeState[i] = bet
        this.setState({betsMade:betMadeState})
      })
    }

    let betsWitnessOf = this.props.accountState.witnessOf
    for(var i=0;i<betsWitnessOf.length;i++){
      this.getBetsInfo(betsWitnessOf[i], i).then(([bet, i])=>{
        console.log(bet)
        let betsWitnessOfState = this.state.betsWitnessOf.slice();
        betsWitnessOfState[i] = bet
        console.log(i)
        this.setState({betsWitnessOf:betsWitnessOfState})
      })
    }
  }

  getBetsInfo = async (bet, i) => {
    if(bet !== undefined){
      bet.players1 = await this.getFriendsWithTabId(bet.players1)
      bet.players2 = await this.getFriendsWithTabId(bet.players2)
      bet.witness = await this.getFriendsWithTabId([bet.witness])
    }
    //console.log(bet)
    return [bet, i]
  }

  getFriendsWithTabId = async (tabOfFriendID) => {
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
            }
          }
        }

        if(copiedTabOfFriendID.length>0){
          return await API.getUsersDataByID(copiedTabOfFriendID.map((friendObject)=>(friendObject.id))).then((data)=>{
            var tabWithAccepted = []
            for (var i = 0; i < data.data.usersData.length; i++) {
              if(copiedTabOfFriendID[i] !== undefined){
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:copiedTabOfFriendID[i].accepted}
              }else{
                tabWithAccepted[i]={user:data.data.usersData[i], accepted:undefined}
              }
            }
            var newFullTab = newTabOfFriendID.concat(tabWithAccepted);
            return newFullTab;
          });
        }else{
            return newTabOfFriendID;
        }

  }

  render(){

    return(
      <div style={{height:"100%"}}>
          <div onClick={this.pushBet}>
            <PrincipalMenu setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}/>
            {this.props.ongletselected === "judge" ?
              <JudgeContainer bets={this.state.betsWitnessOf}/>
              :null
            }
            {this.props.ongletselected === "my bets" ?
              <ContainerBets setOnglet={this.props.setOnglet} bets={this.state.betsMade}/>
              :null
            }
            {this.props.ongletselected === "friends" ?
              <FriendsContainer/>
              :null
            }
            {this.props.ongletselected === "my account" ?
              <MyAccountContainer logout={this.props.logout}/>
              :null
            }
            {this.props.ongletselected === "bet on" ?
              <BetMake setOnglet={this.props.setOnglet}/>
              :null
            }
          </div>
      </div>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
      displayLoading:state.helper.displayLoadingRedux,
      accountState:state.account.accountStateRedux,
      sheetSelectedRedux:state.helper.sheetSelected,

    }
  }

  const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerComponent);
  export default AppContainer;
