import { AsyncStorage } from "react-native";
import {API_URL} from "./config/api";

export function Login(user) {
    codif = {};
    AsyncStorage.setItem("USER_TOKEN", user.token);
    AsyncStorage.setItem("USER_ID", user.id);
    userId = user.id,
        userToken= user.token;
    return fetch(API_URL + "/etudiants/" + user.id).then(res=>res.json()).then(etu => {
        AsyncStorage.setItem("USER_JSON", JSON.stringify(etu));
        userJSON = etu;
        if(etu.hasCodified){
            return fetch(API_URL + "/etudiants/" + userId + "/codification").then(res=>res.json())
                .then(codifa => {
                    AsyncStorage.setItem("USER_CODIF", JSON.stringify(codifa));
                    codif = codifa;
                } )

        }
    })
}
export var userId = "";
export var userToken = "";
export var userJSON = {};
export var codif = [{}];
export const currentUser = () => {
    return AsyncStorage.multiGet(["USER_TOKEN", "USER_ID","USER_JSON","USER_CODIF"])
        .then(infos => {
            let obj = {
                token: "",
                id: "",
                codif: "",
                json: ""
            };
            obj.token = infos[0][1] ? infos[0][1] : null;
            obj.id = infos[1][1] ? infos[1][1] : null;
            obj.json = infos[2][1] ? infos[2][1] : null;
            obj.codif = infos[3][1] ? JSON.parse(infos[3][1]) : [{}];
            if (!obj.token || !obj.id || !obj.json) return null;
            userId = obj.id;
            userToken= obj.token;
            userJSON= JSON.parse(obj.json);
            codif = obj.codif
            return obj;
        })
        .catch(err => {
            if (err) {
                console.log("====================================");
                console.log(err);
                console.log("====================================");
            }
            return null;
        });
};
export const codifier = (codifaa) =>{
    codif = [codifaa];
    userJSON.hasCodified = true ;
}
export const supprcodifier = () =>{
    codif = [{}];
    userJSON.hasCodified = false ;
}
export const echanger = () =>{
    userJSON.hasEchReq = true ;
}
export const doneEchange = () =>{
    userJSON.hasEchRec = false ;
    userJSON.hasEchReq = false ;
}
export const refresh = () => {
    codif = [{}];
   return fetch(API_URL + "/etudiants/" + userId).then(res=>res.json()).then(etu => {
        AsyncStorage.setItem("USER_JSON", JSON.stringify(etu));
        userJSON = etu;
       if(etu.hasCodified){
           return fetch(API_URL + "/etudiants/" + userId + "/codification").then(res=>res.json())
               .then(codifa => {
                   AsyncStorage.setItem("USER_CODIF", JSON.stringify(codifa));
                   codif = codifa;
               } )
       }
    })
};
export const newUser = ()=> {
    return fetch(API_URL + "/etudiants/" + userJSON.id).then(res=>res.json()).then(etu => {
        AsyncStorage.setItem("USER_JSON", JSON.stringify(etu));
        userJSON = etu;
        alert(JSON.stringify(userJSON));
        return etu;
    })
   }  ;
export const Logout = () => {
    fetch(API_URL + "/etudiants/logout?access_token=" + userToken).then(
        response => response.json()
    ).then(
        res => {
        }
    )
    userId = "";
    userToken = "";
    userJSON = {};
    codif = [{}];
    AsyncStorage.multiRemove(["USER_TOKEN", "USER_ID","USER_JSON","USER_CODIF"]).catch(err => {
        if (err) {
            console.log("====================================");
            console.log(err);
            console.log("====================================");
        }
    });
};
