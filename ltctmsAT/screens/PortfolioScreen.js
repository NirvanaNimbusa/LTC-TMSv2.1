/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                             */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  PortfolioScreen.js                                                                */
/* Purpose: Displays Patient information and allows user to navigate to add daily status or check daily status screen */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Picker,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Button, ThemeProvider, Icon } from 'react-native-elements';

import styles from '../styles/styles';

class PortfolioScreen extends React.Component {
  static navigationOptions = {
    title: 'Portfolio',
  };
  constructor() {
    super();
    this.state = {
      patientList: [],
      patient: '',
      patientPic: '',
      position: 'sadf',
      userID: 'afsdaasfd',
      buttonArray: [],
      user_position:'',
    };
  }
  
  
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
  }
 
  // This pulls the current logged in users data that was saved in asyncstorage into state

  async componentWillMount() {
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
      this.state.address = data.Address;
      this.state.name = data.Name;
      this.state.room = data.patientRoomNo;
      this.state.nationality = data.Nationality;
      this.state.nationalID = data.NationalID;
      this.state.gender = data.Gender;
      this.state.description = data.BriefDescription;
      this.state.DOB = data.DOB;
      this.state.email = data.Email;
      this.state.admissionReason = data.AdmissionReason;
      this.state.medicalRecord = data.MedicalRecord;

      this.forceUpdate();
    })

    await this._fetchUserInfo();
    this._fetchPatients();
  }

  /* rip dreams...
  forceUpdateHandler(){
    firebase.database().ref(`/Patient/${this.state.patient}/`).once('value').then((snapshot) => {
      const data = snapshot.toJSON();
    this.setState({patientPic: data.Portfolio.Name})
    this.forceUpdate();
    });
  <Text style={{color:'black', fontSize: 15,fontWeight: 'bold',paddingTop:5}}>{this.state.patientPic}</Text> 
  };
  */


  // render content
  render() {
    return (
      <View style={styles2.container}>
        <ScrollView style={styles2.container}>
        <View>
            <Text style={styles2.headerText}>Patient Status</Text>
            <Text style={styles2.text}>Select Patient:</Text>
            <Picker

              mode='anchor'
              style={styles2.picker, {color:'black'}}
              selectedValue={this.state.patient}
              onValueChange={(itemValue, itemIndex) => {this.setState({ patient: itemValue, isLoading:true})}}
            >
              <Picker.Item label="Select Patient" value="patient"/>
              {this.state.patientList.map((item, index) => {
                return (<Picker.Item label={item.id} value={item.id} key={index}/>)
              })}
            </Picker>
          </View>
          {(this.state.position == "CNA") ? 
          <View>
                    <Button title="Add Daily Status" type='outline' onPress={this._showDailyStatusAdd} style="padding: 5" />
                    <Button title="Check Daily Status" type='outline' onPress={this._showDailyStatusRead} style="padding: 5" />
                    <Button title="Check AI Status" type='outline' onPress={this._showAiStatusRead} style="padding: 5" />
                    <Button title="Check Vital Status" type='outline' onPress={this._showVitalStatusRead} style="padding: 5" />
          <Button title="Add Vital Status" type='outline' onPress={this._showVitalStatusAdd} style="padding: 5" />
          </View>
          : 
          <View>
          <Button title="Check Daily Status" type='outline' onPress={this._showDailyStatusRead} style="padding: 5" />
                    <Button title="Check AI Status" type='outline' onPress={this._showAiStatusRead} style="padding: 5" />
                    <Button title="Check Vital Status" type='outline' onPress={this._showVitalStatusRead} style="padding: 5" />
          </View>
          }
        </ScrollView>
        
      </View>
    );
  }

  // handler to navigate to the Portfolio page
  _showDailyStatusRead = () => {
    this.props.navigation.navigate('DailyStatusRead');
  };

  _showDailyStatusAdd = () => {
    this.props.navigation.navigate('DailyStatusAdd',{patientID:this.state.patient})
    
  }

  _showAiStatusRead = () => {
    this.props.navigation.navigate('AiStatusRead');
  }

  _showVitalStatusRead = () => {
    this.props.navigation.navigate('VitalStatusRead');
  }

  _showVitalStatusAdd = () => {

    this.props.navigation.navigate('VitalStatusAdd');
  }
  _fetchPatients() {
    // fetch content
    const patientData = [];
    firebase.database().ref('Patient').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientData.push({
          id: childSnapshot.key,
        })
      })
      this.setState({
        patientList: patientData,
        patient: patientData[0].id
      });
    });
  }

  // signout user by deleting locally stored user info and navigate back to sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#e6f3ff',
    flex: 1,
    padding: 20,
    marginTop: 1,
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left', /*select week*/
  },
  /*
  item: {
    padding: 4,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  announce: {
    padding: 1,
    fontSize: 14,
    flex: 1,
    justifyContent: 'space-evenly'
  },
  header: {
    padding: 10
  },

  */
});


export default PortfolioScreen;