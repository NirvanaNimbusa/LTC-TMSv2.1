/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename:  PortfolioScreen.js                                                                                  */
/* Purpose: CNA is able to update patients' daily status and submit information to the database.  */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  Picker,
  Switch,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from 'native-base';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/styles';
import {Collapse, CollapseHeader, CollapseBody,AccordionList} from "accordion-collapse-react-native";
import { Thumbnail } from 'native-base';
import Checkbox from 'react-native-modest-checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class DailyStatusAddScreen extends React.Component {
  static navigationOptions = {
    title: 'Daily Status Add',
  };

  constructor() {
    super();

    var now = new Date();

    this.state = {
      patientList: [],
      patient: '',
      ateAM: false,
      atePM: false,
      poop: '',
      urinate: '',
      shower:'',
      ate:'',
      brushTeeth:'',
      userInfo: null,
      today: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      checked: {}, 
    };
  }

  async _fetchUserInfo() {
    const userInfo = await AsyncStorage.getItem("userInfo");
    this.setState({
      userInfo: JSON.parse(userInfo)
    });
  }

  async componentWillMount() {
    await this._fetchUserInfo();
    this._fetchPatients();
  }

  updatePatient = (patient) => {
    this.setState({ patient: patient })
  }


 
  checkBoxChanged(id, value) {

    this.setState({
      checkBoxChecked: tempCheckValues
    })

    var tempCheckBoxChecked = this.state.checkBoxChecked;
    tempCheckBoxChecked[id] = !value;

    this.setState({
      checkBoxChecked: tempCheckBoxChecked
    })

  }

  

  // render content
  // consists of one picker container to choose patient, with several picker items
  // then a date picker for choosing the date to retrieve data from
  // a button is used to trigger data retrieval, and text elements to present the data
  render() {
    
    
    return (
      <KeyboardAvoidingView behavior='position' style={{backgroundColor:'#e6f3ff', flex:1}}>
      <View style={{backgroundColor:'#e6f3ff'}}>
        <ScrollView >
          <View style={{ paddingTop: 0 }}>
            <Collapse style={{borderBottomWidth:0,borderTopWidth:1}}>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center',padding:6,backgroundColor:'#78B0FA'}}>
              <View style={{width:'30%',alignItems:'center'}}>
                <Icon 
                name='shower'
                size= {40}/>
                
              </View>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Shower</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(shower) => this.setState({ shower })}
                      value={this.state.shower}
                    />             
                  </View>
              </CollapseBody>
            </Collapse>
          </View>
          

          <View style={{ paddingTop: 0}}>
          <Collapse style={{borderBottomWidth:0,borderTopWidth:1}}>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center',padding:6,backgroundColor:'#A9D3FF'}}>
              <View style={{width:'30%',alignItems:'center'}}>
              <MaterialCommunityIcons 
                name='food-variant'
                size= {40}/>
              </View>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Ate</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(ate) => this.setState({ ate })}
                      value={this.state.ate}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>

          <View style={{ paddingTop: 0 }}>
          <Collapse style={{borderBottomWidth:0,borderTopWidth:1}}>
              <CollapseHeader style={{flexDirection:'row',alignItems:'center',padding:6,backgroundColor:'#78B0FA'}}>
              <View style={{width:'30%',alignItems:'center'}}>
                <Icon
                name='check-circle'
                size= {40}/>
              </View>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Brush Teeth</Text>
                  </View>
             </CollapseHeader>
              <CollapseBody style={{alignItems:'center',justifyContent:'center',padding:4}}>
                  <View style={{ paddingTop: 10, alignItems:'center' }}>
                  <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(brushTeeth) => this.setState({ brushTeeth })}
                      value={this.state.brushTeeth}
                    />     
                  </View>
              </CollapseBody>
            </Collapse>
          </View>

          <View style={{ paddingTop: 0 }}>
          <Collapse style={{borderBottomWidth:0,borderTopWidth:1}}>
            <CollapseHeader style={{flexDirection:'row',alignItems:'center',padding:6,backgroundColor:'#A9D3FF'}}>
              <View style={{width:'30%',alignItems:'center'}}>
              <MaterialCommunityIcons 
                name='emoticon-poop'
                size= {40}/>
              </View>
              <View style={{ paddingTop: 10 }}>
                 <Text style={styles.statusToggle}>Poop Time</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',flexDirection:'row',padding:4}}>
              
              <Collapse style={{flexDirection:'row'}}>
                <CollapseHeader>
                <View style={{ paddingTop: 10, alignItems:'center' }}> 
              
                    <TextInput
                    placeholder="Enter Time (format example 13:00)"
                    placeholderTextColor='black'
                    style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                   onChangeText={(poop) => this.setState({ poop })}
                   value={this.state.poop}
                 />
                  </View>
                </CollapseHeader>
              </Collapse>
            </CollapseBody>
          </Collapse>
            
            
          </View>

          <View style={{ paddingTop: 0}}>
          <Collapse style={{borderBottomWidth:1,borderTopWidth:1}}>
            <CollapseHeader style={{flexDirection:'row',alignItems:'center',padding:6,backgroundColor:'#78B0FA'}}>
              <View style={{width:'30%',alignItems:'center'}}>
              <Icon
                name='check-circle-o'
                size= {40}/>
              </View>
              <View style={{ paddingTop: 10 }}>
                    <Text style={styles.statusToggle}>Urinate Time</Text>
              </View>
            </CollapseHeader>
            <CollapseBody style={{alignItems:'center',justifyContent:'center',flexDirection:'row',padding:4}}>
              
              <Collapse style={{flexDirection:'row'}}>
                <CollapseHeader>
                <View style={{ paddingTop: 10, alignItems:'center' }}>
                    
                    <TextInput
                      placeholder="Enter Time (format example 13:50)"
                      placeholderTextColor='black'
                      style={{ height: 40, width: 300, borderColor: '#A1D3D1', borderWidth: 4, color:'black' }}
                      onChangeText={(urinate) => this.setState({ urinate })}
                      value={this.state.urinate}
                    />
                  </View>
                </CollapseHeader>
              </Collapse>
            </CollapseBody>
          </Collapse>
       
          </View>
        
          <View style={{marginTop: 10, marginHorizontal: 50, alignSelf: 'auto', flex: 1, justifyContent: 'space-between', fontSize: '10'}}>
            <Button
              onPress={this._submitDailyStatus}
              title="Submit"
              type="solid"
            />
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    )

  }

  // fetch content (patients)
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

  _submitDailyStatus = async () => {
    const baseRef = `Activities/${this.state.patient}/${this.state.today}/DailyStatuses/`;
    const ref = firebase.database().ref(baseRef);
    const user = this.state.userInfo;
    const now = new Date();

    await ref.update({
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      submittedBy: user.ID,
      shower: this.state.shower,
      ate:this.state.ate,
      brushTeeth:this.state.brushTeeth,
      poop: this.state.poop,
      urinate: this.state.urinate
    });

    Alert.alert('Daily Status Add', 'Successful!');
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
    marginTop: 15,
  },
  picker: {
    color: 'black',
    fontWeight: 'bold',
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
  headerText: {
    textAlign: 'center',
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontWeight: 'bold',
  }
  */
});



export default DailyStatusAddScreen;