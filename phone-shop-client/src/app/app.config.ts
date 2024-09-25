import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './environments/environments';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withFetch()), provideAnimations(),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireStorageModule
    ),
  ]
};
