export const getResp = (url: any, options = {}) =>
  fetch(url, { referrer: "", referrerPolicy: "no-referrer", ...options });

export const get = (url: any, options: any) =>
  getResp(url, options).then((r) => r.json());

export const autoGet = (url: any, options: any) => get(url, options);

export const autoGetResp = (url: any, options: any) => getResp(url, options);
