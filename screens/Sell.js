import React, { useState } from 'react';
import { View, Image, Text, Button, Pressable, Platform, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import { BASE_URL } from '../env';
import Video, { DRMType } from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ITEM_WIDTH, SLIDER_WIDTH } from './CarouselCardItem';
const SERVER_URL = BASE_URL;

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};



export const Sell = () => {
  const [photo1, setPhoto1] = React.useState({ uri: 'https://static.thenounproject.com/png/1231032-200.png' });
  const [photo2, setPhoto2] = React.useState({ uri: 'https://static.thenounproject.com/png/1231032-200.png' });
  const [photo3, setPhoto3] = React.useState({ uri: 'https://static.thenounproject.com/png/1231032-200.png' });
  const [video, setVideo] = useState(null);
  const [price, onChangePrice] = React.useState(null);
  const [quantity, onChangeQuantity] = React.useState(null);
  const [calvings, onChangeCalvings] = React.useState(null);

  const [desc, onChangeDesc] = React.useState('Write something in brief about your kattle ...');
  const handleChoosePhoto = (f) => {
    launchImageLibrary({ noData: true }, (response) => {
      // console.log("pepe", response);
      if (response) {
        if (f == 1)
          setPhoto1(response.assets[0]);
        else if (f == 2)
          setPhoto2(response.assets[0]);
        else
          setPhoto3(response.assets[0]);
        // console.log(response.assets[0].uri)
      }
    });
  };

  const selectVideo = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'video', includeBase64: true }, (response) => {
      console.log(response);
      setVideo({ video: response });
    })
  }

  const handleSubmit = () => {
    // console.log(photo);
    const formData = new FormData({'quan':quantity,'calvings':calvings,'price':price,'desc':desc});

    if(photo1)
    formData.append('photo', {
      uri: photo1.uri,
      name: `photo.jpg`,
      type: `image/jpeg`,
    });
    if(photo2)
    formData.append('photo', {
      uri: photo2.uri,
      name: `photo.jpg`,
      type: `image/jpeg`,
    });
    if(photo3)
    formData.append('photo', {
      uri: photo3.uri,
      name: `photo.jpg`,
      type: `image/jpeg`,
    });
    if(video)
    formData.append('video', {
      uri: video.video.assets[0].uri,
      name: `video.mp4`,
      type: `video/mp4`,
    });
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    fetch(`${SERVER_URL}api/upload`, options)
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <>
      <View style={{ flex: 1, flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', width: '95%', marginHorizontal: '2.5%', paddingHorizontal: 10, borderWidth: 0.5, borderRadius: 10 }}>
        <Text style={styles.heading}>Listing Form</Text>
        <ScrollView style={{ width: "100%", flex: 1, flexDirection: "column" }}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeQuantity}
            value={quantity}
            placeholder="Milk Quantity (in Litres)"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Calvings </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCalvings}
            value={calvings}
            placeholder="No of Calvings"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePrice}
            value={price}
            placeholder="Price (in Rupees)"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={400}
            onChangeText={text => onChangeDesc(text)}
            value={desc}
            style={{ padding: 10, color: "black", ...styles.input, height: "auto" }}
          />
          <Text style={styles.label}>Upload Video</Text>
          <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => selectVideo()} >{video ? <Video source={{ uri: video.video.assets[0].uri }}
            rate={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            paused={true}
            repeat={true}
            style={styles.image}
          // style={{width:150}}
          ></Video> : <Icon name="video-camera" size={150} color="#6200ee" />}</TouchableOpacity>


          <Text style={styles.label}>Add photos</Text>
          <View style={{ width: 305, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 30, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => handleChoosePhoto(1)}>
              <Image source={{ uri: photo1.uri }} style={styles.uploadCard} >
              </Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChoosePhoto(2)}>
              <Image source={{ uri: photo2.uri }} style={styles.uploadCard} >
              </Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChoosePhoto(3)}>
              <Image source={{ uri: photo3.uri }} style={styles.uploadCard} >
              </Image>
            </TouchableOpacity>
          </View>
          <Pressable style={{ backgroundColor: "blue", height: 40, width: 250, flex: 1, borderRadius: 5, marginLeft: 30, marginBottom: 30, flexDirection: "row", justifyContent: "center" }} onPress={handleSubmit} ><Text style={{ color: "white", fontSize: 30 }}>Submit Details</Text></Pressable>
        </ScrollView>
      </View>
    </>

  );
};

const styles = StyleSheet.create({
  input: {
    color: 'black',
    height: 40,
    width: SLIDER_WIDTH - 150,
    marginHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    color: "black",
    fontSize: 20,
    fontFamily: "bold",
    marginHorizontal: 10,

  }
  , heading: {
    color: 'green',
    fontSize: 25,
  },
  uploadCard: {
    width: 150,
    height: 150,
    borderWidth: 1,
    margin: 1,
  },
  image: {
    width: 150,
    height: 150,
  },
});
export default Sell;