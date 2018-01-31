import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {BackgroundImage} from "../../components/bg";
import {Button, FormLabel, FormInput} from "react-native-elements";
import {API_URL} from "../../config/api";
export default class SignUp extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            nom : "",
            prenom : "",
            sexe : "",
            numCIN: "",
            numCE: "",
            password : "",
            response: "",
            email: "",
            emailVerified: false,
            niveauId: "",
            departementId:"",
            bats: [],
            nivs: []
        }
    }
    componentDidMount(){
        fetch(API_URL + '/departements/')
            .then((response) => response.json())
            .then(bats => {
                this.setState({bats:bats});
            });

        fetch(API_URL + '/niveaus/')
            .then((response) => response.json())
            .then(bats => {
                this.setState({nivs:bats});
            })
    }
    render() {
        return (
            <BackgroundImage>
                <KeyboardAwareScrollView style={styles.container}>
                    <FormLabel>E-Mail</FormLabel>
                    <FormInput
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({email: text})}
                    />
                    <FormLabel>Nom</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({nom: text})}
                    />
                    <FormLabel>Prenom</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({prenom: text})}
                    />
                    <FormLabel>Sexe</FormLabel>
                    <Picker
                        selectedValue={this.state.sexe}
                        onValueChange={(itemValue, itemIndex) => this.setState({sexe: itemValue})}>
                        <Picker.Item label="Masculin" value="M" key="0" />
                        <Picker.Item label="Feminin" value="F" key="1" />
                    </Picker>
                    <FormLabel>Numero CIN</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({numCIN: text})}
                    />
                    <FormLabel>Numero CE</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({numCE: text})}
                    />
                    <FormLabel>Depatement</FormLabel>
                    <Picker
                        selectedValue={this.state.departementId}
                        onValueChange={(itemValue, itemIndex) => this.setState({departementId: itemValue})}>
                        {this.state.bats.map((niv,index)=> {
                            return (<Picker.Item label={niv.nom} value={niv.id} key={index} /> )
                        })}
                    </Picker>
                    <FormLabel>Niveau</FormLabel>
                    <Picker
                        selectedValue={this.state.niveauId}
                        onValueChange={(itemValue, itemIndex) => this.setState({niveauId: itemValue})}>
                        {this.state.nivs.map((niv,index)=> {
                            if(this.state.departementId === niv.departementId)
                                return (<Picker.Item label={niv.intitule} value={niv.id} key={index} /> )
                            })}
                    </Picker>
                    <FormLabel>Mot de Passe</FormLabel>
                    <FormInput
                        onChangeText={(text) => this.setState({password: text})}
                        secureTextEntry
                    />
                    <Button
                        style={styles.button}
                        backgroundColor="#0066ff"
                        icon={{name: 'cached'}}
                        onPress={()=> this.signUp() }
                        title="S'inscrire"
                    />
                </KeyboardAwareScrollView>

            </BackgroundImage>
        );
    }
    signUp(){
        const tosend = {
            email: this.state.email,
            password: this.state.password,
            nom : this.state.nom,
            prenom : this.state.prenom,
            sexe : this.state.sexe,
            numCIN: this.state.numCIN,
            numCE: this.state.numCE,
            emailVerified: false,
            niveauId: this.state.niveauId,
            departementId:this.state.departementId
        };
        fetch(API_URL+ "/etudiants", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tosend)
        } ).then(resp => resp.json()).then(respjson => {
            if(!respjson) {
                alert("NON");
                return;
            }
            alert("Inscription Terminée");
            this.props.navigation.goBack();
        }).catch(error => {
            console.log(error);
            alert("Veuillez verifier votre mail ou votre connexion");
        })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 20,
    },
    button: {
        marginTop: 25,
    }
});
