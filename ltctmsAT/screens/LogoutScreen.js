/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:                                                                                    */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React ,{Component}from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerNavigator, DrawerItems} from 'react-navigation'
import firebase from 'react-native-firebase';
import { Button, ThemeProvider } from 'react-native-elements';
import styles from '../styles/styles';
import{Icon,Container,Header,Content,Left} from'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
 
class LogoutScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userInfo: '',
      position: 'sadf',
      userID: 'afsdaasfd',
    };

  }

/*************************************************************************/
  /* */
  /* Function name: _fetchUserInfo */
  /* Description: Fetch the user info from database and pass it to userInfo */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });

  }
/*************************************************************************/
  /* */
  /* Function name: componentWillMount */
  /* Description: call _fetchUserInfo function before render() */
  /* Parameters: none */
  /* Return Value: none */
  /* */
  /*************************************************************************/
  async componentWillMount() {
    await this._fetchUserInfo();
  }

  componentWillMount() {
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
  }

  static navigationOptions=({navigation,screenProps}) => {
    
    const { params ={} }= navigation.state;
    const headerRight = ( 
      <TouchableOpacity onPress={()=>navigation.state.params.navigatePress()}>
        <Text style={styles.itemPortfolio}>Logout</Text>
      </TouchableOpacity>
    );
    return { title: navigation.getParam('otherParam', 'UserPortfolio') ,
      headerRight,
      
      };
  };

  LogoutButton=()=>{
    Alert.alert('Log out','Are you sure?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
      {text: 'OK', onPress: () => this._logout ()},
    ],
    )
  }

  componentDidMount(){
    this.props.navigation.setParams({navigatePress:this.LogoutButton});
  }
  _logout (){
    AsyncStorage.removeItem('userInfo');
    this.props.navigation.navigate('Auth');
  }
 
  render() {
    const user = this.state.userInfo;
    return (
      <View style={styles.container}>
         <ScrollView style={styles2.container}>
          <Text style={styles.itemPortfolio}>Name: {this.state.name}</Text>
          <Text style={styles.itemPortfolio}>User ID: {this.state.userID}</Text>
          <Text style={styles.itemPortfolio}>Position: {this.state.position}</Text>
          <Text style={styles.itemPortfolio}>Address: {this.state.address}</Text>
          <Text style={styles.itemPortfolio}>Room #: {this.state.room}</Text>
          <Text style={styles.itemPortfolio}>Nationality: {this.state.nationality}</Text>
          <Text style={styles.itemPortfolio}>National ID: {this.state.nationalID}</Text>
          <Text style={styles.itemPortfolio}>Gender: {this.state.gender}</Text>
          <Text style={styles.itemPortfolio}>Brief Description: {this.state.description}</Text>
          <Text style={styles.itemPortfolio}>Date of Birth: {this.state.DOB}</Text>
          <Text style={styles.itemPortfolio}>E-mail Address: {this.state.email}</Text>
          <Text style={styles.itemPortfolio}>Admission Reason: {this.state.admissionReason}</Text>
          <Text style={styles.itemPortfolio}>Medical Records: {this.state.medicalRecord}</Text>
          </ScrollView>
        </View>
 
    );
  }
  // handler to clear the locally stored user info (logout) and navigate to the
  // sign in screen
}


const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#e6f3ff',
    flex: 1,
    padding: 20,
    marginTop: 15,
  },

});


export default LogoutScreen 