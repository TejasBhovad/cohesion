import { PokemonPage } from './pages/PokemonPage';
import { HomePage } from './pages/HomePage';
import { usePage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';

const getPage = (page, { gameData }) => {
  switch (page) {
    case 'home':
      return <HomePage _data={gameData} />;

    default:
      throw new Error(`Unknown page: ${page}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const page = usePage();
  const initData = useDevvitListener('INIT_RESPONSE');
  const formFetcher = useDevvitListener('FETCH_FORM_DATA');
  const [gameData, setGameData] = useState(null);
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

  useEffect(() => {
    if (formFetcher && formFetcher.data) {
      setGameData(formFetcher.data);
    }
  }, [formFetcher]);
  if (!gameData) {
    return <div className="h-full w-full bg-[#0E0E0E]">loading</div>;
  }

  return <div className="h-full w-full bg-[#0E0E0E]">{getPage(page, { gameData: gameData })}</div>;
  // return <div className="h-full">{JSON.stringify(formFetcher)}</div>;
};
