import {React,useEffect, useState} from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth,db } from '../../../../firebase_config';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { Avatar,Button } from 'react-native-elements';

import { connect } from 'react-redux'



const public_profile = (props) => {

    const[photoURL,setPhotoUrl]=useState()
    const[Username,setUsername]=useState()
    const[posts,setposts]=useState([])
    const [following,setFollowing]=useState(false)

    useEffect(()=>{
        const user=props.route.params.uid;
        const userRef= doc(db,"user",user)
        const userPosts=collection(db,"posts",user,"userPosts")
        getDoc(userRef).then((snapshot)=>{
            let user_data=snapshot.data()
            setPhotoUrl(user_data.PhotoUrl)
            setUsername(user_data.name)
        })
        getDocs(userPosts).then((snapshot)=>{
            let posts = snapshot.docs.map(doc =>{
                const id= doc.id;
                const data = doc.data();
               return {id,...data}})
               setposts(posts)
        })
       if (props.following.indexOf(props.route.params.uid)>-1){
           setFollowing(true)
       }
       else(setFollowing(false))
        
    },[props.following])

    const onFollow = async ()=>{
        const followRef= doc(db,'following',`${auth.currentUser.uid}`,"userFollowing",`${props.route.params.uid}`)
        await setDoc(followRef,{}).then(console.log("Following"))
    }
    const onUnfollow= async()=>{
        const followRef= doc(db,'following',`${auth.currentUser.uid}`,"userFollowing",`${props.route.params.uid}`)
        await deleteDoc(followRef).then(console.log("UnFollow"))
    }

    return (<>
        <View style={{padding:15,flexDirection:'row',backgroundColor:'#fff'}}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <Avatar size="large" rounded source={photoURL}/>
                <Text  style={{fontWeight:'bold',marginTop:2}}>{Username}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}} >
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, alignItems: "center",}}>
                        <Text>{posts.length}</Text>
                        <Text style={{margin:4}} >Posts</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text>339</Text>
                        <Text style={{margin:4}} >followers </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text>393</Text>
                        <Text style={{margin:4,marginLeft:8,}}>following</Text>
                    </View>
                    </View>
                {props.route.params.uid !== auth.currentUser.uid ? <View style={{ borderWidth: 1,borderColor:'#D3DEDC',top:10,  width: "100%", marginLeft: 10 ,borderRadius:5,}}>
                    {following?(
                        <Button 
                            title="Following"
                            type='outline'
                            raised
                            onPress={()=>onUnfollow()}
                        />
                    ):(<Button 
                        title="Follow"
                        onPress={()=>onFollow()}
                    />)}
                </View>:null}   
                
            
            </View>
        
        </View>

        <View style={styles.containerGallery}>
        <FlatList
                data={posts}
                numColumns={3}
                horizontal={false}
                renderItem={({item})=>(
                    <View style={styles.container_gallery} >
                            <Image style={styles.image} source={{uri:item.downloadUrl}} onPress={()=>{console.log(item.downloadUrl)}}/>       
                    </View > 
                )}
            />

        </View>
        </>
    )
}
const mapStateToProps = (store) =>({
    currentUser:store.userState.currentUser,
    posts:store.userState.posts,
    following:store.userState.following
    
})
export default connect(mapStateToProps,null)(public_profile)


const styles = StyleSheet.create({
    container:{
        paddingTop:150,
        backgroundColor:'red'
    },
    container_gallery:{
        flex:1/3,
    },
    image:{
        flex: 1,
        marginRight:3,
        aspectRatio:1/1,

    }
})
