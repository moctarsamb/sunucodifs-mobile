import { AsyncStorage } from "react-native";
import {API_URL} from "./config/api";

export function Login(user) {
    AsyncStorage.setItem("USER_TOKEN", user.token);
    AsyncStorage.setItem("USER_ID", user.id);
}
export var userId = "";
export var userToken = "";
export const currentUser = () => {
    return AsyncStorage.multiGet(["USER_TOKEN", "USER_ID"])
        .then(infos => {
            let obj = {
                token: "",
                id: ""
            };
            obj.token = infos[0][1] ? infos[0][1] : null;
            obj.id = infos[1][1] ? infos[1][1] : null;
            if (!obj.token || !obj.id) return null;
            userId = obj.id;
            userToken= obj.token;
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
export const Logout = () => {
    fetch(API_URL + "/etudiants/logout?access_token=" + userToken).then(
        response => response.json()
    ).then(
        res => {
        }
    )
    AsyncStorage.multiRemove(["USER_TOKEN", "USER_ID"]).catch(err => {
        if (err) {
            console.log("====================================");
            console.log(err);
            console.log("====================================");
        }
    });
};
