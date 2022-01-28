import React from 'react'
import { View, Text,StyleSheet, ImageBackground } from 'react-native'
import { Button } from 'react-native-elements'

export default function landing({ navigation }) {
    return (<>
    <View style={styles.container}>
            <View style={styles.buttonContainer}>
            <Button buttonStyle={{backgroundColor:'#1434A4',width: 300,margin:10,borderRadius:10}} title="Register" onPress={()=> navigation.navigate("Register")}/>
            <Button buttonStyle={{backgroundColor:'#1434A4',width: 300,margin:10,borderRadius:10}} title="Login" onPress={()=> navigation.navigate("login")}/>
            </View>
        </View>
        </>)
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    buttonContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    Imgae_back:{
        top:-80,
        left:-80,
        backgroundColor:'#8e7cc3',
        width:400,
        height:400,
        borderRadius:400,
        
    },
    Imgae_back_1:{
        top:-490,
        zIndex:-1,
        right:-10,
        backgroundColor:'#b4a7d6',
        width:400,
        height:400,
        borderRadius:400,
        
    },
    image: {
        flex: 1,
        justifyContent: 'center',
      },
})