/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: April 12, 2019                                                             */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: HomeScreen.js                                                                                    */
/* Purpose: Displays Announcement list. Home screen for application.                          */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
<<<<<<< HEAD
  Button,
  Alert
=======
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
>>>>>>> origin/master
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import {Text, TextInput} from 'native-base';
//import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/styles';
import AnnouncementList from '../components/AnnouncementList';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props) {
    super(props);
    global.announcementBuilder = [];
    this.state = {
      announcements: [],
      
    }
  }

  // begin fetching content (announcements) before the component actually mounts
  componentWillMount() {
    this._fetchAnnouncements();
  }

    // handler for rendering the header for the FlatList UI component in use
  renderHeader() {
    return (
      <View>
        <Text style={styles.headerText}>This is Announcements</Text>
      </View>
    )
  }
  // fetch content (announcements)
  _fetchAnnouncements() {
    // container to convert the DataSnapshot returned by FireBase into an easily
    // traversible array

    // fetch content
    const announcements = firebase.database().ref('Announcements');
    announcements.once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // push each announcement onto array

        // TODO: define limit for number of announcements fetched and display in
        // DESC order by date
        const child = childSnapshot.val();
        child.collapsed = true;
        announcementBuilder.push(child);
      });
    }).finally(() => {
      this.setState({
        // set state to the array declared above - if successful, array will have content
        // otherwise will default to an empty array and nothing will be displayed
        announcements: announcementBuilder
      });
      // force the component to update with new content
      //this.forceUpdate();
      console.log(announcementBuilder[0].AnnouncementIOS);
    });
  }
    // render content
  render() {
    return (
<<<<<<< HEAD
      <View style ={{flex: 6, backgroundColor: '#a1c7ff'}}>
        <AnnouncementList /> 
=======
      <View>
        <FlatList
          data={this.state.announcements}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item) => item.a_id}
          renderItem={this._renderItem}
          scrollEnabled={false}
          //ListHeaderComponent={this.renderHeader}
          //extraData={this.state}
        />
      </View>
    );
  }
  _renderItem = () => {
    return (
      <View style ={styles.basicView} >
          <ImageBackground style={{ flex: 1 }}
          source={{uri: 'https://i.ibb.co/dMgXdR8/DSC-8578.jpg'}}
          opacity={0.5}>

        <Content padder >   
        
            <CardItem style={{marginHorizontal: 21}} >
              <Left>              
                <Body>
                  <Text>Announcement</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>        
              
              <Swiper
                  autoplay={true}   
                  autoplayTimeout={5}    
                  height={530}
                  horizontal={true}
                  paginationStyle={{bottom: 5}}
                  showsButtons={false} >
                        <View>                         
                        <Image source={{uri: 'https://i.ibb.co/dMgXdR8/DSC-8578.jpg'}} style={styles2.image}/>                             
                          <View style={{marginTop:50}}>             
                                <Text style={styles2.headertext}>{announcementBuilder[0].ATitleIOS}</Text>                 
                                <Text style = {{textAlign: 'center'}}>
                                {announcementBuilder[0].AnnouncementIOS}
                                </Text>
                            </View>                                   
                        </View>   
                        <View>
                          <Image source={{uri: 'https://i.ibb.co/G0hmyZf/DSC-8575.jpg'}} style={styles2.image}/> 
                          <View style={{marginTop:50}}>
                            <Text style={styles2.headertext}>{announcementBuilder[1].ATitleIOS}</Text>                 
                                <Text style = {{textAlign: 'center'}}>
                                {announcementBuilder[1].AnnouncementIOS}
                                </Text>
                            </View>                        
                        </View>   

                        <View>
                          <Image source={{uri: 'https://i.ibb.co/T24htTx/DSC-8589.jpg'}} style={styles2.image}/> 
                          <View style={{marginTop:50}}>
                            <Text style={styles2.headertext}>{announcementBuilder[2].ATitleIOS}</Text>                 
                                <Text style = {{textAlign: 'center'}}>
                                {announcementBuilder[2].AnnouncementIOS}
                                </Text>
                            </View>                        
                          </View>               
                    </Swiper>
                                    
        </Content>

        <View style={{paddingBottom:500}}> 
        
        </View> 
        </ImageBackground >
>>>>>>> origin/master
      </View>
    );
  }

// Button for Logout will be moved to bottom navigation bar 
//<Button title="Logout" type='outline' onPress={this._signOutAsync} />

// handler to navigate to the Portfolio page
  _showPortfolio = () => {
    this.props.navigation.navigate('Portfolio');
  };

  // handler to navigate to the center schedule page
  _showCenterSchedule = () => {
    this.props.navigation.navigate('CenterSchedule');
  }

  // handler to clear the locally stored user info (logout) and navigate to the
  // sign in screen
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

<<<<<<< HEAD
=======
const styles2 = StyleSheet.create({
  mb15: {
    marginBottom: 15,
    paddingHorizontal:20,
    alignSelf:'flex-end',
   
   
  },
  headertext:{  
    fontSize: scale(25),
    textAlign: 'center',
    justifyContent: 'space-evenly', 
    fontWeight: "bold",
    color: 'black',
             
  },
  image:{
    alignSelf: "center",
    height: 300,
    resizeMode: "cover",
    width: deviceWidth / 1.2,
    marginVertical: -20

  },
  mb: {
    marginBottom: 15
  }
})


>>>>>>> origin/master
export default HomeScreen;