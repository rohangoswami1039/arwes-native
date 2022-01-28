import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 


import landing from './components/auth/landing'
import Register from './components/auth/Register';
import login from './components/auth/Login'
import Main from './components/main'
import AddScreen from './components/main/Add'
import ImageScreen from './components/main/Images'
import Image_upload from './components/auth/Image_upload';
import public_profile from './components/main/components/profile_components/public_profile';
import commnets from './components/main/components/commnets';


import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase_config';
import { Text, View,ActivityIndicator} from 'react-native';

import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store=createStore(rootReducer,applyMiddleware(thunk))
const Stack = createStackNavigator()

const globalScreenOption ={
  headerStyle:{backgroundColor:"#c6397d"},
  headerTitleStyle:{color:"white" },
  headerTitleAlign: 'center',
  headerTintColor:"white",
}
export class App extends Component {
  constructor(props ){
    super(props);
    this.state ={
      loaded: false,
      Image_data:false,
    }
  }
  componentDidMount(){
    onAuthStateChanged(auth,(user)=>{
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else{
        if(user.photoURL===null){
          this.setState({Image_Data:true})
        }
        
        this.setState({
          loggedIn:true,
          loaded:true,
        })
      }
    })
  }

  render() {
   const {loggedIn, loaded,Image_Data,email_verification}=this.state;
  
    if(Image_Data){
      return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator >
              <Stack.Screen name={'Image_upload'} component={Image_upload} options={{headerShown:false}}/>
              <Stack.Screen name={"OZ"} component={Main}  />
              <Stack.Screen name={"Add"} component={AddScreen} navigation={this.props.navigation} />
              <Stack.Screen name={"Images"} component={ImageScreen} options={{headerShown:false}} />
              <Stack.Screen name={"Public_profile"} component={public_profile} options={{headerShown:true}}/>
              <Stack.Screen name={"commnets"} component={commnets} options={{headerShown:true}}/>
            </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      )
    }
    if (!loaded){
      return(
      <View style={{flex:1,justifyContent:'center'}}>
        <ActivityIndicator size="large" />
      </View>)
    }
    if (!loggedIn){
      return (<NavigationContainer>
        <Stack.Navigator initialRouteName="OZ Mainframe" screenOptions={globalScreenOption}>
            <Stack.Screen name={"OZ Mainframe"} component={landing} options={{headerShown:false}} />
            <Stack.Screen name={"Register"} component={Register} options={{headerShown:false}} />
            <Stack.Screen name={"login"} component={login}  options={{headerShown:false}} />
        </Stack.Navigator>
    </NavigationContainer>
    );
    }

   return (
     <Provider store={store}>
       <NavigationContainer>
          <Stack.Navigator initialRouteName="OZ">
                <Stack.Screen name={"OZ"} component={Main}  />
                <Stack.Screen name={"Add"} component={AddScreen} navigation={this.props.navigation} />
                <Stack.Screen name={"Images"} component={ImageScreen} options={{headerShown:false}} />
                <Stack.Screen name={"Public_profile"} component={public_profile}/>
                <Stack.Screen name={"commnets"} component={commnets} options={{headerShown:true}}/>
          </Stack.Navigator>
      </NavigationContainer>
     </Provider>
   )
  }
}
export default App


