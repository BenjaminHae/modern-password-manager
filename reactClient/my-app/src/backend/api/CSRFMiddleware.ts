import { RequestContext } from '@pm-server/pm-server-react-client';

export class CSRFMiddleware {
  csrfToken: string = 'test';
  async pre(params: RequestContext) {
    if (!params.init.headers) {
      params.init.headers = new Headers();
    }
    this.appendToHeader(params.init.headers, this.csrfToken);
    return params;
  }
  private appendToHeader(headers: HeadersInit, csrfToken: string){
    if (headers instanceof Headers) {
      headers.append('X-CSRF-TOKEN', csrfToken); 
    }
    else if (headers instanceof Array) {
      headers.push(['X-CSRF-TOKEN', csrfToken]); 
    }
    else {
      headers['X-CSRF-TOKEN']= csrfToken; 
    }
  }
}
/*
export interface ConfigurationParameters {
    basePath?: string; // override base path
    fetchApi?: FetchAPI; // override for fetch implementation
    middleware?: Middleware[]; // middleware to apply before/after fetch requests
    queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
    username?: string; // parameter for basic security
    password?: string; // parameter for basic security
    apiKey?: string | ((name: string) => string); // parameter for apiKey security
    accessToken?: string | ((name?: string, scopes?: string[]) => string); // parameter for oauth2 security
    headers?: HTTPHeaders; //header params we want to use on every request
    credentials?: RequestCredentials; //value for the credentials param we want to use on each request
}
*/
