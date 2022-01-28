import React, { useState } from 'react'
import { View,Image, StyleSheet } from 'react-native'
import { Button, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
 

import {storage,auth, db} from '../../firebase_config'
import { ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { addDoc, collection,serverTimestamp } from "firebase/firestore"; 

const Images = (props) => {    
    const [loading,setloading]=useState(false)
    const [caption,setCaption]=useState('')
    const capture=props.route.params.data.uri


    const upload = async () =>{
        setloading(!loading)
        const response = await fetch(capture)
        const bolb = await response.blob();
        const task = ref(storage,`post/${auth.currentUser.uid}/${Math.random().toString(36)}`)
        uploadBytes(task,bolb).then((snapshot)=>{
            console.log("data uploaded")
            getDownloadURL(task).then((downloadUrl)=>{
                savePostData(downloadUrl)
                props.navigation.replace("OZ")
            }).catch((error)=>{
                console.log(error)
            })
        })
        setloading(!loading)
    }
    const savePostData = async (downloadUrl)=>{
        const docRef = collection(db,'posts',`${auth.currentUser.uid}`,"userPosts")
        await addDoc(docRef,{
            downloadUrl,
            caption,
            creation:serverTimestamp()
        })
    }

    
    return (<>
<View style={{flex: 1,position:'absolute',top:50,left:4,zIndex:200,}}>
    <Icon size={45} color="white" name="ios-arrow-back" onPress={()=>{props.navigation.navigate("OZ")}}/>
</View>
    <View style={styles.cameraContainer}>
              <Image source={{uri:capture}} style={{flex:1}}/>
    </View>
            <View style={styles.upload}>
                <Input placeholder="Write a Caption..." onChangeText={(text)=>{setCaption(text)}} />
                <Button loading={loading}  title='Upload' onPress={()=>{upload()}}/>
            </View>
        
 </>
    )
}

export default Images
 

const styles =StyleSheet.create({
    cameraContainer:{
        flex: 1,
    },
    upload:{
    },
})
