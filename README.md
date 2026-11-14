## Memory Lane Overview

Memory Lane is an app that aims to improve cognitive wellness for older adults through bridging
the cognitive wellness through relaxation and cognitive wellness through brain stimulation in a single app. All while providing a way to integrate these activities easily in the busy everyday lives of adults.

Memory Lane includes mini games that users can integrate into their daily routines, including Sudoku, Word Search, Crossword, and Trivia. The app also includes a Meditation mode where users can select their music and follow a box breathing session on screen.

## Technologies used
- UI Framework: React Native​
- Languages: JavaScript, TypeScript​
- Development Platform: Expo​
- Testing and Demo Tool: Expo Go​
- Database and Authentication: Supabase​
- App Navigation: Expo Router
- Audio Functionality: Expo Audio
- Notifications: Expo Notifications

## How our UI functions

We used the Expo SDK open-source framework built around React Native to facilitate building and deploying the app on any mobile phone through the Expo Go app. Expo Router is used to navigate between pages and React Native is used to build the app's components, animations, and styling.

This app has an integrated database built using Supabase that allows new users to create an account. Therefore, a test account is not necessary and users can sign up in the app using their own credentials they choose.

## Running the App
This is a step-by-step to load the project onto your local machine and run it on your mobile phone using Expo Go:

1. Clone the repository: (make sure you ahve git installed on your local machine)
Run the command: `git clone https://github.com/srivatt18/memory-lane.git`

2. Navigate to the project directory:
Run: `cd memory-lane`

3. Install the project dependencies
Run: `npm install`

4. Make sure Expo dependencies are compatible
Run: `npx expo install --check`
If there are incompatibilities run:
`npx expo install --fix`

5. The app requires some third-party API services that you need a key for. 
    a. Create a .env file in the root directory of the project
    b. Copy and paste the format of the '.env.example' file and paste your acquired API keys into that file.

    **IMPORTANT: Retrieving the API Keys:**
    For the TAs grading in the HCI class, our team will share our API keys with you securely outside of the GitHub repo. This includes Supabase url, Supabase anon key, the API ninjas key, and the API Verve key. Here are links to the third-party APIs we used:
    - Supabase: https://supabase.com/
    - API Ninjas (Sudoku API): https://api-ninjas.com/api/sudoku#sudokugenerate-endpoint
    - APIVerve (Crossword Generator API): https://apiverve.com/marketplace/crossword?utm_source=github&utm_medium=referral&utm_content=readme#parameters
    - APIVerve (Wordsearch Generator API): https://apiverve.com/marketplace/wordsearch
    
Once keys are retrieved and in your .env file, the app is ready to run! 

6. Install the 'Expo Go' app on your mobile phone.
7. Sign up for an Expo account if you don't have one already: https://expo.dev/signup
8. Sign into you Expo account on mobile app. Also sign in through your terminal/CLI on local machine by running:
    `npx expo login`
9. Run the app:
    In your CLI/Terminal, run: 
    `npx expo start`

    On your CLI, confirm that the mode is set to Expo Go, then, using your mobile phone, scan the QR code and Memory Lane will load in the Expo Go app!

    **Note: In order to hear the music when on Meditation mode, please turn on the ringer on your mobile device.**




