import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";


import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
  return {
    changeAccountState: (article) => dispatch(changeAccountState(article)),
    accountStateRedux:dispatch.accountStateRedux,
  };
};


class ItemEditProfileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value,
    };
  }





  onChange = (e) => {
    this.props.onChange(this.props.keyForState, e.target.value)
    this.setState({
      value : e.target.value
    })
  }

  render(){

    return(
      <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", marginLeft:20,width:"100%"}}>
        <strong style={{width: "100%", textAlign:"left", fontSize:13}}>{this.props.placeHolder}</strong>
        <div style={{width: "100%", display: 'flex', flexDirection: 'column', alignItems:"left", marginBottom:10, marginTop:5, fontSize:15, justifyContent:"flex-start", marginLeft:0, marginRight:0, paddingRight:20}}>
          {this.props.changePossible ?
            <input type="text" style={{ height:30*this.props.heightSize, textAlign:"left", display: 'flex', flexDirection: 'column', justifyContent:"center", borderRadius:3,  color:"rgba(130,130,130,1)", borderWidth:1, borderStyle:"solid", borderColor:"rgba(100,100,100,1)",width:"100%", backgroundColor:"rgba(245,245,245,1)", paddingLeft:10}} value={this.state.value} onChange={(e) => this.onChange(e)}/>
            :
            <div  style={{width:"100%", height:30*this.props.heightSize, textAlign:"left", display: 'flex', flexDirection: 'column', justifyContent:"center", borderRadius:3,  color:"black", borderWidth:0, borderStyle:"solid", borderColor:"rgba(150,150,150,1)",width:"100%", backgroundColor:"rgba(235,235,235,1)", paddingLeft:10}}>{this.props.value}
            </div>
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

const ItemEditProfile = connect(mapStateToProps, mapDispatchToProps)(ItemEditProfileComponent);
export default ItemEditProfile;
