/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Button, Header } from 'semantic-ui-react';
import axios from 'axios';
import { TokenManager } from '@okta/okta-auth-js';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [data, setData] = useState();

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    oktaAuth.signInWithRedirect({ originalUri: '/' });
  };

  const resourceServerExamples = [
    {
      label: 'Node/Express Resource Server Example',
      url: 'https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server',
    },
    {
      label: 'Java/Spring MVC Resource Server Example',
      url: 'https://github.com/okta/samples-java-spring/tree/master/resource-server',
    },
    {
      label: 'ASP.NET Core Resource Server Example',
      url: 'https://github.com/okta/samples-aspnetcore/tree/master/samples-aspnetcore-3x/resource-server',
    },
  ];
  
  async function callProtectedAPi(){
  const token = authState.accessToken?authState.accessToken.accessToken:"";

  
   const response=  await axios.get("https://npapi.discounttire.com/api/dev/omnipos/exp/v1/ping",{
    headers:{
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': 'https://reactsampleappdt.herokuapp.com/',
        'dtrequestidentifier': '83385c92-4282-4476-91ff-63bc36349c91',
        'dtSourceSystem': 'local'
    }
  })
        .then(response=>setData(response.data))
        .catch(error=>setData(error.message))
  }
  
  
  async function refreshToken(){
  const refreshToken = authState.refreshToken?authState.refreshToken.refreshToken:"";
    
  const params = new URLSearchParams()
  params.append('client_id': '0oa1hwgaurigdH8sB0h8')
  params.append('accept': 'application/json')
  params.append('content-type': 'application/x-www-form-urlencoded')
  params.append('redirect_uri': 'https://reactsampleappdt.herokuapp.com/okta-hosted-login/login/callback')
  params.append('scope': 'offline_access%20openid%20profile')
  params.append('refresh_token' `${refreshToken}`)
  params.append('grant_type': 'refresh_token')
    
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'  
    }
  }
    

  
   const response=  await axios.post("https://discounttire-dev.oktapreview.com/oauth2/auss0d6l6zGni1PNd0h7/v1/token", params, config)
        .then(response=>setData(response.data))
        .catch(error=>setData(error.message))
  }

  if (!authState) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div id="home">
      <div>
        <Header as="h1">PKCE Flow w/ Okta Hosted Login Page</Header>

        { authState.isAuthenticated && !userInfo
        && <div>Loading user information...</div>}

        {authState.isAuthenticated && userInfo
        && (
        <div>
          <p id="welcome">
            Welcome, &nbsp;
            {userInfo.name}
            !
          </p>
          <p>
            You have successfully authenticated against your Okta org, and have been redirected back to this application.  You now have an ID token and access token in local storage.
            Visit the
            {' '}
            <a href="/okta-hosted-login/profile">My Profile</a>
            {' '}
            page to take a look inside the ID token.
          </p>
          <p>
          <Button id="api-button" primary onClick={callProtectedAPi}>Get API Data</Button>
          </p>
          <div id="res-data"><pre>{JSON.stringify(data)}</pre>
            </div>
          <p>
          <Button id="api-button" primary onClick={refreshToken}>Get API Data</Button>
          </p>
          <div id="res-data"><pre>{JSON.stringify(data)}</pre>
            </div>
        </div>
        )}

        {!authState.isAuthenticated
        && (
        <div>
          <p>If you&lsquo;re viewing this page then you have successfully started this React application.</p>
          <p>
            <span>This example shows you how to use the </span>
            <a href="https://github.com/okta/okta-react/tree/master">Okta React Library</a>
            <span> to add the </span>
            <a href="https://developer.okta.com/docs/guides/implement-auth-code-pkce">PKCE Flow</a>
            <span> to your application.</span>
          </p>
          <p>
            When you click the login button below, you will be presented the login page on the Okta Sign-In Widget hosted within the application.
            After you authenticate, you will be logged in to this application with an ID token and access token. These tokens will be stored in local storage and can be retrieved at a later time.
          </p>
          <Button id="login-button" primary onClick={login}>Login</Button>
          <Button id="api-button" primary onClick={callProtectedAPi}>Get API Data</Button>
          <div id="res-data"><pre>{JSON.stringify(data)}</pre></div>
        </div>
        )}

      </div>
    </div>
  );
};
export default Home;
