import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";


function Login(props){
    const [creds, setCreds] = useState({
        username: "",
        pwd: "",
    });
    const [message, setMessage] = useState("");
    const [ newUser, setSignUp] = useState("false");
    
    async function loginUser() {
        const {data, error} = await supabase.auth.signInWithPassowrd({
          email:creds.email,
          passowrd: creds.password,
        });
    
        if (error){
          setMessage('Login Error: ${error.message}');
        }else{
          setMessage("Login successful!")
          setCreds({email: "", password: ""});
        }
        
      }
    
      async function signUpUser(creds){
        const {data,error} = await supabase.auth.signUp({
          email:creds.emai,
          password:creds.password,
        });
    
        if (error){
          setMessage('Signup Error: ${error.message}');
        }else{
          setMessage("Signup Successful");
        };
        setCreds({email: "", password: ""});
      }

    return(
        <form>
            <label htmlFor="username">UserName</label>
            <input 
            type="text"
            name="email"
            id="email"
            value={creds.email}
            onChange={handleChange}/>
            <label htmlFor="password">Password</label>
            <input 
            type="password"
            name="password"
            id="password"
            value={creds.password}
            onChange={handleChange}/>
            <input 
            type="button" 
            value={props.buttonLabel || "Log In"}
            onClick={submitForm}/>
        </form>

    );

    function handleChange(event) {
        const {name, value}=event.target;
        switch (name){
            case "email":
                setCreds({...creds, email: value });
                break;
            case "password":
                setCreds({...creds, password: value});
                break;
        }
    }

    function submitForm( ){
        if (isSignUp){
            signUpUser();
        }else{
            loginUser();
        }
    }
}

export default Login;