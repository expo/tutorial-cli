import chalk from 'chalk';
import open from 'open';
import ora from 'ora';

import { type Input } from '.';
import { prompt } from './utils/prompts';

type Choice = {
  id: string;
  title: string;
  description: string;
  value: {
    url: string;
    title: string;
  };
};

const choices: Choice[] = [
  {
    id: '_blank',
    title: 'The fundamentals of developing an app with Expo',
    description: `A guided tutorial that walks you through the basics of creating a universal app that runs on Android, iOS and the web`,
    value: {
      url: 'https://docs.expo.dev/tutorial/',
      title: '_blank',
    },
  },
  {
    id: '_blank',
    title: 'Build and deploy your app with Expo Application Services (EAS)',
    description: `Everything you need to know to get started with EAS and build and deploy your app to the app stores`,
    value: {
      url: 'https://egghead.io/courses/build-and-deploy-react-native-apps-with-expo-eas-85ab521e',
      title: '_blank',
    },
  },
  {
    id: '_blank',
    title: 'Write native modules with Swift and Kotlin',
    description: `Learn how to add native functionality to your app using the Expo Modules API `,
    value: {
      url: 'https://docs.expo.dev/modules/native-module-tutorial/',
      title: '_blank',
    },
  },
];

export async function pickTutorial(arg: Input) {
  if (!process.stdout.isTTY) {
    await open(choices[0].value.url);
  }

  const { choice } = await prompt({
    type: 'select',
    name: 'choice',
    message: 'Pick a tutorial',
    choices,
  });

  await open(choice.url);
}
