import './App.css';
import {useState, useEffect} from 'react'
import Amplify, {Auth} from 'aws-amplify';
import  awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Songlist from './components/SongList';
import { Button } from '@material-ui/core'
import {Switch, Route, BrowserRouter as Router, Link } from 'react-router-dom';
import SignIn from './components/SignIn'
Amplify.configure(awsconfig)
function App() {
  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    AssessLoggedInState()
  }, [])

  const AssessLoggedInState = () => {
    Auth.currentAuthenticatedUser().then(() => {
      setloggedIn(true)
    })
    .catch(() => {
      setloggedIn(false);
    });
  };

  const onSignIn = () => {
    setloggedIn(true);
  }

  const signOut = async () => {
    try {
      await Auth.signOut();
      setloggedIn(false)

    } catch (error) {
      console.log('error signing out', error);
    }
  }
  return (
    <Router>
    <div className="App">
      <header className="App-header">
      { loggedIn ? <Button  variant='contained' color='primary' onClick={signOut}>Sign Out</Button> :
      <Link to='/signin'>
      <Button  variant='contained' color='primary'>Sign In</Button>
      </Link> }
      <h2>My App Content</h2>
      </header>

      <Switch>
        <Route exact path='/'>
          <Songlist />
        </Route>
        <Route path='/signin'>
          <SignIn onSignIn={onSignIn}>

          </SignIn>
        </Route>
      </Switch>
      </div>
      </Router>
  );
}

export default App;

