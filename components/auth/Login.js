import React, { Component } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, ImageBackground } from 'react-native'
import { Input,Button, Text } from 'react-native-elements';

import { auth } from '../../firebase_config';
import { signInWithEmailAndPassword } from "firebase/auth";


export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
            
        }
        
        this.onlogin = this.onlogin.bind(this)
    }   
    async onlogin(){
        const{ email, password }=this.state;
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
            const authUser = userCredential.user;
    //            navigation.replace("Home")
            console.log(authUser)
        // ...
        })
        .catch((error) => {
          setLoading(false)
          const errorCode = error.code;
          const errorMessage = error.message;
            console.log(errorCode+"= "+errorMessage);
            Alert.alert(
                "Login Error",
                errorCode,
                [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            )
        });   
    }

    render() {
        return (
<>
    <View style={styles.text_container}>
                  <Text h1 style={styles.heading}>Please Login to Continue </Text>
            </View>

            <View style={styles.container}>
                    <View style={styles.button_container}>
                    <View style={styles.inputContainer}>
                        <Input placeholder="Email" placeholderTextColor="gray" onChangeText={(email)=>this.setState({ email })}/>
                        <Input placeholder="Password " placeholderTextColor="gray" onChangeText={(password)=>this.setState({ password })}/>
                    </View>
                        
                        <Button containerStyle={styles.button} onPress={()=> this.onlogin()} buttonStyle={{backgroundColor:'#1434A4'}} title='Login'/>
                        <View style={styles.cancel_container}>         
                            <Text h4 style={styles.cancel_text_container} onPress={()=>{this.props.navigation.replace('OZ Mainframe')}}>Cancel</Text>
                        </View>
            </View>

            <View styles={{height:100 }}/></View>
            </>
)
    }
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    text_container:{
        top: 40,
        left:10,
        padding: 30,
        
    },
    cancel_container:{
        marginTop:10,
    },

    cancel_text_container:{
        fontWeight:'bold',
    },
    heading:{
        fontWeight:'bold',
    },
    button_container:{
        justifyContent:'center',
        alignItems:'center',
    },
    inputContainer:{
        width: 300,
    },
    button:{
        width: 300,
        marginTop:20,
        borderRadius:5,
    }
})

