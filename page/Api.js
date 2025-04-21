//const { request } = require('@playwright/test');
class UserApi {
    constructor(request,expect) {
        this.request = request;
        this.expect=expect // Store the request object
    }

    async createUser(user) {
        const response = await this.request.post(process.env.CREATEAPI, {
            data: {
                deviceId: user.deviceId,
                tms: user.tms,
                temp: user.temp,
                humidity: user.humidity,
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




  