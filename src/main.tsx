import { Devvit, useState } from '@devvit/public-api';
import { DEVVIT_SETTINGS_KEYS } from './constants.js';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { getPokemonByName } from './core/pokeapi.js';

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

const createWordForm = (formNumber: number) =>
  Devvit.createForm(
    (data) => ({
      fields: [
        { name: 'context', label: `Context ${formNumber}`, type: 'paragraph' },
        { name: 'word1', label: 'Word 1', type: 'string' },
        { name: 'word2', label: 'Word 2', type: 'string' },
        { name: 'word3', label: 'Word 3', type: 'string' },
        { name: 'word4', label: 'Word 4', type: 'string' },
        {
          name: 'allData',
          label: 'All Data',
          type: 'string',
          disabled: true,
          defaultValue: data.allData,
        },
      ],
      title: `Word Form ${formNumber}`,
      acceptLabel: formNumber === 4 ? 'Create Post' : 'Next',
    }),
    (event, context) => {
      console.log(`Form ${formNumber} submitted:`, event.values);
      const allData = JSON.parse(event.values.allData);
      allData[`wordCluster${formNumber}`] = {
        context: event.values.context,
        words: [event.values.word1, event.values.word2, event.values.word3, event.values.word4],
      };

      if (formNumber < 4) {
        context.ui.showForm(wordForms[formNumber], { allData: JSON.stringify(allData) });
      } else {
        createPost(allData, context);
      }
    }
  );

const wordForms = [createWordForm(1), createWordForm(2), createWordForm(3), createWordForm(4)];

const initialForm = Devvit.createForm(
  {
    fields: [
      { name: 'gameTitle', label: 'Game Title', type: 'string' },
      { name: 'gameDescription', label: 'Game Description (Optional)', type: 'paragraph' },
    ],
    title: 'Game Information',
    acceptLabel: 'Next',
  },
  (event, context) => {
    console.log('Initial form submitted:', event.values);
    const initialData = {
      gameTitle: event.values.gameTitle,
      gameDescription: event.values.gameDescription,
    };
    context.ui.showForm(wordForms[0], { allData: JSON.stringify(initialData) });
  }
);

async function createPost(data: any, context: any) {
  const { reddit, ui, redis } = context;
  console.log('All form data:', data);

  const post = await reddit.submitPost({
    title: data.gameTitle,
    subredditName: (await reddit.getCurrentSubreddit()).name,
    preview: <Preview />,
  });

  await redis.set(`post:${post.id}:data`, JSON.stringify(data));
  console.log('Data stored in Redis for post:', post.id);

  ui.showToast({ text: 'Created post!' });
  ui.navigateTo(post.url);
}

Devvit.addMenuItem({
  label: 'Create Multi-level Game Post',
  location: 'subreddit',
  onPress: (_, context) => {
    context.ui.showForm(initialForm);
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
                  const parsedData = JSON.parse(storedData);
                  console.log('Fetched form data', parsedData);
                  sendMessageToWebview(context, {
                    type: 'FETCH_FORM_DATA',
                    payload: {
                      data: parsedData,
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
