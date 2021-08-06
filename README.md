## Knowledge transfer video with John Fowler is available on Streams:
https://web.microsoftstream.com/video/4c576612-ed3f-4f43-86b8-d20ee12e0a4e?App=msteamsBot&refId=f:a726d0a2-a2ad-1125-3973-a42fc110f8d3
# Guide to setup NativScript
    https://docs.nativescript.org/start/ns-setup-os-x
    - After you download Android-IDE, run this command:
        nano ~/.bash_profile
        Then add these 4 lines to the file,(If on Mac) and save.

        export ANDROID_HOME=/Users/{Your username}/Library/Android/sdk
        export ANDROID_SDK_ROOT=$ANDROID_HOME
        export PATH=$ANDROID_HOME/platform-tools:$PATH
        export PATH=$ANDROID_HOME/tools:$PATH

    - Close the terminal, re-open and run:
        tns doctor
# Random stuff:
- Use VS Code for developing this project.
    - Some good Plug Ins to download on VS Code:
		- NativeScript
        - Angular Essentials
        - Angular v7 Snippets
        - NativeScript + Angular Snippets
        - Material Icon Theme
        - Bracket Pair Colorizer
        - GitLens — Git supercharged
- I am currently using this version of NativeScript:
    7.0.9-rc.2
    To download:
        npm i -g nativescript@7.0.9-rc.2
    - To Check your version of NativeScript, run: tns --v
- Use this website to create Icons and Splash from a 1024/1024 image:
    http://images.nativescript.rocks/
## After cloning please run this:
npm i

## Differences between uat and master git branches:
                    UAT:                Master:
- App bundle Id:    .apex.      *OR*    .caregiver.
- App Name:         TestAC      *OR*    AssuriCare

## To clean the mobile project, run:
npm run clean

## To use local API endpoint:
Go to /src/ACCommon/config/app-config.module.ts
Under line 12, add this:
appConfig.apiEndpoint = {{YOUR_LOCAL_URL}}

# View files on emulated Android and IOS (Like images, attachments, etc)
- Android:
    Open Android Studio
    View -> Tool Windows -> Device File Explorer
    Navigate to:
    /data/data/com.assuricare.apex/files/app
- iOS:
    Grab from command line through this code:
    import { knownFolders } from 'tns-core-modules/file-system';
    console.log(knownFolders.ios);


# Apex only has 2 builds. Integration and Production.
    * UAT build is connected to 3 of the environments. (Dev, UAT, Release1)
## To run UAT build (Dev, UAT, Release1):
npm run ios
npm run android

## To run production build:
npm run ios-prod
npm run android-prod

## For Styles:
In _app-common.scss and _app-common.scss, add this line at the top:
@import './ACCommonModule/styles/common';


# Before deploying on Android, verify you have the keystore folder
    If you don't have that folder go here:
        https://assuricare.sharepoint.com/sites/Technology2/Shared%20Documents/Forms/AllItems.aspx? viewid=e36aabee%2D1c14%2D4a9f%2D96a3%2Da7e3982444fd&id=%2Fsites%2FTechnology2%2FShared%20Documents%2FApex
    Download this FOLDER and put it next to the main folder of the project.
    So for example, if you are in /caregiver, if you do cd ../keystore you should go into that folder.

*** How to release for Mobile: ***
1. Update the release_notes.md file with any new release notes.

2. Update Version for iOS and Android:
    # iOS     - Info.plist
        - CFBundleShortVersionString
        - CFBundleVersion
    # Android - AndroidManifest.xml
        - android:versionCode
        - android:versionName

3. Run the appcenter_deploy.sh script in the root folder
    # Make sure you have appcenter-cli installed
        If you need to install it, run:
            npm install -g appcenter-cli

    # Make sure you have a folder named keystore in the directory before root directory.
        So verify that cd ../keystore goes to a folder with 2 keystore files. debug.keystore and file.keystore
        If you don't have these files go to the SharePoint Tech Team website to download the folder.

    *** 2 Ways to run the script: ***
        - ./appcenter_deploy.sh
        - npm run deploy

4. Follow the script and choose which type of deploy you want. (iOS / Android), (UAT, AppCenter Production, Production)
    - In order to deploy to Production, you HAVE to be on the master branch.
    - In order to deploy to UAT, you CANNOT be on the master branch.
    For UAT and AppCenter Production:
        - The script will build and deploy the app to Appcenter: https://appcenter.ms/apps
    For Production:
        For iOS:
            - You will have to create your own password for Apple, on deploy script, update appleApplicationSpecificPassword, with thee new password you get.
            - When you run the script, it will ask you to log into your Apple account, once logged in, it will upload the build to Apple Developer.
            - Once the build is uploaded, you will have to create a new build number and select the uploaded build.
        For Android:
            - Once the build is complete, go to the folder that the AAB build is located, and manually drag and drop the new build onto the Android Playstore website.

# Note for iOS builds:
On iOS, if you are getting a error with provisioning profile.
1. Make sure you have the correct distribution (Production) and development (UAT) profiles downloaded.
2. If the profiles were updated or expired, make / renew the profiles and download them.
3. Go into the deploy script file, and update the "-provision" tag with the new profile names.
    1. Go to this folder to view your downloaded profiles:  ~/Library/MobileDevice/Provisioning Profiles

# Adding new users
- Android:
    1. Go to this URL:
        https://appcenter.ms/orgs/AssuriCare/people/distribution-groups/Testers/testers
    2. Add new user's email
    3. User will get a email from AppCenter, and they will have to activate it themselves.
    4. Then they will have to download AppCenter app from Google Playstore.

- iOS
    1. Go to this URL:
        https://appcenter.ms/orgs/AssuriCare/people/distribution-groups/Testers/testers
    2. Add new user's email
    3. User will get a email from AppCenter, and they will have to activate it themselves.
    4. Then they will have to go to Appcenter.ms website on safari to download the app.
# Adding iOS devices:
    1. Get UDID from the new device.
        One way to get UDID:
        https://get.udid.io/
    2. Go here: https://developer.apple.com/account/resources/devices/list
    3. Create a new device and go through the steps.
    4. Once done, you will have to create a new provisioning profile and download it with the newly added device.
        - https://developer.apple.com/account/resources/profiles/list
    5. Once downloaded, double click the profile to install and go to this directory on your Mac:
        - ~/Library/MobileDevice/Provisioning Profiles/
    6. Take the new profile's Id, and change it on the deploy script: appcenter_deploy.sh
    7. Create and deploy a new build, The new device will be able to download that build and any new builds.
