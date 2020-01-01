
export class Token {

  static token() {
    return localStorage.getItem('token')
  }

  static saveToken(payload) {
    localStorage.token = payload.token
    let now = (Date.parse(new Date())) / 1000
    localStorage.tokenExpire = now + parseInt(payload.expire)
  }

  static removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
  }

  static checkToken() {
    if (!localStorage.getItem('token')) return false
    let now = (Date.parse(new Date())) / 1000
    let ex = localStorage.getItem('tokenExpire')
    if (!ex || now > ex) return false
    return true
  }
}
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex);

// export const store = new Vuex.Store({
//   state: {
//     auth: {
//       token: '',
//       expire: 0,
//     },
//   },
//   getters: {
//     checkToken(state) {
//       console.log('checkToken')
//       if (!state.auth.token) return false
//       let now = (Date.parse(new Date())) / 1000
//       let ex = state.auth.expire
//       if (!ex || now > ex) return false
//       return true
//     },
//   },
//   mutations: {
//     saveToken(state, payload) {
//       state.auth.token = payload.token
//       let now = (Date.parse(new Date())) / 1000
//       state.auth.expire = now + parseInt(payload.expire)
//     },
//     removeToken(state) {
//       state.auth.token = ''
//       state.auth.expire = 0
//     }
//   }
// }
// )

