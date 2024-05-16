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

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log("This library is sponsored by XAG || https://discord.gg/z7A9wf6D")
    
    const state = "North Carolina";
    const stateAbbreviated = "NC".toLowerCase();
    const address = "207 Fire Access Road";
    const city = "Greensboro";
    const zipcode = "27406";

    let email = process.argv[2];
    let password = process.argv[3];
    let offerId = process.argv[4];
    let cardVCC = process.argv[5];

    if (!email || !password || !offerId || !cardVCC) {
        console.log("Please enter the following information:");

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        await new Promise((resolve, reject) => {
            readline.question("Email: ", (input) => {
                email = input;
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            readline.question("Password: ", (input) => {
                password = input;
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            readline.question("Offer ID: ", (input) => {
                offerId = input;
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            readline.question("Card VCC: ", (input) => {
                cardVCC = input;
                resolve();
            });
        });

        readline.close();

        console.log("\nEntered information:");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Offer ID:", offerId);
        console.log("Card VCC:", cardVCC);
    } else {
        console.log("Using provided arguments:");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Offer ID:", offerId);
        console.log("Card VCC:", cardVCC);
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
    await page.getByLabel('Sign in or create a Microsoft').click();
    await page.getByTestId('i0116').fill(email);
    await page.getByTestId('i0116').press('Enter');
    await page.getByTestId('i0118').fill(password);
    await page.getByTestId('i0118').press('Enter');
    await page.getByLabel('Stay signed in?').click();
    // if (await page.getByText('Sorry, you are not eligible for this offer.See terms')) return console.log("You arent eligible(Maybe have gamepass already?)")
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
    try {
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', {name: 'Add profile address'}).click();
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode here
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Use this address').click()
    }
    catch (exception) {
        console.error(exception);
    }
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Confirm' }).click();
    await page.waitForSelector('text=Welcome to PC Game Pass', {"state": "visible"});
    // await page.getByRole('button', { name: 'REDEEM NOW' }).click();
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

main().catch(error => console.error(error));
