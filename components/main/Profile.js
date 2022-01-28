import React from 'react'
import { View,Image, FlatList, StyleSheet,TouchableOpacity } from 'react-native'
import { Avatar,Text } from 'react-native-elements';


import { connect } from 'react-redux'
import { auth } from '../../firebase_config';
function Profile(props) {
    const {currentUser,posts,following}=props;
    console.log(props)
    const images =  posts.map((item)=>{
        return item.downloadUrl
    })
    return (<>
        <View style={{padding:20,flexDirection:'row',backgroundColor:'#fff'}}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <Avatar size="large" rounded source={{uri:auth.currentUser.photoURL}}/>
                <Text  style={{fontWeight:'bold',marginTop:2}}> {currentUser.name}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}} >
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, alignItems: "center",}}>
                        <Text>{posts.length}</Text>
                        <Text style={{margin:4}} >Posts</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text>{following.length}</Text>
                        <Text style={{margin:4}} >followers </Text>
                    </View>
                    
                    </View>
                <View style={{ borderWidth: 1,top:10,  width: "100%", marginLeft: 10 ,alignItems: "center",backgroundColor:'#185ADB',borderRadius:5,}}>
                    <TouchableOpacity>
                    <Text style={{color:'#fff'}}>Edit Profile</Text>
                    </TouchableOpacity> 
                </View>
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
export default connect(mapStateToProps,null)(Profile)

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
        marginTop:3,
        aspectRatio:1/1,

    }
})