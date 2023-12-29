// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:3000',
  sirla_Url: "https://ovi.mt.gob.do",
  sirla_X_API_Key: "480DD89C-197F-4DAE-A5EF-560A166E98BC",
  register_per_page: 10,
  mapboxKey : 'pk.eyJ1Ijoia2luZ2dzdGFyayIsImEiOiJja212MGlza3gwMGg4MndvM2dremZ6MWZrIn0.SVRxd-y3oeejZ_OWsXoILg',
  boxUrl: 'https://nominatim.openstreetmap.org/search.php',
  this_site_url: 'https://localhost:4200',
  http_interceptors: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  log_urls_exclude: [`https://localhost:44325/api/v1/AuthenticationActiveDirectory/Login`, `https://localhost:44325/api/v1/LogRequest`, `https://localhost:44325/api/v1/LogResponse`]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
