import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';


import {storage,auth, db} from '../../firebase_config'
import { ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { addDoc, collection,doc,serverTimestamp, setDoc } from "firebase/firestore"; 
import { updateProfile } from 'firebase/auth';

const Image_upload = ({navigation }) => {

    const [imagedata,setimgaedata]=useState(null)
    const [loading,setloading]=useState(false)

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        setloading(!loading)
        const data = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1, 
        });      
        setimgaedata(data)
        const capture= data.uri

        const response = await fetch(capture)
        const bolb = await response.blob();
        const task = ref(storage,`user_profile/${auth.currentUser.uid}/${Math.random().toString(36)}`)
        uploadBytes(task,bolb).then((snapshot)=>{
            console.log("data uploaded")
            getDownloadURL(task).then((downloadUrl)=>{
                console.log(downloadUrl)
                savePostData(downloadUrl)
            }).catch((error)=>{
                console.log(error)
            })
        })
        const savePostData = async (downloadUrl)=>{
            const docRef = doc(db,"user",auth.currentUser.uid)
            await setDoc(docRef,{
                Email:auth.currentUser.email,
                name:auth.currentUser.displayName,
                uid:auth.currentUser.uid,
                PhotoUrl:downloadUrl,
            }).then(
                updateProfile(auth.currentUser,{
                    photoURL:downloadUrl
                }).then(navigation.replace("OZ"))
            )
        }
        setloading(!loading)
    }
   
    return (<>
        <View style={styles.image_Container}>
            <View style={styles.heading_Container}> 
                    <Text h3 style={styles.heading}> Please select a Image as your Profile Picture</Text>
            </View>
            {imagedata?<Avatar size={300} rounded source={{uri:imagedata.uri}}/>:<Avatar size={300} rounded source={{uri:"https://spng.pngfind.com/pngs/s/5-52097_avatar-png-pic-vector-avatar-icon-png-transparent.png"}}/>}
            <Button buttonStyle={styles.Upload_button} loading={loading} title={"Upload"} onPress={()=>{pickImage()}}/>
        </View>
        </>
)
}

export default Image_upload

const styles = StyleSheet.create({
    image_Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        margin:8,
    },
    heading_Container:{
        padding:20,
    },
    heading:{
        fontWeight:'bold',
        margin:15,
    },
    Upload_button:{
        width:300,
        margin:8,
    },
})
