import React, { Component } from 'react'
import { View, Alert, KeyboardAvoidingView, StyleSheet, ImageBackground } from 'react-native'
import { Input,Button, Text } from 'react-native-elements';


import { auth, db, storage } from '../../firebase_config';
import { createUserWithEmailAndPassword, updateProfile,sendEmailVerification } from "firebase/auth";
import { doc,setDoc } from "firebase/firestore"; 


export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:'',
            name:'',
            email_button:true
        }
        
        this.onSignup = this.onSignup.bind(this)

    }
    async onConfirm(){
        const {email}=this.state;
        sendEmailVerification(email)
        .then(console.log("Email Send"))
        .finally(this.setState({email_button:false}))
        .catch((error)=>{
            console.log(error)
        })
        console.log("Email confirmed Clicked")
    }
    async onSignup(){
        const{ email, password, name}=this.state;
        const {navigation}=this.props

       await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            updateProfile(userCredential.user, {
                displayName: name
              }).then(() => {
                const docRef = doc(db,"user",auth.currentUser.uid);
                try {
                
                    setDoc(docRef,{
                            Email:auth.currentUser.email,
                            name:auth.currentUser.displayName,
                            uid:auth.currentUser.uid,
                        }).then(()=>{
                            console.log("User data uploaded")
                        })}
                    catch(e){
                           console.log("Error in Uploading User data ") 
                           console.log(e) 
                    }
              }).catch((error) => {
                console.log(error)
              });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
              console.log(errorCode+"  => "+errorMessage);
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
        <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'>
        <View style={styles.container}>
                    <View style={styles.inputContainer}>
                    <Text h3 style={styles.heading}>Please Enter Your Email to Continue </Text>
                        <Input  placeholder="Name...."placeholderTextColor="gray" onChangeText={(name)=>this.setState({ name })}/>
                        <Input  placeholder="Email..."placeholderTextColor="gray" onChangeText={(email)=>this.setState({ email })}/>
                        <Input  placeholder="Password... "placeholderTextColor="gray" onChangeText={(password)=>this.setState({ password })}/>               
                        <Button containerStyle={styles.button} onPress={()=>{this.onConfirm()}} buttonStyle={{backgroundColor:'#1434A4'}} title='Confirm Your Email'/>
                        <Button disabled={this.state.email_button} containerStyle={styles.button} onPress={()=>{this.onSignup()}} buttonStyle={{backgroundColor:'#1434A4'}} title='Signup'/>
                        <Text h4 style={styles.cancel_text_container} onPress={()=>{this.props.navigation.replace('OZ Mainframe')}}>Cancel</Text>
                    </View >
    </View>
    </KeyboardAvoidingView>
        )
    }
}

export default Register

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        flexDirection:'row',
    },
    container:{
        flex:1,
    },   
    inputContainer:{
        flex:2,
        width:300,
        justifyContent:"center",
        alignItems:"center",
        margin:25,
        padding:10,  
    },
    heading:{
        marginBottom:80,
        marginTop:80,
    },
    button:{
        margin:8,
        width:300,
    },
})




