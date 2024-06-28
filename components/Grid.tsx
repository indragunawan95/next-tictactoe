'use client'

import { DragEventHandler, useEffect, useState, useRef } from "react";

type Props = {
    handleTurn: () => void,
    handleWin: (arg: number) => void,
    playerTurn: number
}

const Grid = (props: Props) => {
    const { handleTurn, handleWin, playerTurn } = props;

    const handleInitial = (row: number) => {
        if (row === 0) {
            return 'o';
        } else if (row === 2) {
            return 'x';
        } else {
            return '';
        }
    };

    const initialGrid = Array.from({ length: 3 }, (_, rowIndex) =>
        Array.from({ length: 3 }, (_, colIndex) => {
            return {
                id: `${rowIndex}-${colIndex}`,
                content: handleInitial(rowIndex)
            };
        })
    );

    const [gridItems, setGridItems] = useState(initialGrid);
    const playerTurnRef = useRef(playerTurn);

    useEffect(() => {
        playerTurnRef.current = playerTurn;
    }, [playerTurn]);

    const handleOnDragStart: DragEventHandler = (e) => {
        const target = e.target as HTMLElement;
        e.dataTransfer.setData('text', target.id);
    };

    const handleOnDragOver: DragEventHandler = (e) => {
        e.preventDefault();
    };

    const checkAdjacentAndEmpty = (row: number, col: number, rowTarget: number, colTarget: number) => {
        const up = [row - 1, col]
        const upLeft = [row - 1, col - 1]
        const upRight = [row - 1, col + 1]
        const bottom = [row + 1, col]
        const bottomLeft = [row + 1, col - 1]
        const bottomRight = [row + 1, col + 1]
        const left = [row, col - 1]
        const right = [row, col + 1]

        const adjacents = [up, upLeft, upRight, bottom, bottomLeft, bottomRight, left, right]

        const final: number[][] = []
        // check adjacent or not
        adjacents.forEach((element: number[]) => {
            if (element[0] < 0 || element[1] < 0){
                // skip
            } else {
                final.push(element);
            }
        });

        for (let index = 0; index < final.length; index++) {
            const element = final[index];
            // check already has content or not
            if (element[0] === rowTarget && element[1] === colTarget && gridItems[rowTarget][colTarget].content === ''){
                return true;
            }
            
        }

        return false;
    }

    const getPlayerGrid = (playerTurn: number, currentGrid: {id: string, content: string}[][]) => {
        const result: number[][] = []

        const iterateGrid = (findContent: string) => {
            for (let i = 0; i < currentGrid.length; i++) {
                const row = currentGrid[i];

                for (let j = 0; j < row.length; j++) {
                    const element = currentGrid[i][j];

                    if (element.content === findContent) {
                        result.push([i, j])
                    }
                }
            }
        }
        if (playerTurn === 0){
            iterateGrid('x');
        } else {
            iterateGrid('o');
        }

        return result;
    }

    const checkWinCondition = (playerTurn: number, gridOwnByPlayer: number[][]) => {
        // diagonal top-left to bottom right
        if (gridOwnByPlayer.includes([0, 0]) && gridOwnByPlayer.includes([1, 1]) && gridOwnByPlayer.includes([2, 2])) {
            return true;
        }
        // diagonal top-right to bottom left
        else if (gridOwnByPlayer.includes([2, 0]) && gridOwnByPlayer.includes([1, 1]) && gridOwnByPlayer.includes([0, 2])) {
            return true;
        }

        const sampleRow = gridOwnByPlayer[0][0]
        const sampleColumn = gridOwnByPlayer[0][1]

        // same row except initial row for each player
        if (
            (playerTurn === 0 && sampleRow !== 2 && gridOwnByPlayer.every(([currRow, currColumn]) => currRow === sampleRow)) || 
            (playerTurn === 1 && sampleRow !== 0 && gridOwnByPlayer.every(([currRow, currColumn]) => currRow === sampleRow))
        ){
            return true;
        } 
        // same column
        else if (gridOwnByPlayer.every(([currRow, currColumn]) => currColumn === sampleColumn)){
            return true;
        }

        return false;
        
    }

    const handleOnDrop: DragEventHandler = (e) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData('text');
        const targetId = e.currentTarget.id;

        const [sourceRow, sourceCol] = sourceId.split('-').map(Number);
        const [targetRow, targetCol] = targetId.split('-').map(Number);

        
        const resultAdjacent = checkAdjacentAndEmpty(sourceRow, sourceCol, targetRow, targetCol)
        
        if (resultAdjacent){
            setGridItems((prevItems) => {
                const newItems = prevItems.map(row => row.map(item => ({ ...item })));

                const temp = newItems[sourceRow][sourceCol].content;
                newItems[sourceRow][sourceCol].content = newItems[targetRow][targetCol].content;
                newItems[targetRow][targetCol].content = temp;

                return newItems;
            });
        }
        
    };

    useEffect(() => {
        const playerGrid = getPlayerGrid(playerTurnRef.current, gridItems);
        const win = checkWinCondition(playerTurnRef.current, playerGrid)
        if (win) {
            handleWin(playerTurnRef.current)
        }
        handleTurn();
    }, [gridItems])


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="grid grid-cols-3 gap-4">
                {gridItems.flat().map((item) => (
                    <div
                        key={item.id}
                        id={item.id}
                        className="w-24 h-24 bg-blue-500 flex items-center justify-center text-white"
                        draggable={(playerTurn === 0 && item.content === 'x') || (playerTurn === 1 && item.content === 'o')}
                        onDragStart={handleOnDragStart}
                        onDragOver={handleOnDragOver}
                        onDrop={handleOnDrop}
                    >
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
