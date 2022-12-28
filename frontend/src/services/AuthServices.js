import apis from "./Apis";
import { Get, Post } from "./axiosCall";

class AuthService {
  constructor() {
    this.token = null;
  }

  retriveToken = () => {
    return localStorage.getItem("Token");
  };

  storeToken = (t) => {
    localStorage.setItem("Token", t);
  };

  deleteToken = () => {
    localStorage.removeItem("Token");
  };

  LoginAuth = (u, p, type) => {
    return Post({
      url: apis.LOGIN,
      data: {
        emailid: u,
        password: p,
        type: type,
      },
    });
  };

  FetchAuth = (t) => {
    return Get({
      url: apis.GETDETAILSUSER,
      params: {
        Token: t,
      },
    });
  };
}

export default new AuthService();
