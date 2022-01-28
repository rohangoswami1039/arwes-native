import React,{useState} from 'react'
import {db} from '../../firebase_config'
import { View,FlatList,StyleSheet,TouchableOpacity, ActivityIndicator, } from 'react-native'
import { collection, getDocs, query, where, orderBy, } from 'firebase/firestore'
import { Avatar,Text,Input } from 'react-native-elements'


export default function search({navigation}) {
    const [users, setusers] = useState([])
    const [loading,setloading]=useState(false)
    const fetchUser = (search)=>{  
        const docRef=collection(db,'user')
        const qdocRef =query(docRef,where('name','>=',search))
        getDocs(qdocRef).then((snapshot)=>{
            let users = snapshot.docs.map(doc =>{
                const id= doc.id;
                const data = doc.data();
               return {id,...data}
            })
            setusers(users)            
        })
    }
   
    return (
        <>
        <View>
            <Input style={{margin:10,}} placeholder='Enter User name here ' onChangeText={(search)=>fetchUser(search)}/>
            <FlatList
                data={users}
                numColumns={1}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={()=>{navigation.navigate("Public_profile",{uid:item.id})}}>
                            {loading?<ActivityIndicator size="small"/>: <View style={styles.search_container}>
                                <Avatar rounded source={{uri:item.PhotoUrl}} size={'small'}/>
                                <View style={styles.search_name}>
                                    <Text style={styles.name_text}>{item.name}</Text>
                                </View>
                            </View>}
                           
                    </TouchableOpacity>
                )}
            />
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    search_container :{
        margin:8,
        flex: 1,
        flexDirection:'row',
    },
    search_name:{
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center',
    },
    name_text:{
        fontWeight:'bold'
    },

})