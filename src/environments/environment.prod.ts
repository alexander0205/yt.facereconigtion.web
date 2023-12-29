export const environment = {
  production: true,
  api_url: 'http://localhost:44325/api/v1',
  sirla_Url: 'https://ovi.mt.gob.do',
  sirla_X_API_Key: '480DD89C-197F-4DAE-A5EF-560A166E98BC',
  register_per_page: 10,
  mapboxKey:
    'pk.eyJ1Ijoia2luZ2dzdGFyayIsImEiOiJja212MGlza3gwMGg4MndvM2dremZ6MWZrIn0.SVRxd-y3oeejZ_OWsXoILg',
  boxUrl: 'https://nominatim.openstreetmap.org/search.php',
  this_site_url: 'http://localhost:44325',
  http_interceptors: [

    'POST',
    'PUT',
    'DELETE',
    'HEAD',
    'PATCH',
  ],
  log_urls_exclude: [
    `http://localhost:44325/api/v1/AuthenticationActiveDirectory/Login`,
    `http://localhost:44325/api/v1/LogRequest`,
    `http://localhost:44325/api/v1/LogResponse`,
    `http://localhost:44325/api/v1/DROPDOWN`,
  ],
};
