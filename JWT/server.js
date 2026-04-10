const express = require('express');
const app = express();
const HTTP_PORT = 8080;

// Middleware
app.use(express.json());

// --- In-memory "databas" ---

// This is the users
let users = [
    { id: 1, username: 'alice', password: 'password123' },
    { id: 2, username: 'bob', password: 'password456' }
];


// --- Hjälpfunktioner ---

// TODO: Du behöver implementera denna metod för att skapa och signera
//       ett nytt token.
function generateToken(userId, username) {
    
}

// TODO: Du behöver ändra och implementera denna metod för att verifiera
//       token som skickas med i requesten. Om token är giltigt, spara
//       användarens information i req.user så att den är tillgänglig i
//       resten av requestens hantering.
function verifyToken(req, res, next) {
    
    next(); // Anropa nästa middleware (dvs inget görs här än så länge)
}

// Funktion för att skicka ett standardiserat API-svar
function sendApiResponse(res, status, data) {
    res.json({ status, data });
}

// --- API Endpoints ---

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendApiResponse(res, 'ERROR', 'Username and password required');
    }

    const existingUser = users.find(u => u.username === username);
    if (!existingUser) {
        return sendApiResponse(res, 'ERROR', 'Login failed');
    }

    if (existingUser.password !== password) {
        return sendApiResponse(res, 'ERROR', 'Login failed');
    }

    // När användaren har verifierats, generera ett token och skicka det i svaret
    const token = generateToken(existingUser.id, existingUser.username);
    sendApiResponse(res, 'SUCCESS', token);
});

app.get('/api/secret', verifyToken, (req, res) => {
    const username = req.user ? req.user.username : 'okänd användare';

    // Denna endpoint är skyddad av verifyToken-middleware, så endast autentiserade användare kan nå hit.
    return sendApiResponse(res, 'SUCCESS', `Detta är en hemlig data som bara ${username} får se!`);
});

app.listen(HTTP_PORT, () => {
    console.log(`🚀 Server kör på http://localhost:${HTTP_PORT}`);
    console.log(`⚠️  OBS: Denna server är INTE säker för produktion!`);
});