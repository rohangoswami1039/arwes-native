import { db,auth } from "../../firebase_config"
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query} from "firebase/firestore"; 
import{USER_STATE_CHANGE,USER_POST_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE,USERS_DATA_STATE_CHANGE,USERS_POST_STATE_CHANGE} from '../constants/index'

export  function fetchUser(){
    return ((dispacth) => {
        const docRef = doc(db,"user",auth.currentUser.uid);
            getDoc(docRef).then((snapshot)=>{
                if(snapshot.exists)
                {
                    dispacth({type:USER_STATE_CHANGE, currentUser:snapshot.data()})
                }
                else
                {
                    console.log('User does not exist')
                }
                })
            })
        }

        
export  function fetchUserPosts(){
    return ((dispacth) => {
        const docRef1 = collection(db,'posts',`${auth.currentUser.uid}`,"userPosts")
        const qdocRef=query(docRef1,orderBy('creation','asc'))
            getDocs(qdocRef).then((snapshot)=>{
                let posts = snapshot.docs.map(doc =>{
                    const id= doc.id;
                    const data = doc.data();
                   // console.log(data)
                   return {id,...data}
                })
                dispacth({type:USER_POST_STATE_CHANGE, posts})
                
            })
           
            })
        } 

export  function fetchUserFollowing(){
            return ((dispacth) => {
                const docRef1 = collection(db,'following',`${auth.currentUser.uid}`,"userFollowing")
                  onSnapshot(docRef1,(snapshot)=>{
                      let following = snapshot.docs.map(doc =>{
                          const id=doc.id;
                          return id 
                      })
                      dispacth({type:USER_FOLLOWING_STATE_CHANGE, following})
                      for(let i=0;i<following.length;i++){
                        dispacth(fetchUsersData(following[i]));
                    }
                    })
                   
                    })
                } 
        
export function fetchUsersData(uid){
    return((dispacth,getState)=>{
        const found=getState().usersState.users.some(el=>el.uid===uid);        
        if (!found){
            const docRef = doc(db,"user",uid);
            getDoc(docRef).then((snapshot)=>{
                if(snapshot.exists)
                {
                    let user=snapshot.data()
                    user.uid=snapshot.id;
                    dispacth({type:USERS_DATA_STATE_CHANGE, user})
                    dispacth(fetchUserFollowingPosts(user.uid))
                }
                else
                {
                    console.log('User does not exist')
                }
                })
        }
    })
}
        
export  function fetchUserFollowingPosts(uid){
    return ((dispacth, getState) => {
        const docRef1 = collection(db,'posts',uid,"userPosts")
        const qdocRef=query(docRef1,orderBy('creation','asc'))
            getDocs(qdocRef).then((snapshot)=>{
                const uid=snapshot.query._query.path.segments[1]
                const user=getState().usersState.users.find(el=>el.uid===uid);

                let posts = snapshot.docs.map(doc =>{
                    const id= doc.id;
                    const data = doc.data();
                   // console.log(data)
                   return {id,...data,user}
                })
                dispacth({type:USERS_POST_STATE_CHANGE, posts,uid})
                
            })
           
            })
        } 