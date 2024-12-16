import { PokemonPage } from './pages/PokemonPage';
import { HomePage } from './pages/HomePage';
import { usePage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';

const getPage = (page, { postId }) => {
  switch (page) {
    case 'home':
      return (
        <HomePage
          data={{
            'data': {
              'gameTitle': 'hello wordl',
              'gameDescription': 'fgjfgvj',
              'wordCluster1': { 'context': 'f', 'words': ['sdf', 'sd', 'sf', 'sfs'] },
              'wordCluster2': { 'context': 'sgsgsg', 'words': ['sgsgs', 'sgs', 's', 'gsg'] },
              'wordCluster3': { 'context': 'sggsg', 'words': ['sgsgsg', 'sgsg', 'sgsg', 'sgsgsg'] },
              'wordCluster4': {
                'context': 'ssgsgg',
                'words': ['dgdgdg', 'dgdgdg', 'dgdgd', 'dgdgdg'],
              },
            },
          }}
        />
      );

    default:
      throw new Error(`Unknown page: ${page}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const page = usePage();
  const initData = useDevvitListener('INIT_RESPONSE');
  const formFetcher = useDevvitListener('FETCH_FORM_DATA');
  const handleFetchData = async () => {
    // Only run if we have a postId
    if (postId) {
      sendToDevvit({
        type: 'FETCH_FORM_DATA',
        payload: { postId },
      });
    }
  };
  // Send INIT message when component mounts
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  // Update postId when initData changes
  useEffect(() => {
    if (initData && initData.postId) {
      setPostId(initData.postId);
      console.log('Received initData:', initData);
    }
  }, [initData]);

  useEffect(() => {
    // Only run if we have a postId
    if (postId) {
      handleFetchData();
    }
  }, [postId]);

  return <div className="h-full">{getPage(page, { postId })}</div>;
  // return <div className="h-full">{JSON.stringify(formFetcher)}</div>;
};
