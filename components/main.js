import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchUser,fetchUserPosts,fetchUserFollowing} from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/search'
import ChatScreen from './main/chats'

const Tab=createMaterialBottomTabNavigator();
const EmptyScreen =()=>{
    return(null)
}

export class main extends Component {

    componentDidMount(){
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    } 
    render() {

        return (
        <Tab.Navigator initialRouteName='Feed' barStyle={{backgroundColor:'white'}} labeled={false} activeColor='black' inactiveColor='gray'>
            <Tab.Screen name="Feed" component={FeedScreen} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialCommunityIcons name="home" color={color} size={26}/>
                    ),
            }}/>
            <Tab.Screen name="Search" component={SearchScreen} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                    ),
            }}/>

            <Tab.Screen name="Chats" component={ChatScreen} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialCommunityIcons name="chat" color={color} size={26}/>
                    ),
            }}/>

            <Tab.Screen name="Profile" component={ProfileScreen} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    ),
            }}/>
            
            
        </Tab.Navigator>
        )
    }
}
const mapStateToProps = (store)=>({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch)=> bindActionCreators({fetchUser,fetchUserPosts,fetchUserFollowing},dispatch);

export default connect(mapStateToProps,mapDispatchProps)(main)
