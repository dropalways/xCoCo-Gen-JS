const gradient = require('gradient-string')
const { firefox } = require("playwright")
const fs = require('fs');

function generateUsername(length) {
    let result = '';

    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const  characters = "123456789";
    const charactersLength = characters.length;

    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    return result;
}


class Logger {
    static print_logo() {
        console.log(gradient("violet", "purple")(`
         ▄████▄  ▒█████   ▄████▄  ▒█████         ▄████ ▓█████ ███▄    █ 
        ▒██▀ ▀█ ▒██▒  ██▒▒██▀ ▀█ ▒██▒  ██▒    ▒ ██▒ ▀█▒▓█   ▀ ██ ▀█   █ 
        ▒▓█    ▄▒██░  ██▒▒▓█    ▄▒██░  ██▒    ░▒██░▄▄▄░▒███  ▓██  ▀█ ██▒
        ▒▓▓▄ ▄██▒██   ██░▒▓▓▄ ▄██▒██   ██░    ░░▓█  ██▓▒▓█  ▄▓██▒  ▐▌██▒
        ▒ ▓███▀ ░ ████▓▒░▒ ▓███▀ ░ ████▓▒░    ░▒▓███▀▒░░▒████▒██░   ▓██░
        ░ ░▒ ▒  ░ ▒░▒░▒░ ░ ░▒ ▒  ░ ▒░▒░▒░      ░▒   ▒  ░░ ▒░ ░ ▒░   ▒ ▒ 
          ░  ▒    ░ ▒ ▒░   ░  ▒    ░ ▒ ▒░       ░   ░   ░ ░  ░ ░░   ░ ▒░
        ░       ░ ░ ░ ▒  ░       ░ ░ ░ ▒      ░ ░   ░ ░   ░     ░   ░ ░ 
        ░ ░         ░ ░  ░ ░         ░ ░            ░     ░           ░                                          
        `))
    }

    static info(message) {
        console.log(gradient("violet", "purple")("Info | " + message))
    }

    static warning(message) {
        console.log(gradient('yellow', 'lightyellow')("Warning | " + message))
    }

    static error(message) {
        console.log(gradient('red', 'firebrick')("Error | " + message))
    }
}

function readFileAndSplitLines(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            // Split the data into lines
            const lines = data.split('\n');

            // Trim whitespace from each line (optional)
            const trimmedLines = lines.map(line => line.trim());

            resolve(trimmedLines);
        });
    });
}

function removeFirstLineFromFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return Logger.error('Error reading file: ' + err)
        }

        const lines = data.split('\n');

        lines.shift();

        const updatedContent = lines.join('\n');

        fs.writeFile(filePath, updatedContent, 'utf8', err => {
            if (err) {
                return Logger.error('Error writing file: ' + err)
            }
        });
    });
}

