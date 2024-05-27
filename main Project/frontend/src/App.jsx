import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';

function App() {
  return (
    <Router>{/*used for routing to separate paths (for making multi page apps)*/}
      <MainNavigation />
        <main>
          <Switch>{/**don't auto redirect (only render one route or redirect) */}
            <Route path="/" exact>{/*render below code on path / */}
              <h1>hello</h1>
              <Users />
            </Route>
            <Route path="/:userId/places" exact>{/**colon is used to pass parameters to the route*/}
              <UserPlaces />
            </Route>
            <Route path="/places/new" exact>{/*render below code on path /users */}
              <NewPlace />
            </Route>
            {/**this route must be rendered after /places/new other because 'new' could be an id and /places/new would never be reachable */}
            <Route path="/places/:placeId" exact>{/*render below code on path /users */}
              <UpdatePlace />
            </Route>
            <Redirect to="/" />{/*if non existing url then redirect to / */}
          </Switch>
        </main>
    </Router>
  )
};

export default App;
