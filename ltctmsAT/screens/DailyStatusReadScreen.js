/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  DailyStatusReadScreen.js                                                          */
/* Purpose: User is able to select the date and view patients daily status                      */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Alert,
  ScrollView,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/styles';
import { Text } from 'native-base';
import { Button } from 'react-native-elements';
import PortfolioScreen from '../screens/PortfolioScreen';
import selectedValue from '../screens/PortfolioScreen';
class DailyStatusReadScreen extends React.Component {
  static navigationOptions = {
    title: 'Daily Status Read',
  };

  constructor() {
    super();

    const now = new Date();

    this.state = {
      patientList: [],
      patient: '',
      poop: '',
      urinate: '',
      shower:'',
      ate:'',
      brushTeeth:'',
      today: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      status: [],
      userID: '',
      position: ''
    };
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }

  // This pulls the current logged in users data that was saved in asyncstorage into state
  // begin fetching content (patients) before the component actually mounts
  componentWillMount() {
    this._fetchPatients();
    AsyncStorage.getItem("userInfo").then((value) => {
      const data = JSON.parse(value);
      this.state.userID = data.ID;
      this.state.position = data.Position;
    })
  }

  // render content
  // consists of one picker container to choose patient, with several picker items 
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles2.container}>
          <Text style={styles.item}>Select Date to View Daily Status</Text>
          <View style={styles.pickerView}>
            <DatePicker
              style={styles.pickerStyle}
              date={this.state.date}
              mode="date"
              placeholder="Select Date"
              format="YYYY-M-DD"
              minDate="2018-1-01"
              maxDate={this.state.today}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
          </View>
          <View>
            <Button
              onPress={this._fetchStatus}
              title="Submit"
              type="outline"
              style={{ padding: 10 }}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.item}>Patient Daily Status</Text>
            <Text style={styles.item}>Shower: {this.state.shower}</Text>
            <Text style={styles.item}>Ate: {this.state.ate}</Text>
            <Text style={styles.item}>Poop: {this.state.poop}</Text>
            <Text style={styles.item}>Urinate: {this.state.urinate}</Text>
            <Text style={styles.item}>Brush Teeth: {this.state.brushTeeth}</Text>
            <Text></Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  _fetchStatus = () => {
    patient = ""
    if (this.state.position == "Patient") {
      patient = this.state.userID;
    } else {
      patient = this.state.patient;
    }
    const patientStatus = [];
    console.log("Patient : ", this.state.patient);
    firebase.database().ref(`Activities/${this.props.navigation.getParam('patientID','0')}/${this.state.date}/DailyStatuses/`).once('value').then((snapshot) => {
      var status = snapshot.toJSON();
      var shower = status.shower;
      var ate = status.ate;
      var poop = status.poop;
      var urinate = status.urinate;
      var brushTeeth = status.brushTeeth;

      this.setState({
        shower,
        ate,
        poop,
        urinate,
        brushTeeth,
      })
    }).catch((err) => {
      Alert.alert('Unable to find data for the specified date and patient combination. Please try another one.');
    });
    this.forceUpdate();
  }


  //       console.log("this.state.status dump")
  //       console.log(this.state.status)
  //       this.forceUpdate();
  //     });
  //     this.forceUpdate();
  //   }

  // fetch content (patients)
  _fetchPatients() {
    // fetch content
    const patientData = [];
    const patients = firebase.database().ref('Patient');
    patients.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        patientData.push({
          id: childSnapshot.key,
        })
      })
      console.log("patientData.id")
      console.log(patientData)
      this.setState({
        patientList: patientData,
        patient: patientData.id
      })
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
    flex: 1,
    padding: 20,
    marginTop: 15,
  },
  item: {
    padding: 4,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1
  },
  picker: {
    color: 'black',
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
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontWeight: 'bold',
  }
});



export default DailyStatusReadScreen;