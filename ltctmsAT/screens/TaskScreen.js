/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: TaskScreen.js                                                                      */
/* Last Edited By:                                                                              */
/* /*********************************************************************************************/
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
<<<<<<< HEAD
  Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Container, Header, Title, Content, List, Icon, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left } from 'native-base'
=======
  Dimensions,
  Image,
  Linking,
  
  
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import {  Text,Content,Container, Header,  Icon, Item, Input} from 'native-base'
>>>>>>> origin/master
import firebase from 'react-native-firebase';
import styles from '../styles/styles';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import { SearchBar, Button } from 'react-native-elements';


class TaskScreen extends React.Component {
  static navigationOptions = {
    title: 'Task Library',
  };

  state = {
    userInfo: {},
    tasks: [],
    catList: [],
    fixedTasks: [],
    refreshing: false
  };

  constructor(props) {
    super(props);
    //setting default state
    this.arrayholder = [];
  }



  async componentWillMount() {
    // grab and store user information for use later.
    // it is stored in AsyncStorage upon login.
    const userInfo = await this._fetchUserInfo().then((res) => {
      if (res) {
        this.setState({
          userInfo: res
        });
        // fetch tasks related to/assigned to the currently logged in user
        // the user's ID will be used for the query.
        this._fetchAssignedTasks(res.ID);
      }
    });
  }

