import React, { Component } from 'react'
import decode from 'jwt-decode'
import axios from 'axios'
import swal from 'sweetalert'
import qs from 'qs'

const identityurl = process.env.REACT_APP_DWR_IdentityServer
const clientId = process.env.REACT_APP_DWR_CLIENT_ID
const clientSecret = process.env.REACT_APP_DWR_CLIENT_SECRET
const scope = process.env.REACT_APP_DWR_SCOPE

export default class authenServices extends Component {
    constructor() {
        super()
        this.state = {}

        this.getAccessToken = this.getAccessToken.bind(this)
        this.fetchWithToken = this.fetchWithToken.bind(this)
    }

    async getAccessToken(username, password) {             // fetch เพื่อเอา Token แล้ว call SetToken เพื่อ เก็บ Token ไว้ใน Local Storage 
        //const webApiurl = process.env.REACT_APP_DWR_API;


        const axiosConfig = {
            //baseURL: webApiurl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const requestData = {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'password',
            username: username,
            password: password,
            scope: scope
            //แนบ parameter เพิ่ม source:'IEHYDRO',

        };


        try {
            const result = await axios.post(identityurl + '/connect/token', qs.stringify(requestData), axiosConfig); //https://172.16.80.60/DWR_IdentityServer/connect/token //https://localhost:5001/connect/token 
            this.setToken(result.data.access_token)

            return result
        } catch (err) {
            return err.response;
        }

    }

    //*********************************************************************************************************************

    async fetchWithToken(url, options, functionId="") {           //เอาไว้ fetch ข้อมูลจาก api โดยใช้ Token แทน username password
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json','X-Function-Header': functionId }

        //โหลดครั้งแรกไม่มี token ส่งแบบ credential
        //if (!this.getToken()) {
        //    const axiosConfig = { timeout: 30000, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        //    const requestData = {
        //        client_id: clientId,
        //        client_secret: clientSecret,
        //        grant_type: 'client_credentials',
        //        scope: scope
        //    }

        //    try {
        //        const resultToken = await axios.post(identityurl + '/connect/token', qs.stringify(requestData), axiosConfig); //https://172.16.80.60/DWR_IdentityServer/connect/token //https://localhost:5001/connect/token 
        //        this.setToken(resultToken.data.access_token)

        //        //useEffect หน้าแผนที่ settoken แล้วส่ง 
        //        headers['Authorization'] = 'Bearer ' + this.getToken()
        //        var result = axios({
        //            url: url,
        //            headers: headers,
        //            data: options.data,
        //            method: options.method
        //        })
        //        return result

        //    } catch (err) {
        //        console.log(err)
        //        return err;
        //    }
        //}
        //มีtoken ทั้งล็อคอินและไม่ล็อคอิน

        const token = this.getToken();
        if (!token) {
            window.location.href = '/Login'
        }
        else if (this.isTokenExpired(token) === true) {
            swal({ text: 'Session timeout', icon: 'warning' })
            this.logout()
            window.location.href = '/Login'
        }

        headers['Authorization'] = 'Bearer ' + this.getToken()
        try {
            var result = axios({
                url: url,
                headers: headers,
                data: options.data,
                method: options.method,
                responseType: options.responseType,
                params: options.params,
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: options.arrayFormat })
                }
            })
            return result
        } catch (e) {
            console.log(e)
        }


        //const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        //if (this.loggedIn() === true) {
        //    headers['Authorization'] = 'Bearer ' + this.getToken()
        //    try {
        //        var result = axios({ url: url, headers: headers, data: options.data, method: options.method })
        //        return result
        //    } catch (e) {
        //        console.log(e)
        //    }
        //}
        //else {
        //    swal({ text: 'Token หมดอายุ กรุณาทำการล็อคอินอีกครั้ง', icon: 'warning' })
        //    window.location.href = '/'
        //}

    }

    //*********************************************************************************************************************

    getToken() {
        return localStorage.getItem('id_token');
    }

    //*********************************************************************************************************************

    setToken(idToken) {

        return localStorage.setItem('id_token', idToken);
    }

    //*********************************************************************************************************************

    loggedIn() {

        if (!this.getToken()) {
            return false
        }

        const token = this.getToken();
        const decoded = decode(token)
        try {
            if (decoded.username) {
                return true
            }
            else {
                return false
            }
        } catch (e) {
            return false
        }

        //const token = this.getToken();

        //try {
        //    if (this.isTokenExpired(token) === false) {
        //        return true
        //    }
        //    else {
        //        return false
        //    }
        //} catch (e) {
        //    return false
        //}
    }

    //*********************************************************************************************************************

    isTokenExpired(token) {
        //npm jwt-decode
        try {
            const decoded = decode(token)
            //console.log(decoded.exp * 1000)
            //console.log('decode:' + JSON.stringify(decoded) + ',moment: ' + moment() + 'dtnow: ' + Date.now())
            if (Date.now() >= decoded.exp * 1000) {          // exp มาเป็น UTC   จะเทียบต้องเอาDateNow ตอนนี้หาร 1000 จะได้เวลา UTC ณ ตอนนี้มา 54 > 55
                //console.log('expired:' + decoded.exp)
                return true
            }
            else {
                //console.log('not expired:' + decoded.exp)
                return false
            }
        } catch (e) {
            return true
        }
    }

    //*********************************************************************************************************************

    logout() {
        localStorage.removeItem('id_token')
    }

    //*********************************************************************************************************************

    getProfile() {
        return decode(this.getToken()) // result: {"nameid":"2","role":"Lead","nbf":1577075805,"exp":1577680605,"iat":1577075805}   // nameid = empid 
    }

    //*********************************************************************************************************************

    _IsSuccessResponse(response) {
        if (response.status >= 200 && response.status < 300) {
            return true
        } else {
            return false
        }
    }

    //*********************************************************************************************************************

}


