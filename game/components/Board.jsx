import React from 'react';
import BoardCell from './BoardCell';
import SubmitButton from './SubmitButon';
const Board = ({ cells, selectCellFn, submitFn, wrongCells, correctClusters = [], gameStatus }) => {
  const selectedCount = cells.filter((cell) => cell.isSelected).length;

  // Helper to check if a cell is in correct clusters
  const isInCorrectClusters = (cellId) => {
    return correctClusters.some((cluster) =>
      cluster.words.some((word) => cells.find((cell) => cell.word === word)?.id === cellId)
    );
  };

  return (
    <div className="flex max-w-5xl items-center justify-center">
      <div
        className="from-secondary/60 to-secondary/40 grid w-full grid-flow-row gap-0 rounded-xl bg-gradient-to-b shadow-lg"
        style={{ minWidth: 'min(80vw, 750px)' }}
      >
        {/* Correct Clusters Section */}
        {correctClusters.length > 0 && (
          <div className="mb-4 grid w-full grid-flow-row gap-2">
            {correctClusters.map((cluster, clusterIndex) => (
              <div
                key={clusterIndex}
                className="cluster-container group relative grid grid-cols-2 gap-4 rounded-lg bg-yellow-400/10 p-2 sm:grid-cols-4"
              >
                <div className="duration-350 bg-accent/65 absolute inset-0 z-20 m-2 flex cursor-pointer items-center justify-center rounded-md opacity-0 backdrop-blur-lg transition-opacity group-hover:opacity-100">
                  <span className="text-lg font-bold capitalize text-black">{cluster.context}</span>
                </div>
                {cluster.words.map((word, i) => (
                  <div
                    key={i}
                    className="cell-animation w-full"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <BoardCell
                      text={word}
                      isUsed={true}
                      isWrong={false} // Not applicable for correct clusters
                      isSelected={false}
                      selectCellFn={() => {}}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Main Game Board */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4">
          {cells
            .filter((cell) => !cell.isUsed && !isInCorrectClusters(cell.id))
            .map((cell) => (
              <div
                key={cell.id}
                className="cell-wrapper"
                style={{ animationDelay: `${cell.id * 100}ms` }}
              >
                <BoardCell
                  isSelected={cell.isSelected}
                  text={cell.word}
                  isUsed={cell.isUsed}
                  isWrong={wrongCells.some((wrongCell) => wrongCell.id === cell.id)} // Check if cell is in wrongCells using id
                  selectCellFn={() => selectCellFn(cell)}
                />
              </div>
            ))}
        </div>

        {/* Submit Button */}

        {/* Game Status */}
        {gameStatus === 'lost' && (
          <div className="text-destructive col-span-full mt-4 text-center text-xl font-bold">
            Game Over! You ran out of tries.
          </div>
        )}
        {gameStatus === 'won' && (
          <div className="text-primary col-span-full mt-4 text-center text-xl font-bold">
            You completed the board successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
