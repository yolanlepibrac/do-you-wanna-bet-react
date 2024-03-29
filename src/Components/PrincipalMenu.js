
import React, { Component } from 'react';
import '../App.css';
import { connect } from "react-redux";

import PrincipalMenuBouton from './PrincipalMenuBouton';

const sizeIconMobile = 35;
function mapDispatchToProps(dispatch) {
  return {
    sheetSelected:dispatch.sheetSelected,
  };
};

class PrincipalMenuComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
     }
  }

  render(){
    return(
      <div className="PrincipalMenu">
        <div style={{width:"100%", height:50, display:"flex", flexDirection:'row', justifyContent:"space-around",alignItems:"center", fontSize:12, marginTop:0}}>
              <PrincipalMenuBouton nameSheet={"bet on"} backgroundImage={"url("+ require('../assets/images/betOn.png') +")"} backgroundImageSelect={"url("+ require('../assets/images/betOnSelect.png') +")"} setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}>
              </PrincipalMenuBouton>
              <PrincipalMenuBouton nameSheet={"my bets"} backgroundImage={"url("+ require('../assets/images/myBets.png') +")"} backgroundImageSelect={"url("+ require('../assets/images/myBetsSelect.png') +")"} setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}>
              </PrincipalMenuBouton>
              <PrincipalMenuBouton nameSheet={"judge"} backgroundImage={"url("+ require('../assets/images/judge.png') +")"} backgroundImageSelect={"url("+ require('../assets/images/judgeSelect.png') +")"} setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}>
              </PrincipalMenuBouton>
              <PrincipalMenuBouton nameSheet={"friends"} backgroundImage={"url("+ require('../assets/images/friends.png') +")"} backgroundImageSelect={"url("+ require('../assets/images/friendsSelect.png') +")"} setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}>
              </PrincipalMenuBouton>
              <PrincipalMenuBouton nameSheet={"my account"} backgroundImage={"url("+ require('../assets/images/myAccount.png') +")"} backgroundImageSelect={"url("+ require('../assets/images/myAccountSelect.png') +")"} setOnglet={this.props.setOnglet} ongletselected={this.props.ongletselected}>
              </PrincipalMenuBouton>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sheetSelected:state.helper.sheetSelected,
  }
}

const PrincipalMenu = connect(mapStateToProps, mapDispatchToProps)(PrincipalMenuComponent);
export default PrincipalMenu;
