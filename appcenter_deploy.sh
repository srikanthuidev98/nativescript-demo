# This script is used to build and deploy to Appcenter.

# Update the file ./release_notes.md with the new release notes per deploy.

clear

FILE_PATH=""
OS=""
ENVIRONMENT=""
APPCENTER_APP_NAME=""

IOS_PATH="platforms/ios/build/Release-iphoneos/Caregiver.ipa"
ANDROID_PATH="platforms/android/app/build/outputs/apk/release/app-release.apk"
ANDROID_DEBUG_PATH="platforms/android/app/build/outputs/apk/debug/app-debug.apk"

# To get the list of apps. Do the following steps:
# Run: appcenter login
# Run: appcenter apps list
IOS_DEV_NAME="AssuriCare/Apex-iOS-Dev"
IOS_UAT_NAME="AssuriCare/Apex-iOS-UAT"
IOS_STAGING_NAME="AssuriCare/Apex-iOS-Staging"
IOS_PRODUCTION_NAME="AssuriCare/Apex-iOS-Production"
ANDROID_DEV_NAME="AssuriCare/Apex-Android-Dev"
ANDROID_UAT_NAME="AssuriCare/Apex-Android-UAT"
ANDROID_STAGING_NAME="AssuriCare/Apex-Android-Staging"
ANDROID_PRODUCTION_NAME="AssuriCare/Apex-Android-Production"

GIT_BRANCH="$(git branch | grep \* | cut -d ' ' -f2)"

check_git_branch () {
    if [ $1 == "production" ]; then
        if [ "$GIT_BRANCH" != "master" ]; then
            echo
            echo "ERROR: Please checkout to master branch to deploy to Production"
            echo
            exit;
        fi
    else
        if [ "$GIT_BRANCH" == "master" ]; then
            echo
            echo "ERROR: Please checkout of master branch to deploy to Non-Production environment"
            echo
            exit;
        fi
    fi
}

echo
echo "GIT_BRANCH: $GIT_BRANCH"
echo 'Please pick which app you want to upload: '
options=("iOS UAT" "iOS Production" "iOS Production Deploy to App Store" "Android UAT" "Android Production" "Android AAB Production Build (To upload AAB build to Google Play)" "Exit")

COLUMNS=10
select opt in "${options[@]}"
do
    case $opt in
        "iOS UAT")
            FILE_PATH=$IOS_PATH
            ENVIRONMENT="UAT"
            APPCENTER_APP_NAME=$IOS_UAT_NAME
            check_git_branch uat
            echo 'Starting iOS UAT Build...'
            tns build ios --release --for-device --env.uglify --env.aot --env.name=uat --provision a728c666-2866-40b2-a229-118b9b20f075
            break
            ;;
        "iOS Production")
            FILE_PATH=$IOS_PATH
            ENVIRONMENT="Production"
            APPCENTER_APP_NAME=$IOS_PRODUCTION_NAME
            check_git_branch production
            echo 'Starting iOS Production Build...'
            tns build ios --release --for-device --env.uglify --env.aot --env.name=production --provision c8caaf49-0bb2-42d6-979a-a4a72302f3cc
            break
            ;;
        "iOS Production Deploy to App Store")
            FILE_PATH=$IOS_PATH
            ENVIRONMENT="Production"
            APPCENTER_APP_NAME=$IOS_PRODUCTION_NAME
            check_git_branch production
            echo 'Starting iOS Production Build and deploying to App store...'
            tns publish ios --release --env.uglify --env.aot --env.name=production --provision fc0600d5-ef2e-45f3-bcf3-8d7266cd0c51 --appleApplicationSpecificPassword gnas-iych-ldbn-cpal
            echo
            echo 'iOS Production Build and deploy is complete. The IPA was uploaded, please go to App Store to continue the process.'
            exit;
            ;;
        "Android UAT")
            FILE_PATH=$ANDROID_PATH
            ENVIRONMENT="UAT"
            APPCENTER_APP_NAME=$ANDROID_UAT_NAME
            check_git_branch uat
            echo 'Starting Android UAT Build...'
            tns build android --release --env.uglify --env.aot --env.name=uat --key-store-path ../keystore/file.keystore  --key-store-password Assuricare2019 --key-store-alias assuricare --key-store-alias-password Assuricare2019
            break
            ;;
        "Android Production")
            FILE_PATH=$ANDROID_PATH
            ENVIRONMENT="Production"
            APPCENTER_APP_NAME=$ANDROID_PRODUCTION_NAME
            check_git_branch production
            echo 'Starting Android Production Build...'
            tns build android --release --env.uglify --env.aot --env.name=production --key-store-path ../keystore/file.keystore --key-store-password Assuricare2019 --key-store-alias assuricare --key-store-alias-password Assuricare2019
            break
            ;;
        "Android AAB Production Build (To upload AAB build to Google Play)")
            FILE_PATH=$ANDROID_PATH
            ENVIRONMENT="Production"
            APPCENTER_APP_NAME=$ANDROID_PRODUCTION_NAME
            check_git_branch production
            echo 'Starting Android AAB Production Build...'
            tns build android --release --env.uglify --env.aot --env.name=production --key-store-path ../keystore/file.keystore --key-store-password Assuricare2019 --key-store-alias assuricare --key-store-alias-password Assuricare2019 --aab
            echo
            echo 'AAB Build is complete. Please find the file and manually upload to Google Play Store'
            exit;
            ;;
        "Exit")
            exit
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

check=${FILE_PATH: -4}

if test -f "$FILE_PATH"; then
    echo ""
else
    echo "The file doesn't exsit"
    exit
fi

if [ "$check" == ".ipa" ]; then
    OS="iOS"
elif [ "$check" == ".apk" ]; then
    OS="Android"
else
    echo "The file is neither a APK or IPA."
    exit
fi

echo 'Path: '$FILE_PATH
echo 'OS Type: ' $OS
echo 'Environment: ' $ENVIRONMENT
echo 'Appcenter App Name: ' $APPCENTER_APP_NAME
echo

read -p "Is this correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "The script was exitted"
    exit 1
fi

if [ "$APPCENTER_APP_NAME" == "" ]; then
    echo "Appcenter app name is blank. Please try a different one."
    exit
fi

appcenter login

appcenter apps set-current $APPCENTER_APP_NAME

# distribute release code: https://github.com/microsoft/appcenter-cli/blob/master/src/commands/distribute/release.ts
appcenter distribute release -f $FILE_PATH -g Testers -R ./release_notes.md

echo
echo 'Upload has finished.'
echo 'Uploaded new app to: ' $APPCENTER_APP_NAME

