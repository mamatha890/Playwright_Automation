const { request } = require('@playwright/test');
class UserApi {
    constructor(request,expect) {
        this.request = request;
        this.expect=expect // Store the request object
    }
   

    async createUser(data) {
        const response = await this.request.post(process.env.CREATEAPI, {
            data: {
                deviceId:data.deviceId,
                tms:"",
                temp:data.temp,
                hum:data.hum,
            },
            headers: {
                Accept: 'application/json',
            },
        });

        console.log(await response.json());
    this.expect(response.status()).toBe(200);
    }
}

module.exports = UserApi;




  