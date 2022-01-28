import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const images = () => {
    return (
        <View>
            <Text>Images</Text>
        </View>
    )
}

export default images

const styles = StyleSheet.create({})

const usersRef = collection(db,'user')
    getDocs(usersRef).then((snapshot)=>{
        const user=snapshot.docs.map(doc=>doc.data())
        setusers(user)       
    })