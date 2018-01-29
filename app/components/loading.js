import React, { Component } from 'react';
import {ActivityIndicator, Text, View} from "react-native";

export class Loading  extends Component {
    render(){
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <ActivityIndicator />
            <Text>Veuillez Patienter</Text>
        </View>
    )
    }
}