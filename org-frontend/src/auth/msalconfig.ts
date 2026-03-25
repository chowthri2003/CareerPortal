import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "fa475c60-51f3-4d58-bcaf-7aefa2169dcc",
    authority: "https://login.microsoftonline.com/289b0710-fda8-4386-aa2b-49936e406df7",
    redirectUri: import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173",
  },
    cache: {
    cacheLocation: "localStorage",
  }
});

export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    "email",
    "api://fa475c60-51f3-4d58-bcaf-7aefa2169dcc/access"
  ]
};