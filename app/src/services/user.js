import Http from './http'

export async function register(password, email, avatar) {
    let par = { data: { password, email, avatar } }
    par.url = '/api/pub/register'
    return await Http.post(par)
}

export async function login(email, password) {
    let par = { data: { email, password } }
    par.url = '/api/pub/login'
    return await Http.post(par)
}

export async function exists(id) {
    let par = { url: '/api/pub/exists', data: { id } }
    return await Http.get(par)
}

export async function getInfo() {
    let par = { url: '/api/user/' }
    return await Http.get(par)
}

export async function modifyInfo(data) {
    let par = { url: '/api/user/', data }
    return await Http.put(par)
}
export async function modifyPassword(data) {
    let par = { url: '/api/user/pwd', data }
    return await Http.put(par)
}