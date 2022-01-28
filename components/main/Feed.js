import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image,TouchableOpacity } from 'react-native'
import { Card, SpeedDial,Avatar, Input, Button } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'

import {storage,auth, db} from '../../firebase_config'
import { ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { addDoc, collection,serverTimestamp } from "firebase/firestore"; 
 

 const  Feed = (props)=> {
    const [open, setOpen] = useState(false);
    const [posts,setPosts] =useState([])
    
    const [loaded,setloaded]=useState(true)
    const [loading,setloading]=useState(false)

    const [caption,setCaption]=useState()
    const [image,setimage]=useState('')

    useEffect(()=>{
      let posts = []
      if(props.usersLoaded==props.following.length){
         for(let i=0;i<props.following.length;i++){
          const user=props.users.find(el=>el.uid===props.following[i]);
          if(user!=undefined){
            posts=[...posts, ...user.posts]
          }
         }

         posts.sort(function(x,y){
            return x.creation - y.creation;
         })
         setPosts(posts)
         setloaded(false) 
        }

    },[props.usersLoaded])

const Image_upload= async()=>{
      // No permissions request is necessary for launching the image library
 const data = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [1, 1],
     quality: 1, 
});          
if (!data.cancelled) {
  console.log(data.uri)
  setimage(data.uri)
  }
}

const Post=async()=>{ 
      setloading(!loading)
      const response = await fetch(image)
      const bolb = await response.blob();
      const task = ref(storage,`post/${auth.currentUser.uid}/${Math.random().toString(36)}`)
      uploadBytes(task,bolb).then((snapshot)=>{
          console.log("data uploaded")
          getDownloadURL(task).then((downloadUrl)=>{
              savePostData(downloadUrl)
          }).catch((error)=>{
              console.log(error)
          })
      })
      setCaption("")
      setloading(loading)
}
const savePostData = async (downloadUrl)=>{
  const docRef = collection(db,'posts',`${auth.currentUser.uid}`,"userPosts")
  await addDoc(docRef,{
      downloadUrl,
      caption,
      creation:serverTimestamp()
  })
}  

    return (
    <>
    {loaded && <ActivityIndicator size={'large'}/>}
    <View style={styles.feed_container}>
          <View style={{padding:20,margin:5,backgroundColor:'white'}}>
            <View style={{flex:1,justifyContent:'space-between'}}> 
                <Input style={{top:4,width:80,}} placeholder="Write Something Here..." onChangeText={(caption)=>{setCaption(caption)}}/>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Icon style={{marginLeft:10}} size={35} color="gray" name="images" onPress={()=>{Image_upload()}}/>
                <Button loading={loading} buttonStyle={{width:90,}} title={"Post"} onPress={()=>{Post()}}/>               
                </View>
            </View>
          </View>
          
        <View style={styles.containerGallery}>
    
            <FlatList
                data={posts}
                numColumns={1}
                horizontal={false}
                renderItem={({item})=>(                   
                      <View style={styles.posts}>
                        {loaded && <ActivityIndicator size="large"/>}
                          <View style={{flex:1,flexDirection:'row',padding:20}}>
                              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                  <Avatar rounded source={{uri:item.user.PhotoUrl}}/>
                                  <Text style={{fontWeight:'bold',margin:5,}}>{item.user.name}</Text>
                              </View>
                          </View> 
                            <Image style={styles.image} source={{uri:item.downloadUrl}} onPress={()=>{console.log(item.downloadUrl)}}/>       
                            <Text>{item.caption}</Text>
                            <View style={{flex:1,flexDirection:'row',padding:20,}}>
                               
                                <View style={{flex:1,margin:5,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{console.log("Account count")}}>
                                  <MaterialCommunityIcons name="thumb-up" color={'gray'} size={28} onPress={()=>{console.log("like clicked")}}/>
                                  <Text>like</Text>
                                  </TouchableOpacity>
                                </View>
                                
                                <View style={{flex:1,margin:5,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{props.navigation.navigate("commnets",{Postid:item.id,PostUrl:item.downloadUrl,user:item.user.uid,userPhotourl:item.user.PhotoUrl})}}>
                                  <MaterialCommunityIcons name="chat-processing" color={'gray'} size={28} />
                                  <Text>comment</Text>
                                </TouchableOpacity>
                                </View>
                                
                                <View style={{flex:1,margin:5,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{console.log("Account count")}}>
                                  <MaterialCommunityIcons name="share" color={'gray'} size={28} onPress={()=>{console.log("share clicked")}}/>
                                  <Text>Share</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                    </View >
                    /*<Card>
                      <Card.Title><Avatar source={{uri:item.user.PhotoUrl}}/><Text style={{margin:8,}}>{item.user.name}</Text></Card.Title>
                      <Card.Image style={{padding:0}} source={{uri:item.downloadUrl}}/>
                    </Card>*/ 
                )}
            />
        </View>

<SpeedDial
  buttonStyle={{backgroundColor:'#185ADB'}}
  isOpen={open}
  icon={{ name: 'edit', color: '#fff' }}
  openIcon={{ name: 'close', color: '#fff' }}
  onOpen={() => setOpen(!open)}
  onClose={() => setOpen(!open)}>
    
  <SpeedDial.Action
    buttonStyle={{backgroundColor:'#185ADB'}}
    icon={<MaterialCommunityIcons name="camera" color={'white'} size={26}/>}
    title="Add"
    onPress={() =>{props.navigation.navigate('Add')}}/>
</SpeedDial>
</View>
    </>
    )
}
const mapStateToProps = (store) =>({
  currentUser:store.userState.currentUser,
  following:store.userState.following,
  users:store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
  
})
export default connect(mapStateToProps,null)(Feed)

const styles = StyleSheet.create({
  feed_container:{
    flex:1,
  },
  posts:{
    margin:10,
    marginBottom:10,
    backgroundColor:'#fff',
  },
  camera:{
    right:0,
    width:60,
    height:60,
    borderRadius:50,
    backgroundColor:'red',
  },
  containerGallery:{
    flex:1,
    overflow:'hidden'
  },
  image:{
    flex: 1,
    marginRight:3,
    aspectRatio:1/1,
}
})