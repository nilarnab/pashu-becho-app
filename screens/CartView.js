import React, { useState, useEffect, useReducer } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text,TextInput, View,FlatList, Button ,Image,ImageBackground, Pressable} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const userId = "630dc78ee20ed11eea7fb99f"

const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'
export const CartView = (prop) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTotal,setSubTotal]=useState(0);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setVisible(!visible);
    }, 2000);
  }, []);

  const fetchCart = async () => {
    var userId = prop['userProfile']

    const resp = await fetch(BASE_URL + `handleCartOps/show_items?user_id=${userId}`, { method: 'POST' })
    var data_raw = await resp.json();
    const data = data_raw["response"]["cart_items"]
    setData(data);
    var newSt=0;
    data.map((item)=>{
      newSt+=item[Object.keys(item)[0]].price*item[Object.keys(item)[1]]
    })
    setSubTotal(newSt);
    setLoading(false);
  }


  const updateScreen = () => {
    forceUpdate();
  }

  const renderItem = ({ item }) => {
    // console.log(item)
    var cart_id = Object.keys(item)[0]
    var product_id = item[Object.keys(item)[0]]._id.toString()
    var product_name = item[Object.keys(item)[0]].name
    var product_description = item[Object.keys(item)[0]].description
    var prod_qnt = item[Object.keys(item)[1]]
    var prod_price=item[Object.keys(item)[0]].price

    var prod_data = {}
    prod_data['prod_id'] = product_id
    prod_data['prod_name'] = product_name
    prod_data['prod_description'] = product_description
    prod_data['prod_qnt'] = prod_qnt
    prod_data['cart_id'] = cart_id
    prod_data['prod_price']=prod_price
    return (
      <Item prop={prod_data} />
    )
  };

  const Item = ({ prop }) => {
    return (
      <View style={{borderBottomWidth:1}} >
        <View style={{marginBottom:2}}>
          <View style={styles.cart_item}>

          {/* product Image */}
          <Image source={{ uri: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113" }} style={styles.cartImage}></Image>
          <View style={{flexDirection:"column",width:"60%"}}>
          <Text style={styles.cartItemName}>{prop.prod_name}</Text>
          
          {/* Description */}
          <Text style={{color:"black"}}>{prop.prod_description}</Text>
          
          {/* Product Price */}
          <Text style={styles.price} > &#8377; {prop.prod_price}</Text>

          {/* Shiping details */}
          <Text style={{color:"black"}}>Eligible for FREE Shipping</Text>

          {/* In Stock or Out of Stock */}
          <Text style={{color:"#b01c14"}}>In stock</Text>
          </View>
          </View>


          <View style={{display:"flex",width:"100%",flexDirection:"row"}}>

          {/* cart quantity change buttons */}
          <View style={{display:"flex",marginLeft:10,flexDirection:"row",width:"30%",justifyContent:'center',border:"solid",borderColor:"black",borderWidth:1}}>
            <Pressable style={styles.cartButton}  onPress={async () => {
              setLoading(true)
              const resp = await fetch(`https://desolate-gorge-42271.herokuapp.com/handleCartOps/alter?cart_id=${prop.cart_id}&qnt_new=${prop.prod_qnt - 1}`, { method: 'POST' })
              
              fetchCart();
              
            }} prop={prop} ><Text style={{fontSize:18}}>-</Text></Pressable>
            <Text style={{color:"red",fontSize:20,marginTop:5}}> {prop.prod_qnt}</Text>
            <Pressable style={styles.cartButton} onPress={async () => {
              setLoading(true)
              const resp = await fetch(`https://desolate-gorge-42271.herokuapp.com/handleCartOps/alter?cart_id=${prop.cart_id}&qnt_new=${prop.prod_qnt + 1}`, { method: 'POST' })
              fetchCart();
            }} prop={prop}><Text style={{fontSize:18}}>+</Text>
            </Pressable>
          
          </View>
          <Pressable style={{width:60,
              color:"black",
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3,
              elevation: 3,
              backgroundColor: 'gray',
              margin:5}} ><Text>Delete</Text>
          </Pressable>
        </View>
        </View>
      </View>
    )
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (

    <SafeAreaView style={styles.outer_container}>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      {/* Cart Details Card */}
      <View style={{borderLeftWidth:2,borderBottomWidth:2,borderRightWidth:0.5,marginHorizontal:10,height:40,display:"flex",flexDirection:"row"}}>
      <TextInput style={{width:"85%",color:"black"}} placeholderTextColor="gray" placeholder="  Deliver to" ></TextInput>
      <Pressable ><Text style={{color:"#b01c14",fontWeight:"bold"}} >Change</Text></Pressable>
      </View>
      <View  style={styles.container}>
        <Text style={{color:"black",fontSize:25}}>Subtotal <Text style={{fontWeight:"900"}}>&#8377; {subTotal}</Text></Text>
        <Pressable style={{color:"black",backgroundColor:"#b01c14",padding:10,width:"95%",margin:10}}><Text style={{fontWeight:"900",fontSize:20,textAlign:'center',color:"white"}}>Proceed to Buy ({data.length} items)</Text></Pressable>
        
        <View style={{display:"flex",flexDirection:"row"}}>
        <CheckBox value={toggleCheckBox} tintColors={{ true: '#F15927', false: 'black' }} 
              onValueChange={(newValue) => setToggleCheckBox(newValue)}></CheckBox><Text style={{fontSize:18,color:"black",marginVertical:3}}>Send as a gift. Include custom message</Text>
              </View>
      </View>
      <View style={styles.container}>
        <FlatList style={{marginBottom:200}}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Text>User ID {userId}</Text>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 3,
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  cartImage:{
    width:"35%",
    height:170
  }
  ,
  cartItemName:{
    color:"black",
    fontSize:21
  },
  price:{
    fontSize:25,
    color:"black",
    fontWeight:"600"
  }
  ,
  cartButton:{
    width:30,
    color:"#b01c14",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    elevation: 3,
    backgroundColor: 'lightgray',
    margin:5
  },

  title:{color:"black" ,fontSize:12,flexShrink:1,flexWrap:'wrap'},

  outer_container: {
    backgroundColor: '#fff',
    height: '100%',
  },

  cart_item: {
    height: 'auto',
    padding: 10,
    display:'flex',
    flexDirection:"row",
    justifyContent:"space-between"
  },

  navigation: {
    backgroundColor: 'tomato'
  }
});

