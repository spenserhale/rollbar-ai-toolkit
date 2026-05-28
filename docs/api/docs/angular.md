<!-- source: https://docs.rollbar.com/docs/angular.md -->

# Angular 2

Rollbar SDK for Angular 2+ | Support Level: Supported

rollbar.js may be used for error reporting in all Angular 2 applications.

### Angular 2

Please see the documentation [here](https://docs.rollbar.com/v1.0.0/docs/javascript#section-quick-start-browser) on getting set up with rollbar.js.

Setting the `captureUncaught` option to true will result in reporting all uncaught exceptions to Rollbar by default. Additionally, one can catch any Angular-specific exceptions reported through the `@angular/core/ErrorHandler` component by setting a custom `ErrorHandler` class.

Configure Rollbar in its own file, so it can be imported where needed:

rollbar.ts

```javascript
import * as Rollbar from 'rollbar'; // When using Typescript < 3.6.0.
// `import Rollbar from 'rollbar';` is the required syntax for Typescript 3.6.x. 
// However, it will only work when setting either `allowSyntheticDefaultImports` 
// or `esModuleInterop` in your Typescript options.

import {
  Injectable,
  Inject,
  InjectionToken,
  ErrorHandler
} from '@angular/core';

const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: '1.0.0',
    custom_data: 'foo'
  }
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err:any) : void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}
```

Import Rollbar to be used in your root module and configure its providers.

app.module.ts

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RollbarService, rollbarFactory, RollbarErrorHandler } from './rollbar';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

Angular's error handler is now automatically available to your Angular components. To access Rollbar for logging, telemetry, configuration updates, etc, you must import its type definitions and add it to your constructor:

```javascript
import { Component, Inject } from '@angular/core';
import { RollbarService } from './rollbar';

import * as Rollbar from 'rollbar'; // When using Typescript < 3.6.0.
// `import Rollbar from 'rollbar';` is the required syntax for Typescript 3.6.x. 
// However, it will only work when setting either `allowSyntheticDefaultImports` 
// or `esModuleInterop` in your Typescript options.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  rollbarInfo() {
    // Needs the rollbar object from the constructor.
    this.rollbar.info('angular test log');
  }

  throwError() {
    // Does not need the rollbar object from the constructor,
    // and will still log to Rollbar.
    throw new Error('angular test error');
  }
}
```

Browse the full example on Github:\
<https://github.com/rollbar/rollbar.js/tree/master/examples/angular2>

#### Troubleshooting

If your system consists of the following:

```
@angular/cli: 1.4.3
node: 6.11.3
os: darwin x64
@angular/animations: 4.4.3
@angular/cli: 1.4.3
@angular/common: 4.4.3
@angular/compiler: 4.4.3
@angular/compiler-cli: 4.4.3
@angular/core: 4.4.3
@angular/forms: 4.4.3
@angular/http: 4.4.3
@angular/platform-browser: 4.4.3
@angular/platform-browser-dynamic: 4.4.3
@angular/router: 4.4.3
@angular/language-service: 4.4.3
typescript: 2.3.4
```

there are some further steps you may need to implement in order to get rollbar.js working for you.

When compiling, if you get the error `Error encountered resolving symbol values statically. Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function`, then the inline factory function in providers should be an exported function.

Another error you may encounter when compiling is `Property 'error' does not exist on type '{}'.` In this case, the RollbarErrorHandler `var rollbar` needs to have a type explicitly defined, i.e. `var rollbar: Rollbar`.

> 📘
>
> For help with importing or requiring Rollbar into your project with Typescript or a version of ECMAScript (ES5/ES6/ES7/ES8/ES9), please see this document [here](https://docs.rollbar.com/docs/importing-or-requiring-rollbar)

> 📘
>
> For more information on rollbar.js, please see the docs [here](https://docs.rollbar.com/v1.0.0/docs/javascript).