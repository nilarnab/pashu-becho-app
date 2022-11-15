import React, { useState, useEffect, useReducer} from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, Button } from 'react-native';


const userId = "630dc78ee20ed11eea7fb99f"

const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'  
export const CartView = (prop) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setInterval(() => {
        setVisible(!visible);
      }, 2000);
  }, []);

  const fetchCart = async () => {
    var userId = prop['userProfile']
  
    const resp = await fetch(BASE_URL +`handleCartOps/show_items?user_id=${userId}`, {method: 'POST'})
    var data_raw = await resp.json();
    console.log("raw data")
    console.log(data_raw['response'])
    const data = data_raw["response"]["cart_items"]
    setData(data);
    setLoading(false); 
  }


  const updateScreen = () => {
    forceUpdate();
  }

    const renderItem = ({ item }) => {
      console.log("prerender condition")
      console.log(item)
      
      var cart_id = Object.keys(item)[0]
      var product_id = item[Object.keys(item)[0]]._id.toString()
      var product_name = item[Object.keys(item)[0]].name
      var product_description = item[Object.keys(item)[0]].description
      var prod_qnt = item[Object.keys(item)[1]]
      
      var prod_data = {}
      prod_data['prod_id'] = product_id
      prod_data['prod_name'] = product_name
      prod_data['prod_description'] = product_description
      prod_data['prod_qnt'] = prod_qnt
      prod_data['cart_id'] = cart_id
      return (
      <Item prop={prod_data} />
    )};

    const Item = ({ prop}) => {

      console.log(prop)
      return (
      <View >
        <View style={styles.cart_item}>
          <Text style={styles.title}>Name: {prop.prod_name}</Text>
          <Text style={styles.title}>Description: {prop.prod_description}</Text>
          <Text style={styles.title}>Quantity: {prop.prod_qnt}</Text>
          <Text style={styles.title}>Quantity: {prop.prod_id}</Text>
          <Button onPress={ async () => 
          {
            setLoading(true)
            const resp = await fetch(`https://desolate-gorge-42271.herokuapp.com/handleCartOps/alter?cart_id=${prop.cart_id}&qnt_new=${prop.prod_qnt + 1}`, {method: 'POST'})
            console.log("response")
            console.log(resp.json())
  
            fetchCart();

          }} prop={prop} title='+' />

        <Button onPress={ async () => 
          {
            setLoading(true)
            const resp = await fetch(`https://desolate-gorge-42271.herokuapp.com/handleCartOps/alter?cart_id=${prop.cart_id}&qnt_new=${prop.prod_qnt - 1}`, {method: 'POST'})
            console.log("response")
            console.log(resp.json())
  
            fetchCart();

          }} prop={prop} title='-' />
        </View>
      </View>
    )};

    useEffect(() => {
      fetchCart();
    }, []);
  
    return (
          
            <SafeAreaView style={styles.outer_container}>
              {loading && <ActivityIndicator size="small" color="#0000ff" />}
              <Text>The following shows your cart items</Text>
              <View style={styles.container}>
                <FlatList
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
              elevation:3,
              justifyContent: 'center',
              marginVertical: 10,
              marginHorizontal: 20,
              borderRadius: 20
            },

            outer_container: {
              backgroundColor: '#fff',
              height: '100%',
            },
            
            cart_item: {
              height: 'auto',
              justifyContent: 'center',
              elevation: 1,
              margin: 10,
              padding: 10,
              borderStyle: 'solid'
            },
          
            navigation: {
              backgroundColor: 'tomato'
            }
          });