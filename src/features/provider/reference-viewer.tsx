import {useState} from 'react';
import {Image,View,Text,Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {router} from 'expo-router';
const frames=[
  {name:'listings',image:require('../../../assets/provider-reference/listings.jpg')},
  {name:'add',image:require('../../../assets/provider-reference/add.jpg')},
  {name:'terms',image:require('../../../assets/provider-reference/terms.jpg')},
  {name:'agent',image:require('../../../assets/provider-reference/agent.jpg')},
  {name:'review',image:require('../../../assets/provider-reference/review.jpg')},
  {name:'listing',image:require('../../../assets/provider-reference/listing.jpg')},
  {name:'negotiations',image:require('../../../assets/provider-reference/negotiations.jpg')},
  {name:'bookings',image:require('../../../assets/provider-reference/bookings.jpg')},
  {name:'booking',image:require('../../../assets/provider-reference/booking.jpg')},
  {name:'account',image:require('../../../assets/provider-reference/account.jpg')},
];
export function ReferenceViewer() {
 const [index,setIndex]=useState(0);
 const action=(label:string,press:()=>void)=><Pressable accessibilityRole="button" onPress={press} style={{padding:12}}><Text>{label}</Text></Pressable>;
 return <SafeAreaView style={{flex:1,backgroundColor:'#F4F3F1'}}><Image accessibilityLabel={frames[index].name+' prototype frame'} source={frames[index].image} resizeMode="contain" style={{flex:1,width:'100%'}}/><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>{action('Close',()=>router.back())}{action('Previous',()=>setIndex((index+frames.length-1)%frames.length))}<Text>{index+1}/{frames.length}</Text>{action('Next',()=>setIndex((index+1)%frames.length))}</View></SafeAreaView>;
}
