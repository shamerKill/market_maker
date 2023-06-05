import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environments';


if (!environment.production && environment.mock) {
  import('./mock/index').then(() => {
    console.log('mock is start');
  });
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
