# GR-55 Editor

An experimental, unofficial patch editing app for the [Roland GR-55 guitar synthesizer](https://www.roland.com/uk/products/gr-55/).

The app is written in TypeScript, and is built with React Native and Expo for the Web, Android and iOS. It uses the Web MIDI API (via https://github.com/motiz88/react-native-midi) to send and receive patch data.

**This repo is a work in progress**. You can find links to download the app, as well as usage instructions, at https://gr55.app.

## Development setup

1. Follow the [Expo setup guide](https://docs.expo.dev/guides/local-app-development/) to install Node (required) and the tools needed to build for iOS and Android (optional, depends on your target platform).
2. Clone this repository.
3. In your local checkout, run `npm install` followed by one of `npx expo start --web`, `npx expo run:ios`, or `npx expo run:android`.
4. Once the app has started, changes you make to `.ts` and `.tsx` files will take effect immediately.

Note that the iOS Simulator and Android Emulator do not support USB/Bluetooth MIDI connections. The options for developing while connected to a real GR-55 are:

- Develop using the Web version on PC/Mac (recommended for most changes).
- Use a physical iPhone, iPad or Android device (recommended if working on iOS/Android-specific changes).
- For advanced use cases: Join a Network MIDI session from the iOS Simulator and route MIDI messages to/from your Mac's connected MIDI devices.
- For advanced use cases: Use Xcode to run the iOS app as a Mac app using Mac Catalyst (Macs with Apple silicon only).

## Acknowledgements

Major thanks to @gumtown for building the excellent [GR-55Floorboard](https://sourceforge.net/projects/grfloorboard/) without which this project would not be possible.

## More info

- [vguitarforums.com thread](https://www.vguitarforums.com/smf/index.php?topic=35164.0)
