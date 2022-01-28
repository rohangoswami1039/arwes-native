import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { Button} from 'react-native-elements';
import { Camera } from 'expo-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';

export default function Add({ navigation }) {
 // const [hasgalleryPermission,sethasgalleryPermission]= useState(null)
  const [hasPermission, setHasPermission] = useState(null);
  const [camera,setcamera]=useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted');

   //   const galleryStatus= await ImagePicker.requestCameraRollPermissionsAsync();
   // sethasgalleryPermission(galleryStatus.status==='granted')

    })();
  }, []);



  const takePicture = async()=>{
    if(camera){ 
      const data= await camera.takePictureAsync({base64:true,})
      navigation.replace('Images',{data})
    }
  }
  /** 
   * 
  */
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1, 
    });      
    console.log(data);
    
    if (!data.cancelled) {
      navigation.replace('Images',{data})
      console.log(data.uri)
    }
    
  };



  if (hasPermission === null ) {
    return <View />;
  }
  if (hasPermission === false ) {
    return <Text>No access to camera</Text>;
  }
  return (    
  <>
    <View style={{flex:1,flexDirection:'row'}}>
       <View style={styles.cameraContainer}>
          <Camera ref={ref=>setcamera(ref)} style={styles.fixedRation} type={type} ratio={'1:1'}/>
       </View>
      
  
      <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      position: 'absolute',
      bottom:0,
      left: 5,
      }}>
       <TouchableOpacity>
           <Icon size={35} color="white" name="camera-reverse" onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}/>
         </TouchableOpacity>
    </View>
     
    <View style={{
       flexDirection:'row',
       justifyContent:'center',
       alignItems:'center',
       position: 'absolute',
       bottom:0,
       marginLeft:150,
    }}>
       <TouchableOpacity>
              <MaterialCommunityIcons  name="camera-iris" color='white' size={70} onPress={()=>{takePicture()}}/>
       </TouchableOpacity>   
      </View>
    </View>
    <View style={{
       flexDirection:'row',
       justifyContent:'center',
       alignItems:'center',
       position: 'absolute',
       bottom:0,
       right: 5,
}}>
      <TouchableOpacity>
            <Icon size={35} color="white" name="images" onPress={()=>{pickImage()}}/>
      </TouchableOpacity>
    </View>
  </>
    


  );
}
const styles = StyleSheet.create({ 
  cameraContainer:{
    flex: 1,
  },
  fixedRation :{
    flex:1,
    aspectRatio:1
  },
  

}); 
//{image && <Image source={{uri:image}} style={{flex:1}}/>}