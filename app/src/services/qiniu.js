import Http from "./http";
import config from '@/common/config'

export async function getQiniuToken() {
    let par = { url: '/api/qiniu/token' }
    return await Http.get(par)
}

export async function uploadImage(file, token) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('token', token)
    let par = {
        url: config.qiniuUploadUrl,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    return await Http.post(par)
}
