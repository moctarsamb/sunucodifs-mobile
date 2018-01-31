import React, { Component } from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableHighlight,
    View,
    Image
} from 'react-native';
import {Button, FormLabel, FormInput} from "react-native-elements";
import {BackgroundImage} from "../../components/bg";
import * as db from "../../db" ;
import {API_URL} from "../../config/api";

export default class Login extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            login : "",
            password : "",
            response: ""
        }
    }
    componentDidMount(){
    }
    render() {
        return (
            <BackgroundImage>
                <View style={styles.logo}>
                    <Image
                        style={styles.logo}
                        source={require("../../components/logo_ucad.gif")}
                    />
                </View>
                <View style={styles.container}>
                    <FormLabel>E-Mail</FormLabel>
                    <FormInput
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({login: text})}
                        style={styles.input}
                    />
                    <FormLabel>Mot de Passe</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({password: text})}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TouchableHighlight
                        onPress={()=> this.props.navigation.navigate("Recover") }
                    >
                        <Text style={styles.bottomText} >Mot de passe oublié ?</Text>
                    </TouchableHighlight>
                </View>

                <Button
                    backgroundColor="#0066ff"
                    icon={{name: 'cached'}}
                    onPress={()=> this.login() }
                    title='Se Connecter'
                    style={styles.button}
                />
                <Button
                    backgroundColor="#ff6600"
                    icon={{name: 'cached'}}
                    onPress={()=> this.props.navigation.navigate("SignUp") }
                    title="S'inscrire"
                    style={styles.button}
                />
                <View style={styles.bottom} >
                    <Button
                        backgroundColor="#cc00cc"
                        icon={{name: 'cached'}}
                        onPress={()=> this.props.navigation.navigate("Verify") }
                        title="Verifier Compte"
                        style={styles.button}
                    />
                </View>
            </BackgroundImage>
        );
    }
    login(){
         fetch(API_URL + '/etudiants/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.login,
                password: this.state.password
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
             const tokenId = responseJson.id;
             fetch(API_URL + '/etudiants/'+responseJson.userId).then((response) => response.json()).then(etu=>{
                    if(etu.error){
                        alert("Mauvaise Combinaison E-Mail/Mot DE Passe")
                    }
                    else if(!etu.emailVerified){
                        alert("Verifiez votre compte");
                        this.props.navigation.navigate("Verify");
                    }
                    else {
                        const tosave = {
                            token: tokenId,
                            id: etu.id,
                        };
                        db.Login(tosave);
                        this.props.navigation.navigate("HomeL");
                    }
             })
            })
            .catch((error) => {
                console.error(error);
            });
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 5,
        margin: 20,
    },
    input: {
        margin: "auto",
        height: 40,
        color: "#000",
    },
    button: {
        margin: 20,
        width: "auto"
    },
    logoView:{
        width: 150, height: 150,
        alignItems:"center"
    },
    logo:{

        width: 150, height: 150,
      display: "flex",
      margin: "auto"
    },
    bottom:{
        width: "90%",
        position: "absolute",
        bottom: 0,
        marginRight: 20,
        margin: 20,
        alignItems: "center"
    },
    bottomText:{
        textAlign: 'center',
        color: "#203e79"
    }
});
