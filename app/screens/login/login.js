import React, { Component } from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableHighlight,
    View
} from 'react-native';
import {Button, FormLabel, FormInput} from "react-native-elements";
import {BackgroundImage} from "../../components/bg";
import * as db from "../../db" ;
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
                <Text
                    style={styles.logo}
                > LOGO </Text>
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

                    <TouchableHighlight
                        onPress={()=> this.props.navigation.navigate("Recover") }
                    >
                        <Text style={styles.bottomText} >Mot de passe oublié ?</Text>
                    </TouchableHighlight>
                </View>
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
         fetch('http://192.168.1.15:3000/api/etudiants/login', {
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
             fetch('http://192.168.1.15:3000/api/etudiants/'+responseJson.userId).then((response) => response.json()).then(etu=>{
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
        margin: 20,
    },
    input: {
        padding: 20,
        height: 40,
        color: "#000",
    },
    button: {
        margin: 20,
        width: "auto"
    },
    logo:{
        margin: 35
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
        color: "#203e79"
    }
});
