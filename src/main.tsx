import { Devvit, useState } from '@devvit/public-api';
import { DEVVIT_SETTINGS_KEYS } from './constants.js';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { getPokemonByName } from './core/pokeapi.js';
import { data } from 'framer-motion/client';

Devvit.addSettings([
  {
    name: DEVVIT_SETTINGS_KEYS.SECRET_API_KEY,
    label: 'API Key for secret things',
    type: 'string',
    isSecret: true,
    scope: 'app',
  },
]);

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

const nameForm = Devvit.createForm(
  {
    fields: [{ name: 'name', label: 'Name', type: 'string' }],
    title: 'Enter Name',
    acceptLabel: 'Next',
  },
  (event, context) => {
    const name = event.values.name;
    context.ui.showForm(descriptionForm, { name });
  }
);

const descriptionForm = Devvit.createForm(
  (data) => ({
    fields: [
      {
        name: 'description',
        label: 'Description',
        type: 'paragraph',
      },
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        defaultValue: data.name,
        isSecret: true,
        disabled: true,
        scope: 'app',
      },
    ],
    title: `Enter Description for ${data.name}`,
    acceptLabel: 'Create Post',
  }),
  async (event, context) => {
    console.log('Received event', event);

    const name = event.values.name; // Change this line
    const description = event.values.description;
    const { reddit, ui } = context;

    if (!name) {
      ui.showToast({ text: 'Error: Name is missing' });
      return;
    }

    const post = await reddit.submitPost({
      title: 'My first experience post',
      subredditName: (await reddit.getCurrentSubreddit()).name,
      preview: <Preview />,
    });

    await context.redis.set(`post:${post.id}:data`, JSON.stringify({ name, description }));

    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post.url);
  }
);
Devvit.addMenuItem({
  label: 'Create Multi-stage Post',
  location: 'subreddit',
  onPress: (_, context) => {
    context.ui.showForm(nameForm);
  },
});

// Add a custom post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (context) => {
    const [launched, setLaunched] = useState(false);

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}
            onMessage={async (event) => {
              console.log('Received message', event);
              const data = event as unknown as WebviewToBlockMessage;

              switch (data.type) {
                case 'INIT':
                  // Send name and description stored in context
                  sendMessageToWebview(context, {
                    type: 'INIT_RESPONSE',
                    payload: {
                      postId: context.postId!,
                    },
                  });
                  break;
                case 'GET_POKEMON_REQUEST':
                  context.ui.showToast({ text: `Received message: ${JSON.stringify(data)}` });
                  const pokemon = await getPokemonByName(data.payload.name);

                  sendMessageToWebview(context, {
                    type: 'GET_POKEMON_RESPONSE',
                    payload: {
                      name: pokemon.name,
                      number: pokemon.id,
                    },
                  });
                  break;
                case 'FETCH_FORM_DATA':
                  context.ui.showToast({ text: `Received message: ${JSON.stringify(data)}` });
                  const storedData = await context.redis.get(`post:${data.payload.postId}:data`);
                  console.log('Fetched stored data', storedData);
                  if (!storedData) {
                    console.error(`No data found for post ID: ${data.payload.postId}`);
                    sendMessageToWebview(context, {
                      type: 'FETCH_FORM_DATA_ERROR',
                      payload: {
                        error: 'No data found',
                      },
                    });
                    return;
                  }
                  const { name, description } = JSON.parse(storedData);
                  console.log('Fetched form data', name, description);
                  sendMessageToWebview(context, {
                    type: 'FETCH_FORM_DATA',
                    payload: {
                      name,
                      description,
                    },
                  });
                  break;

                default:
                  console.error('Unknown message type', data satisfies never);
                  break;
              }
            }}
          />
        ) : (
          <button
            onPress={() => {
              setLaunched(true);
            }}
          >
            Launch
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
