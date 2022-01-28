import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect,useState } from 'react';

const commnets = (props) => {
    const [text,settext]=useState()
    const [comments,setcomments]=useState([])


    console.log(props)
    useEffect(()=>{

    },[props.params.Postid])
  return (
    <View>
      <Text>Commnets...</Text>
    </View>
  );
};

export default commnets;

const styles = StyleSheet.create({});
