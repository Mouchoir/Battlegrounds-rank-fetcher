const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const locales = {
    en: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'locales/en.json'), 'utf8')),
    fr: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'locales/fr.json'), 'utf8'))
};
const defaultLocale = 'en';

const app = express();
// Serve static files from the 'public' directory
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;
const VALID_REGIONS = ['EU', 'US', 'AP'];
const MAX_PAGES = 200;

const logLevel = process.argv.find(arg => arg.startsWith('--log-level='))?.split('=')[1] || 'INFO';

function logDebug(message, ...optionalParams) {
    if (logLevel === 'DEBUG') {
        console.log(message, ...optionalParams);
    }
}

logDebug(`Server started with debug logs`);

app.get('/rank/:locale', (req, res) => {
    const locale = req.params.locale || defaultLocale;
    const translations = locales[locale] || locales[defaultLocale];
    res.send(translations.noPlayerName);
});

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.get('/rank//', (req, res) => {
    res.send(locales[defaultLocale].noPlayerName);
});

app.get('/rank/', (req, res) => {
    res.send(locales[defaultLocale].noPlayerName);
});

app.get('/rank/:playerName/:locale?/:region?', async (req, res) => {
    const playerNameInput = req.params.playerName;
    const locale = req.params.locale || defaultLocale;
    const translations = locales[locale] || locales[defaultLocale];

    let playerName, regionFromInput;
    if (playerNameInput.includes(' ')) {
        [playerName, regionFromInput] = playerNameInput.split(' ');
    } else {
        playerName = playerNameInput;
    }

    const region = (regionFromInput || req.params.region || 'EU').toUpperCase();

    if (!playerName) {
        return res.send(translations.noPlayerName);
    }

    if (!VALID_REGIONS.includes(region)) {
        return res.status(400).json({
            message: translations.invalidRegion.replace('{validRegions}', VALID_REGIONS.join(', '))
        });
    }

    const requests = [];
    for (let i = 1; i <= MAX_PAGES; i++) {
        requests.push(axios.get(`https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData?region=${region}&leaderboardId=battlegrounds&page=${i}&seasonId=10`));
    }

    try {
        logDebug(`Starting requests`);

        const responses = await Promise.all(requests);

        let pageCount = 0;

        const allPlayers = [].concat(...responses.map(response => {
            logDebug(`Response received from URL:\n`, response.data.leaderboard);
            logDebug(`Current page count:\n`, pageCount);

            pageCount++;

            if (response.status !== 200) {
                throw new Error(translations.apiStatusCodeError.replace('{statusCode}', response.status));
            }
            if (!response.data || !response.data.leaderboard.rows) {
                throw new Error(translations.apiDataError);
            }
            return response.data.leaderboard.rows;
        }));

        logDebug(`Page count:\n`, pageCount);

        const player = allPlayers.find(p => p.accountid.toLowerCase() === playerName.toLowerCase());

        if (player) {
            return res.send(translations.playerRank.replace('{playerName}', playerName).replace('{rank}', player.rank).replace('{region}', region).replace('{rating}', player.rating));
        }

        return res.send(translations.playerNotFound.replace('{playerName}', playerName).replace('{region}', region));
    } catch (error) {
        return res.status(500).json({
            message: translations.apiFetchError,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(locales[defaultLocale].serverStart.replace('{port}', PORT));
});
