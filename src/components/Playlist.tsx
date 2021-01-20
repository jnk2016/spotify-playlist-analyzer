import React, {Component, useState} from 'react';
import {Button, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text, View, Alert, ScrollView, ImageBackground} from 'react-native';
import axios from 'axios';

interface Props{
  navigation:any,
  route: any,
}

class PlaylistItems extends React.Component<Props, any>{
  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.state = {
      BasicInfo: [],
      Name: '',
      ImageUrl: '',
      Owner: '',
      Descrip: '',
      TrackAmount: '',
      TrackDetails: [],
      AuthToken: '',
      selectedValue:'date added',
      keyPickerVal:'',
      showFilterSpecs: 'initial',
      min:0,
      max:200,
    };
  }



  render(){return (
    <View>
      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Song')}}>bite me</TouchableOpacity>
    </View>
  );}
}

export default PlaylistItems;