async function main() {
    Logger.print_logo()

    Logger.warning("This library is sponsored by xag (https://discord.gg/z7A9wf6D)");

    const stateAbbreviated = "CA".toLowerCase();
    const address = "4424 Glendale Avenue";
    const city = "Burbank";
    const zipcode = "91504";

    let comboList = process.argv[2];
    let offerId = process.argv[3];
    let cardVCC = process.argv[4];

    if (!comboList || !offerId || !cardVCC) {
        Logger.info("Loaded CC info from combolist.txt & codes.txt & vc.txt")

        try {
            const [comboListLines, offerIdLines, cardVCCLines] = await Promise.all([
                readFileAndSplitLines('combolist.txt'),
                readFileAndSplitLines('codes.txt'),
                readFileAndSplitLines('vcc.txt')
            ]);

            comboList = comboListLines[0];
            offerId = offerIdLines[0];
            cardVCC = cardVCCLines[0];
        } catch {
            Logger.error("Failed to load")
        }
    }

    Logger.warning("This gen only supports xag accounts! Otherwise it won't work."); // propaganda

    const [email, password] = comboList.split(':');
    const [cardNumber, cardExpMonth, cardExpYear, cardCvv] = cardVCC.split('|')

    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvv) {
        return Logger.error("Yo put sum shit in `vcc.txt`")
    }
    if (!email || !password) {
        return Logger.error("Yo put sum shit in `combolist.txt`")
    }
    if (!offerId) {
        return Logger.error("Yo put sum shit in `codes.txt`")
    }

    let url = "https://www.xbox.com/en-US/xbox-game-pass/invite-your-friends/redeem?offerId=";
    url += offerId;

    const browser = await firefox.launch({
        headless: false
    });

    Logger.info("Opened browser")

    let page;

    try {
        page = await browser.newPage()
    } catch {
        Logger.error("Failed to open browser")
    }


    await page.goto(url);
    await page.getByLabel('Sign in or create a Microsoft').click();
    Logger.info("Clicked on Sign in or create a Microsoft Account")
    await page.getByTestId('i0116').fill(email);
    Logger.info("Successfully put in the email from combolist.txt")
    await page.getByTestId('i0116').press('Enter');
    await page.getByTestId('i0118').fill(password);
    Logger.info("Succesfully put in the password for the account")
    await page.getByTestId('i0118').press('Enter');
    await page.getByLabel('Stay signed in?').click();

    // if (await page.getByText('Sorry, you are not eligible for this offer.See terms')) return console.log("You aren't eligible(Maybe have gamepass already?)")
    await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    Logger.info("Clicked on Redeem Now")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Get Started! Add a way to pay.' }).click();
    Logger.info("Clicked on Debit or Credit Card option")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Choose a way to pay.Visa').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').click();
    Logger.info("Successfully put in the card number from vcc.txt")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Card number*').fill(cardNumber); // card number

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').click();
    Logger.info("Succesfully set a name for the cardholder name")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Cardholder Name*').fill('X'); // cardholder name

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration month*').selectOption(cardExpMonth); // expiry month
    Logger.info("Successfully added the expiry month")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Expiration year*').selectOption(cardExpYear); // expiry year
    Logger.info("Successfully added the expiry year")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').click();
    Logger.info("Successfully put in the cvv")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('CVV*').fill(cardCvv);
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').click();
    Logger.info("Successfully put in a random address")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Address line 1*').fill(address); // address

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').click();
    Logger.info("Successfully put in the city")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('City*').fill(city);

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('State*').selectOption(stateAbbreviated); // state but short thing
    Logger.info("Successfully put in the correct state")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    Logger.info("Successfully put in the correct zipcode")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').fill(zipcode); // zipcode

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').click();
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByPlaceholder('20001').press('Enter');
    Logger.info("Pressed Enter")
    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByLabel('Save').click();
    Logger.info("Clicked on the save button")

    try {
        await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Add profile address' }).click();
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
        // Logger.error(exception.stack);
    }

    await page.frameLocator('iframe[name="redeem-sdk-hosted-iframe"]').getByRole('button', { name: 'Confirm' }).click();
    Logger.info("Clicked on the confirm button")
    await page.waitForSelector('text=Welcome to PC Game Pass', { "state": "visible" });
    Logger.info("Successfully applied gamepass!")
    // await page.getByRole('button', { name: 'REDEEM NOW' }).click();
    await page.goto('https://www.minecraft.net/en-us/login');
    Logger.info("Redirected to minecraft.net/en-us/login")
    await page.getByTestId('MSALoginButtonLink').click();
    Logger.info("Clicked on log in with microsoft account")
    await page.getByRole('link', { name: 'Profile Name' }).click();
    Logger.info("Clicked on set profile name")
    await page.getByTestId('profile-name-input').click();
    // await page.getByTestId('profile-name-input').fill(generateUsername(16));
    await page.get('profile-name-input').fill(`CocoGEN${generateUsername(9)}`)
    Logger.info("Successfully set username check `hits.txt`")

    try {
        await page.getByTestId('ChangeNameButton').click();

        Logger.info("Successfully applied gamepass!")

        fs.appendFile("hits.txt", `${email}:${password}\n`, function (err) {
            if (err) throw err;

            Logger.info("Saved!");

            removeFirstLineFromFile("codes.txt");
            removeFirstLineFromFile("combolist.txt");
            removeFirstLineFromFile("vcc.txt");

            Logger.info("Cleaned up");
        });
    }
    catch (exception) {
        Logger.error(exception);
    }

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

main()
    .catch(error => Logger.error(error));
