import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet,TouchableOpacity,  View } from 'react-native'
import { Avatar,Text } from 'react-native-elements'
import {auth, db} from '../../firebase_config'
import { connect } from 'react-redux'


const chats = (props) => {  
    const [users,setusers]=useState(null)
    const {following}=props
    const user_data=[]  
useEffect(()=>{
    following.map(uid=>{
        const user_ref=doc(db,'user',uid)
        getDoc(user_ref).then((snapshot)=>{
            user_data.push(snapshot.data())
        })
    })
    

},[])
console.log(user_data)

    return (
        <View>
            <FlatList 
                data={user_data}
                renderItem={({item})=>(
                   <Text>{item.name}</Text>
                    )}
            />
        </View>
    )
}

const mapStateToProps = (store) =>({
    currentUser:store.userState.currentUser,
    posts:store.userState.posts,
    following:store.userState.following
})
export default connect(mapStateToProps,null)(chats)


const styles = StyleSheet.create({
    search_container :{
        margin:8,
        flex: 1,
        flexDirection:'row',
    },
    search_name:{
        marginLeft:10,
        justifyContent:'flex-start',
        alignItems:'center',
    },


})