  // simple retrieval from AsyncStorage.
  // it is stored as a serialized string so must be parsed into
  // JSON in order to use throughout the app
  async _fetchUserInfo() {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return JSON.parse(userInfo);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // fetches the tasks assigned to the user currently logged in
  _fetchAssignedTasks(userId) {
    // due to the nature of the database design, some data massaging must be done
    // in order to retrieve the proper tasks assigned to the currently logged in user
    var assignedTasks = [];
    var taskCategories = [];
    var fixedTasks = [];
    var position = this.state.userInfo.Position;
    console.log("hello" + userId)
    // pulls all the task categories from firebase and puts them in taskCategories array
    firebase.database().ref("TaskInstruction").once('value').then((snapshot) => {
      snapshot.forEach(function (categories) {
        var cat = categories.key;
        taskCategories.push(cat);
      })
      // pulls all the task ID's assigned to the logged in user
      firebase.database().ref(`${position}/${userId}/AssignedTasks`).once('value').then((snapshot2) => {
        snapshot2.forEach((assigned) => {
          var assignedDef = assigned.val();
          // iterates over the taskCategories and assigned tasks and pulls the task objects 
          for (var index in taskCategories) {
            firebase.database().ref(`TaskInstruction/${taskCategories[index]}/${assignedDef}`).once('value').then((snapshot3) => {
              if (snapshot3.val() != null) {
                const child = snapshot3.val();
                child.collapsed = true;
                child.collapsedStep = true;
                this.populateArray(child)
              } else {

              }
            }).catch((error) => {
              console.error(error);
              return null;
            });
          }
        })
      })
    })
  }

  // sets the state with the promised state from the task fetching function
  promisedSetState = (newState) => {
    return new Promise((resolve) => {
      this.setState(newState, () => {
        resolve()
      });
    });

  }

  seperatorStyle = function(screenWidth) {
    return {
      height:2,
      backgroundColor: '#C2CFDB',
      width: screenWidth,
    }
  }

  _rendervideo(item) {
    console.log("\n\n\n\nvideo link is " + item.videolink);
    if(item.videolink != "null"){
      return (
        <View >
          <TouchableOpacity>
            <Button
            title = "Tap to watch video"
            titleStyle = {{marginTop: 5, alignSelf: 'center', flex: 1, justifyContent: 'center'}}
            type='solid'
            buttonStyle={{backgroundColor:'#3f9fff', marginTop: 5, alignSelf: 'center', flex: 1, justifyContent: 'space-between', width: 250}}
            onPress={() => Linking.openURL(item.videolink)}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
  // toggles the collapse state for categories of tasks
  toggleCollapse(item) {
    item.collapsed = !item.collapsed;
    this.setState({ collapsed: item })
  }

  // toggles the collapse state for tasks within categories
  toggleCollapseStep(item) {
    item.collapsedStep = !item.collapsedStep;
    this.setState({ collapsedStep: item })
  }

  //takes individual task as parameter and populates fields with appropriate
  populateArray = (task) => {
    counter = 1;
    steps = [];
    while (true) {   // Loop through the steps
      var stepF = "Step" + counter;
      if (task["Step" + counter] != null) {
        var detailedSteps = [];
        var detailedCounter;
        detailedCounter = 1;

        //Get information about the detailed steps
        while (true) {   // Loop through the detailed steps
          if (task["Step" + counter]["DetailedStep" + detailedCounter] != null) {
            detailedSteps[detailedCounter - 1] = task["Step" + counter]["DetailedStep" + detailedCounter];
          } else {
            break;
          }
          detailedCounter++;
        }
        var detailedStepsJSON = JSON.stringify(detailedSteps);

        var stepsData = {
          description: task[stepF]["MDescriptionIOS"],
          name: task[stepF]["MtitleIOS"],
          pic: task[stepF]["ImageURL"],
          number: stepF,
          detailedSteps: detailedStepsJSON
        }
        steps[counter - 1] = stepsData;
        steps[counter - 1]['detailedSteps'] = detailedSteps;
      } else {
        break;
      }
      counter++;
    }
    taskData = [{
      taskID: task["TaskID"],
      category: task["Info"]["Category"],
      outline: task["Info"]["OutlineIOS"],
      videolink: task["Info"]["videoURL"],
      note: task["Info"]["NoteIOS"],
      name: task["Info"]["Title"],
      pic: task["Info"]["imageURL2"],
      collapsed: task["collapsed"],
      steps: steps,
    }]
    this.setState({
      fixedTasks: this.state.fixedTasks.concat(taskData)
    })

  }

<<<<<<< HEAD
  createStepText(text, step) {
    return (
      <View key={text.toString()}><Text style={{ fontSize: 20, color: 'grey' }}>Step {step} : {text}</Text></View>
=======


  //search function
  search = text => {
    console.log(text);
  };
  clear = () => {
    this.search.clear();
  };


  // search filter container
  filterlist(text){
    //getting text inserted in textinput
    const newData = this.arrayholder.filter(function(item){
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      search:text,
    });
  }


  createStepText(text, step) {
    return (
      <View key={text.toString()}><Text style={{ fontSize: 22, color: '#1976d2', paddingLeft: 5}}>   Step {step} : {text}</Text></View>
>>>>>>> origin/master
    );
  }

  createDetailText(text, step) {
    return (
<<<<<<< HEAD
      <View key={text.toString()}><Text style={{ fontSize: 14, color: 'black' }}>Detailed Step {step} : {text}</Text></View>
=======
      <View key={text.toString()}><Text style={{ fontSize: 18, color: 'black', paddingLeft: 15}}>   Detailed Step {step} : {text}</Text></View>
>>>>>>> origin/master
    );
  }

  // renders the individual items into appropriate fields
  _renderItem = ({ item }) => {
    stepsArray = [];
    imageArray=[];
    detailedStepsArray = [];
    for (var i = 0; i < item.steps.length; i++) {
      stepsArray.push(this.createStepText(item.steps[i].name, [i + 1]));
      //imageArray.push(this.createStepimage(item.steps[i].pic, [i+1]));
      for (var j = 0; j < item.steps[i].detailedSteps.length; j++) {
        stepsArray.push(this.createDetailText(item.steps[i].detailedSteps[j], [j + 1]));
      }
    }

  
    
    return (
      <View>
        <TouchableOpacity
          onPress={this.toggleCollapse.bind(this, item)}
        >
<<<<<<< HEAD
          <Text style={styles.item}>{item.category}</Text>
=======
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={this.seperatorStyle(Math.round(Dimensions.get('window').width))}>─</Text>
>>>>>>> origin/master
        </TouchableOpacity>
        {item.collapsed ?
          <View /> :
          <View>
<<<<<<< HEAD
            <TouchableOpacity
              onPress={this.toggleCollapseStep.bind(this, item)}
            >
              <Text style={styles.itemTask}>{item.name}</Text>
            </TouchableOpacity>
            {item.collapsedStep ?
              <View /> :
              <View>
                <TouchableOpacity
                  onPress={this.toggleCollapse.bind(this, item)}
                >
                  <Text style={styles.itemTask}>{item.steps.description}</Text>
                </TouchableOpacity>
                {item.collapsed ?
                  <View /> :
                  <View>
                    {stepsArray}
                  </View>}
              </View>}
=======
            <Text style={styles.itemTask}># {item.outline}</Text>
            {item.collapsed ?
              <View/> :
                <View>
                  {this._rendervideo(item)}
                  {item.collapsed ?
                  <View /> :
                  <View>
                  <TouchableOpacity
                    onPress={this.toggleCollapseStep.bind(this, item)}
                  >
                    <Text style={styles.itemTask, {fontSize: 23, color: '#004dcf', fontWeight: 'bold', paddingLeft: 2}}>  {item.name}</Text>
                  </TouchableOpacity>
                  {item.collapsedStep ?
                    <View /> :
                    <View>
                        <Image 
                        style={{width:400,height:100,alignSelf: 'center'}}
                        source={{uri:item.pic}}
                        />
                      {stepsArray}
                    </View>}
                  </View>}
                </View>}
>>>>>>> origin/master
          </View>}
      </View>
      
    )
  }


  // renders the header
  _renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Assigned Tasks</Text>
      </View>
    )
  }

  // renders the flatlist and passes the data elements from state into _renderItem
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#a1c7ff' }}>
        
        <View style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
<<<<<<< HEAD
=======
          
          <SearchBar
        // searchbar funuction, icon and style set
          round
          containerStyle={{backgroundColor:'transparent'}}
          searchIcon={{ size: 30 }}
          placeholder="Tasks instruct Search......"
          onChangeText={text => this.filterlist(text)}  
          onPressCancel={text => this.filterlist('')}
          value={this.state.search}
        />

>>>>>>> origin/master
          <FlatList
            style={{ flexGrow: 1 }}
            ref="listRef"
            data={this.state.fixedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
            ListHeaderComponent={this._renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                enabled={true}
              />}
            extraData={this.state}

          />
        </View>
      </ScrollView>
    );
  }

}


export default TaskScreen;
