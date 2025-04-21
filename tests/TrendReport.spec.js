const { test, expect, context } = require('@playwright/test');
const fs = require('fs');
const Modules = require('../Common Utils/modules.js');
const dashboard=require('../page/Dashboard.js');

const path = require('path');
const csvParser = require('csv-parser');
const { validateHeaderName } = require('http');
test.beforeEach(async ({ context, page }) => {
    const session = new Modules(page, context);
    await session.sessionstorage(); 
});

test("Creating User", async ({ page }) => {
  
     
    const role = new Modules(page);
    await role.menu("Dashboard");
    const trend=new dashboard(page,expect);
    await trend.devicerowclick();
    await trend.parameterclick();
    await trend.dropdownsclick();
    await trend. CSVverification();
});