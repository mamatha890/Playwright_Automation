class Loginpage{
    constructor(page){
        this.page=page;
        this.usernameField = { role: 'textbox', name: 'Enter your username' }; // Username field
        this.passwordField = { role: 'textbox', name: 'Enter your password' };
        this.eyeIcon = '//span[@class="input-group-text"]//span[contains(@class, "fa-eye")]'; // Eye icon selector
      this.captchaTextSelector = 'div.captcha-container marquee.marquee-text'; // Captcha text selector
      this.captchaInputField = 'input[name="capt"]';  


    }


async performLogin( url,username, password) {
    await this.page.goto(url); // Navigate to the login page
    //await this.page.waitForTimeout(1800); // Wait for animations or loading

    await this.page.getByRole(this.usernameField.role, { name: this.usernameField.name }).fill(username.trim()); // Fill the username
    //await this.page.waitForTimeout(1800);

    await this.page.getByRole(this.passwordField.role, { name: this.passwordField.name }).fill(password);
    await this.page.click(this.eyeIcon); // Click the eye icon to reveal the password
  
    const captchaText = await this.page.textContent(this.captchaTextSelector); // Capture CAPTCHA text
    const trimmedCaptcha = captchaText.trim(); // Trim spaces from the captured CAPTCHA
    console.log('Captured CAPTCHA Text:', trimmedCaptcha);

    await this.page.fill(this.captchaInputField, trimmedCaptcha); 
    await this.page.locator('//button[@type="submit"][@class="my-button"]').click();
     // Fill the password
    //await this.page.waitForTimeout(1800);
}
}
module.exports=Loginpage;