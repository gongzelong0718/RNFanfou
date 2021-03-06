import {Api} from "../../biz/common/api/Api"
import {GlobalCache} from '../AppGlobal';
import Logger from "~/global/util/Logger";
import RNFS from "react-native-fs";
import {requestPermission} from "~/global/util/SystemUtil";

const TAG = "Fetch"
export default class Fetch {
    /**
     * 文件下载
     * @param fullUrl：文件网络地址
     * @param downloadDest：目标路径
     * @param begin：开始下载后可以获取到的一些信息
     * begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
     * @param progress：下载进度
     * progress: (res) => {
                    let progress = res.bytesWritten / res.contentLength;
                    console.log('progress:', progress);
                }
     */
    static downloadFiles(fullUrl, downloadDest, begin?, progress?) {
        return new Promise(function (resolve, reject) {
            Logger.log(TAG, "downloadFiles start1:", fullUrl)
            const options = {
                fromUrl: fullUrl,
                toFile: downloadDest,
                background: true,
                begin: begin,
                progress: progress
            };
            requestPermission().then(success => {
                Logger.log(TAG, "downloadFiles start2:", fullUrl)
                return RNFS.downloadFile(options)
            }).then(downloadSuccess => {
                Logger.log(TAG, 'downloadFile success: file://' + downloadDest)
                resolve('file://' + downloadDest)
            }).catch(error => {
                reject(error)
            })
        })
    }

    static uploadImage(fullUrl, params) {
        return new Promise(function (resolve, reject) {
            Logger.log(TAG, "uploadImage start")
            let formData = new FormData();
            let file = {uri: params.uri, type: 'application/octet-stream', name: 'image.jpg'};
            formData.append("file", JSON.stringify(file));
            Logger.log(TAG, "uploadImage start2", params)
            let extParams = GlobalCache.defaultParams
            for (let key in extParams) {
                formData.append(key, extParams[key]);
            }
            Logger.log(TAG, "uploadImage start3 url:", fullUrl)
            Logger.log(TAG, "uploadImage start3 formData:", formData)

            fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data;charset=utf-8',
                },
                body: formData
            })
                .then((response) => response.json())
                .then((responseData) => {
                    Logger.log(TAG, 'uploadImage', responseData);
                    resolve(responseData);
                })
                .catch((err) => {
                    // console.error(err);
                    reject(err);
                });
        });
    }

    static post(url, params) {
        return new Promise((resolve, reject) => {
            url = Api.HOST + url
            Logger.log(TAG, "Fetch post:", url, params)
            fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: this.creteFormBody({...params, ...GlobalCache.defaultParams})
                })
                .then(response => response.json())
                .then((result) => {
                    Logger.log(TAG, "Fetch result", result)
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    static get(url, params?) {
        return new Promise((resolve, reject) => {
            url = this.createGetUrl(url, params)
            url = this.createGetUrl(url, GlobalCache.defaultParams)
            fetch(Api.HOST + url,
                {
                    method: 'GET',
                })
                .then(response => response.json())
                .then((result) => {
                    Logger.log(TAG, "Fetch get:", url, params)
                    Logger.log(TAG, "Fetch result", result)
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })

        })
    }

    static createGetUrl(url, params) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return url;
    }

    static creteFormBody(data) {
        let formBody = [];
        for (let property in data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        let result = formBody.join("&");
        return result
    }
}
