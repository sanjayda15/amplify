import React, {useState} from 'react';
import { TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {Auth} from 'aws-amplify';


const SignIn = ({ onSignIn }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const signIn = async () => {
        try {
            const user = await Auth.signIn(username, password);
            history.push('/');
            onSignIn()
        
        } catch (error) {
            console.log('there was an erro loggin in ', error);
        }
    }
    return (
        <div className="signin">
            <TextField id='username'
            label = 'Username'
            value = {username}
            onChange = {e => setUsername(e.target.value)}/>
            <TextField id='Password'
            label = 'Password'
            type = 'password'
            value = {password}
            onChange = {e => setPassword(e.target.value)}/>
            <Button id='signInButton' color='primary' onClick={signIn}>Sign In</Button>

        </div>
    )
}

export default SignIn;