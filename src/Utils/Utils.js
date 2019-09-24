import React, { Component } from 'react';
import API from '../utils/API';

export default {
    displayMark : (mark, width) => {
      switch(Math.floor(mark*2)/2) {
        case 5 :
          return <img source={require('../assets/images/stars5.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 4.5 :
          return <img source={require('../assets/images/stars45.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 4 :
          return <img source={require('../assets/images/stars4.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 3.5 :
          return <img source={require('../assets/images/stars35.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 3:
          return <img source={require('../assets/images/stars3.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 2.5 :
          return <img source={require('../assets/images/stars25.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 2 :
          return <img source={require('../assets/images/stars2.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 1.5 :
          return <img source={require('../assets/images/stars15.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 1 :
          return <img source={require('../assets/images/stars1.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 0.5 :
          return <img source={require('../assets/images/stars05.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        case 0 :
          return <img source={require('../assets/images/stars0.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
        default:
          return <img source={require('../assets/images/stars0.png')} style={{borderRadius:75, width:width, height:width/6}}/>;
      }
    },

    dateToString : (date) => {
      let dd = String(date.getDate()).padStart(2, '0');
      let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = date.getFullYear();
      date = dd + '/' + mm + '/' + yyyy;
      return date
    },

    loginAlreadyConnected : (email, onglet, context) => {
      context.setState({displayLoading:true})
      API.getUserDataByEmail(email).then((dataCurrentUser)=>{
        console.log(dataCurrentUser)
        if(dataCurrentUser.status != 200 ){
          context.setState({
            impossibleToConnect : true,
            messageError: "sorry we did not find you account, check your connexion",
            displayLoading:false,
          })
        }
        context.props.changeAccountState(dataCurrentUser.data.userData);
        API.getUsersDataByID(dataCurrentUser.data.userData.friends).then((dataFriends)=>{
          context.props.getUserFriends(dataFriends.data.usersData);
          API.getBetsDataByID(dataCurrentUser.data.userData.bets.map((bet)=>(bet.id))).then((dataBets)=>{
            context.props.getUserBets(dataBets.data.bets);
            API.getBetsDataByID(dataCurrentUser.data.userData.witnessOf).then((dataWitnessOf)=>{
              context.props.getUserWitnessOf(dataWitnessOf.data.bets);
              context.setState({
                displayLoading:false,
                onglet : onglet,
                connected:true,
                email:email,
              })
              localStorage.setItem("connected" , true)
              localStorage.setItem("email" , email)
            });
          });
        });
      }).catch(error => {
        context.setState({
          impossibleToConnect : true,
          messageError: "the server can not be reached. Please, check your connexion !",
          displayLoading:false,
        })
      });
    }
}

var showAlert = (errorMessage) => {
  console.log(errorMessage)
}
