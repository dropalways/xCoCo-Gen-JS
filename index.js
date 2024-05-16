const { firefox } = require("playwright")

function generateUsername(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function main() {
    console.log("This library is sponsored by XAG || https://discord.gg/z7A9wf6D")
    
    const state = "California";
    const stateAbbreviated = "CA".toLowerCase();
    const address = "435 Zimmerman Lane";
    const city = "Los Angeles";
    const zipcode = "90057";

    const email = process.argv[1]
    const password = process.argv[2]
    const offerId = process.argv[3]
    const cardVCC = process.argv[4]

    if (!process.argv[1]) {
        return console.error("Usage: node index.js email pass offerId cardvcc")
    }

    console.log("This gen only supports xag accounts! Otherwise it won't work.")

    const [cardNumber, cardExpMonth, cardExpYear, cardCvv] = cardVCC.split('|');

    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvv) {
        throw new Error("Invalid cc, you're a nigger")
    }
    
    // const cardNumber = "5467758207407717";
    // const cardCvv = "645"
    // const cardExpMonth = "12";
    // const cardExpYear = "2026";

    // 5467758207407717|12|2026|645 into
    let url = "https://www.xbox.com/en-US/xbox-game-pass/invite-your-friends/redeem?offerId=";
    url += offerId;

    const browser = await firefox.launch({
            headless: false
    });
    
    const page = await browser.newPage();
    
    await page.goto(url);
    await page.goto('https://www.xbox.com/en-US/xbox-game-pass/invite-your-friends/redeem?offerId=eea7fca8-4f56-46bd-935b-09be0eaf177f');
    await page.getByLabel('Sign in or create a Microsoft').click();
    await page.getByTestId('i0116').fill('FEHvX8AajcT@outlook.com');
    await page.getByTestId('i0116').press('Enter');
    await page.getByTestId('i0118').fill('#u]DcO4<Lvy)MuWiBHZ>');
    await page.getByTestId('i0118').press('Enter');
    await page.getByLabel('Stay signed in?').click();
    await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Close').click();
    await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Get Started! Add a way to pay.' }).click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Choose a way to pay.Visa').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').fill(cardNumber); // card number
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').fill('X'); // card holder name
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration month*').selectOption(cardExpMonth); // expiry month
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration year*').selectOption(cardExpYear); // expiry year
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').fill(cardCvv);
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').press('Enter');
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Add profile address' }).click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode here
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Use this address').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Close').click();
    await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    await page.goto('https://www.minecraft.net/en-us/login');
    await page.getByTestId('MSALoginButtonLink').click();
    await page.getByRole('link', { name: 'Profile Name' }).click();
    await page.getByTestId('profile-name-input').click();
    await page.getByTestId('profile-name-input').fill(generateUsername(16));
    await page.getByTestId('ChangeNameButton').click();
    // await page.getByLabel('Sign in or create a Microsoft').click();
    // await page.getByTestId('i0116').click();
    // await page.getByTestId('i0116').click();
    // await page.getByTestId('i0116').fill(email);
    // await page.getByRole('button', { name: 'Next' }).click();
    // await page.getByTestId('i0118').click();
    // await page.getByTestId('i0118').fill(password);
    // await page.getByRole('button', { name: 'Sign in' }).click();
    // await page.getByLabel('Stay signed in?').click();
    // if (!page.getByRole('button', { name: 'REDEEM NOW' })) await page.reload();
    // await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Get Started! Add a way to pay.' }).click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Choose a way to pay.Visa').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').fill(cardNumber); // card number
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').fill('X'); // card holder name
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration month*').selectOption(cardExpMonth); // expiry month
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration year*').selectOption(cardExpYear); // expiry year
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').fill(cardCvv);
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').press('Enter');
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Add profile address' }).click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode here
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Use this address').click();
    // await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Confirm' }).click();
    // // await page.keyboard.down("ENTER")
    // await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    // await page.goto('https://www.minecraft.net/en-us/login');
    // await page.getByTestId('MSALoginButtonLink').click();
    // await page.getByRole('link', { name: 'Profile Name' }).click();
    // await page.goto('https://www.minecraft.net/en-us/msaprofile/redeem?setupProfile=true');
    // await page.getByTestId('ChangeNameButton').click();
    // await page.getByTestId('profile-name-input').click();
    // await page.getByTestId('profile-name-input').fill('sdjsddjsjds2');
    // await page.getByTestId('ChangeNameButton').click();
}

main();
