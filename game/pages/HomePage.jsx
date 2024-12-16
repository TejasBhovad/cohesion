import React, { useState, useCallback, useMemo, useEffect } from 'react';

import Board from '../components/Board';
import TriesLeft from '../components/TriesLeft';
import SubmitButton from '../components/SubmitButon';
export const HomePage = ({ _data }) => {
  const initialData = useMemo(
    () => ({
      board_title: _data.gameTitle,
      clusters: [_data.wordCluster1, _data.wordCluster2, _data.wordCluster3, _data.wordCluster4],
      isValid: true,
    }),
    [_data]
  );

  const initialCells = useMemo(
    () =>
      initialData.clusters
        .flatMap((cluster) => cluster.words)
        .map((word, index) => ({
          id: index,
          word,
          isSelected: false,
          isUsed: false,
          isWrong: false, // Initialize isWrong to false
          cluster: null,
        })),
    [initialData]
  );

  const [gameState, setGameState] = useState({
    status: 'playing',
    correctClusters: [],
    cells: initialCells,
    wrongCells: [],
    triesLeft: 6,
  });

  const selectCellFn = useCallback((cellToSelect) => {
    setGameState((prev) => {
      // Prevent selection if game is over
      if (prev.status !== 'playing') return prev;

      const updatedCells = prev.cells.map((cell) => {
        if (cell.id === cellToSelect.id) {
          return { ...cell, isSelected: !cell.isSelected };
        }
        return cell;
      });

      const selectedCount = updatedCells.filter((cell) => cell.isSelected).length;

      if (selectedCount > 4) {
        return prev;
      }

      return {
        ...prev,
        cells: updatedCells,
      };
    });
  }, []);

  const submitFn = useCallback(() => {
    setGameState((prev) => {
      // Prevent submission if game is over
      if (prev.status !== 'playing') return prev;

      console.log('Submitting', prev);
      // Get selected words
      const selectedCells = prev.cells.filter((cell) => cell.isSelected);
      const selectedWords = selectedCells.map((cell) => cell.word);

      // Ensure exactly 4 words are selected
      if (selectedWords.length !== 4) return prev;

      // Create a new state object
      const newState = { ...prev };

      // Check if ALL selected words belong to an UNSELECTED cluster
      const matchingClusterIndex = initialData.clusters.findIndex(
        (cluster, index) =>
          selectedWords.length === 4 &&
          selectedWords.every((word) => cluster.words.includes(word)) &&
          // Ensure the cluster hasn't been previously selected
          !prev.correctClusters.includes(index)
      );

      if (matchingClusterIndex === -1) {
        console.log('No matching cluster found');
        // No matching cluster or cluster already selected - wrong submission
        newState.triesLeft = Math.max(0, newState.triesLeft - 1);
        newState.wrongCells = selectedCells;

        // Reset selection for incorrect attempts and mark as wrong
        newState.cells = newState.cells.map((cell) => ({
          ...cell,
          isSelected: false,
          isWrong: selectedWords.includes(cell.word), // Mark wrong cells
        }));

        // Check game over condition
        if (newState.triesLeft <= 0) {
          newState.status = 'lost';
        }

        // Set timeout to reset isWrong after 2 seconds
        setTimeout(() => {
          setGameState((prevState) => ({
            ...prevState,
            cells: prevState.cells.map(
              (cell) => ({ ...cell, isWrong: false }) // Reset isWrong to false
            ),
            wrongCells: [], // Clear wrongCells array if necessary
          }));
        }, 1500);
      } else {
        // Correct cluster found
        // Add to correct clusters
        newState.correctClusters.push(matchingClusterIndex);

        // Mark matched words as used and remove them from cells array
        newState.cells = newState.cells
          .map((cell) => {
            if (selectedWords.includes(cell.word)) {
              return { ...cell, isUsed: true, isSelected: false };
            }
            return cell;
          })
          .filter((cell) => !selectedWords.includes(cell.word));
      }

      // Check win condition after processing
      if (newState.correctClusters.length === initialData.clusters.length) {
        newState.status = 'won';
      }

      return newState;
    });
  }, [initialData]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-white">
      <div className="flex h-full max-w-5xl flex-col gap-6 p-6">
        <div className="flex w-full items-center gap-4">
          <h1 className="text-foreground flex-grow truncate text-start text-4xl font-bold capitalize">
            {initialData.board_title}
          </h1>
          <div className="col-span-full flex w-fit justify-start">
            <SubmitButton enable={true} submitFn={submitFn} />
          </div>
        </div>

        <Board
          cells={gameState.cells}
          selectCellFn={selectCellFn}
          submitFn={submitFn}
          wrongCells={gameState.wrongCells}
          correctClusters={gameState.correctClusters.map((index) => initialData.clusters[index])}
          gameStatus={gameState.status}
        />
        <TriesLeft triesLeft={gameState.triesLeft} />
      </div>
    </div>
  );
};
