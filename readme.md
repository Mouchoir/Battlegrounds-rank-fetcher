
  

# Hearthstone Battlegrounds Rank Fetcher

  

Fetching a top player's rank in Hearthstone Battlegrounds is now more versatile with localization support. Designed for platforms like Twitch, streamers and viewers can quickly retrieve a player's rank using bots like Nightbot in multiple languages.

  

## Overview

  

Achieving high ranks in Hearthstone Battlegrounds is a testament to a player's skill. This tool offers a quick way to fetch and showcase a player's rank, making it an essential tool for Hearthstone streamers worldwide.

  

## Features

  

- Fetch a player's rank in Hearthstone Battlegrounds (top 1000 players).
- Get the rank of a player on any server

- Seamless integration with Twitch bots like Nightbot.

- Localization support for multiple languages.

- Hosted on Vercel for fast and reliable performance.

  

## Usage

  

### API Endpoint

  

To fetch a player's rank, use the following endpoint:

```https://YOUR_VERCEL_DEPLOYMENT_URL/rank/PLAYER_NAME/LOCALE/REGION```

  

Replace `PLAYER_NAME` with the name of the player, `LOCALE` with the desired language (e.g., 'en' for English, 'fr' for French), and `REGION` with the desired game server

  

### Nightbot Command

  

For Twitch streamers using Nightbot, set up a custom command:

    $(urlfetch YOUR_VERCEL_DEPLOYMENT_URL/rank/$(querystring))/LOCALE

Replace ```YOUR_VERCEL_DEPLOYMENT_URL``` and ```LOCALE```

  

You can use the !rank command in two formats:

  ```!rank player_name```
  This will return the EU server rank by default
  ```!rank player_name server_region```
  This will return the player's rank on a specific server (EU, US or AP)
  



## Setup

  

### Vercel Deployment

  

1. Fork or clone this repository.

2. [Set up a Vercel account](https://vercel.com/signup) if you haven't.

3. Deploy the project to Vercel.

  

### Nightbot Integration

  

1. Log in to your [Nightbot dashboard](https://nightbot.tv/).

2. Go to the "Commands" section.

3. Add a custom command and use the API endpoint as shown in the example above.

  

## Contributions

  

Feel free to fork this project, open issues, or submit pull requests. Any feedback or contribution is much appreciated.

  

## License

  

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
