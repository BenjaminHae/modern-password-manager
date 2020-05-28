import React from 'react';
import Login from './components/Login/Login';
import Authenticated from './components/Authenticated/Authenticated';
import './App.css';
import { BackendService } from './backend/backend.service';
import { CSRFMiddleware } from './backend/api/CSRFMiddleware';
import { MaintenanceService } from './backend/api/maintenance.service';
import { UserService } from './backend/api/user.service';
import { AccountsService } from './backend/api/accounts.service';
import { AccountTransformerService } from './backend/controller/account-transformer.service';
import { CredentialService } from './backend/credential.service';
import { CryptoService } from './backend/crypto.service';
import { Configuration as OpenAPIConfiguration } from '@pm-server/pm-server-react-client';
import { MaintenanceApi as OpenAPIMaintenanceService } from '@pm-server/pm-server-react-client';
import { UserApi as OpenAPIUserService } from '@pm-server/pm-server-react-client';
import { AccountsApi as OpenAPIAccountsService } from '@pm-server/pm-server-react-client';

let ready = false;
let csrfMiddleware = new CSRFMiddleware();
let APIconfiguration = new OpenAPIConfiguration({ basePath: "http://debian-vms-hp.lab:8080/", middleware: [csrfMiddleware]});
let authenticated = false;
let credentialService = new CredentialService();
let cryptoService = new CryptoService(credentialService);
let accountTransformerService = new AccountTransformerService(cryptoService); 
let backend = new BackendService(
	new MaintenanceService(new OpenAPIMaintenanceService(APIconfiguration), csrfMiddleware), 
	new UserService(new OpenAPIUserService(APIconfiguration), accountTransformerService),
	new AccountsService(new OpenAPIAccountsService(APIconfiguration), accountTransformerService), 
	credentialService, 
	accountTransformerService, 
	cryptoService);
backend.waitForBackend()
	.then(() => {
		ready = true;
	});

function doLogin(username:string, password: string) {
  backend.logon(username, password)
	.then(() => {
		authenticated = true;
	});
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
          Password Manager
      </header>
      {authenticated 
       ? <Authenticated accounts={backend.accounts}/>
       : <Login doLogin={doLogin}/>
      }
    </div>
  );
}

export default App;
