const { test, expect } = require('@playwright/test');

test('API Test - POST Request', async ({ request }) => {
  const response = await request.post(process.env.CREATEAPI, {
    data: {
        
            "name": "mamatha",
            "lastname": "sangana",
            "mailId": "mamatha.sangana@ideabytes.com",
            "cCode": "+91",
            "mobileNumber":"9963060211",
            "roleId": "244ce818-e9fd-40a2-9fb2-cec8345ac8cf",
            "userPref": "ebcc9638-4053-42e0-b523-1ef204f8936c",
            "sms": "1",
            "email": "1",
            "notif": "1",
            "warn": true,
            "critical": true,
            "good": true,
            "alerts": true,
            "password": "Test^@1234",
            "confirmPassword": "Test^@1234",
            "createReport": "1",
            "loginId": "0104416a-7073-49a4-adfb-3c3d96b0fd3d",
            "clientID": "d751ba02-8d6f-4f67-bad8-4ffc9b7b93d9"
        
    },
    headers:{
        "Accept":"application/json",
        "Authorization":process.env.ACCESS_Tocken
    }
    
  });
  console.log(await response.json());
  expect(response.status()).toBe(200);
});