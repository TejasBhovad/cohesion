import { ComponentProps, useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { cn } from '../utils';

export const HomePage = ({ _data }) => {
  const setPage = useSetPage();

  const data = {
    board_title: _data.gameTitle,
    clusters: [
      _data.wordCluster1, _data.wordCluster2, _data.wordCluster3, _data.wordCluster4
    ],
    isValid: true,
  };

  const { gameState, setGameState } = useState({
    status: 'playing', // 'playing', 'won', 'lost'
    correctClusters: [],
    cells: data.clusters
        .flatMap((cluster) => cluster.words)
        .map((word) => ({
            word,
            isSelected: false,
            isUsed: false,
            cluster: null
        })),
    wrongCells: [],
    triesLeft: 6
  });

  const shuffleBoardFn = () => {
    gameState.cells = gameState.cells
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const submitFn = () => {
    const selectedWords = gameState.cells
      .filter((cell) => cell.isSelected)
      .map((cell) => cell.word);
    let clusterIndex = -1;

    // Find a matching cluster
    for (let i = 0; i < data.clusters.length; i++) {
      if (gameState.correctClusters.includes(i)) {
        continue;
      }
      if (
        selectedWords.filter((word) => data.clusters[i].words.includes(word)).length === 4
      ) {
        clusterIndex = i;
        gameState.correctClusters.push(i);
        break;
      }
    }

    // If no matching cluster is found
    if (clusterIndex === -1) {
      gameState.triesLeft--;
      gameState.wrongCells = gameState.cells.filter((cell) => cell.isSelected);
    } else {
      // Correct cluster found
      for (let i = 0; i < gameState.cells.length; i++) {
        if (gameState.cells[i].isSelected) {
          gameState.cells[i].isUsed = true;
          gameState.cells[i].cluster = clusterIndex;
        }
      }
      toast.success(data.clusters[clusterIndex].context);
  }

    // Win condition
    if (gameState.cells.every((cell) => cell.isUsed)) {
      handleGameWin();
      handleGamePlay();
    }

    // Deselect all cells after submission
    gameState.cells.forEach((cell) => (cell.isSelected = false));
  };

  const selectCellFn = (index) => {
    if (gameState.cells[index].isUsed || gameState.status !== 'playing') {
      return;
    }

    if (!gameState.cells[index].isSelected) {
      if (gameState.cells.reduce((acc, cell) => acc + cell.isSelected, 0) >= 4) {
          return;
      }
      gameState.cells[index].isSelected = true;
    } else {
      gameState.cells[index].isSelected = false;
    }
  };

  return (
    <div class="h-full">
      {JSON.stringify(data)}
      {/* <h1 class="px-4 py-6 text-start text-4xl font-bold capitalize text-foreground">
        {data.board_title}
      </h1>
      <BoardHeader
        shuffleBoardFn={shuffleBoardFn}
        submitFn={submitFn}
        submitEnable={gameState.status === 'playing' &&
          gameState.cells.reduce((acc, cell) => acc + cell.isSelected, 0) === 4}
      />
      <Board
        cells={gameState.cells}
        selectCellFn={selectCellFn}
        wrongCells={gameState.wrongCells}
        correctClusters={gameState.correctClusters.map((index) => data.clusters[index])}
        gameStatus={gameState.status}
      />
      <TriesLeft triesLeft={gameState.triesLeft} totalTries={6} /> */}
    </div>
  );
};
