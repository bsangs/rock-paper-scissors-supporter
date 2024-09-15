import React, { useState, useEffect } from 'react';

const moves = ['가위', '바위', '보'];

// 함수: 상대의 패력(transition probability) 계산
const calculateTransition = (history) => {
  const transition = {
    가위: { 가위: 0, 바위: 0, 보: 0 },
    바위: { 가위: 0, 바위: 0, 보: 0 },
    보: { 가위: 0, 바위: 0, 보: 0 },
  };

  for (let i = 0; i < history.length - 1; i++) {
    const current = history[i];
    const next = history[i + 1];
    transition[current][next]++;
  }

  return transition;
};

// 함수: 다음 패 예측
const predictNextMove = (history) => {
  if (history.length === 0) {
    // 초기 추천: 무작위
    return moves[Math.floor(Math.random() * 3)];
  }

  const transition = calculateTransition(history);
  const lastMove = history[history.length - 1];
  const nextMoveCounts = transition[lastMove];

  // 다음 패의 확률 계산
  const total = nextMoveCounts.가위 + nextMoveCounts.바위 + nextMoveCounts.보;
  if (total === 0) {
    // 패턴이 부족한 경우 무작위
    return moves[Math.floor(Math.random() * 3)];
  }

  // 확률이 가장 높은 패 예측
  let predictedMove = '가위';
  if (nextMoveCounts['바위'] > nextMoveCounts[predictedMove]) {
    predictedMove = '바위';
  }
  if (nextMoveCounts['보'] > nextMoveCounts[predictedMove]) {
    predictedMove = '보';
  }

  return predictedMove;
};

// 함수: 예측된 패를 이기는 패 반환
const getWinningMove = (predictedMove) => {
  switch (predictedMove) {
    case '가위':
      return '바위';
    case '바위':
      return '보';
    case '보':
      return '가위';
    default:
      return moves[Math.floor(Math.random() * 3)];
  }
};

const App = () => {
  const [opponentHistory, setOpponentHistory] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [recommendedMove, setRecommendedMove] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState([]);

  // 추천 패 업데이트
  useEffect(() => {
    const predictedMove = predictNextMove(opponentHistory);
    const winningMove = getWinningMove(predictedMove);
    setRecommendedMove(winningMove);
  }, [opponentHistory]);

  const handleOpponentMove = (inputMove) => {
    if (!moves.includes(inputMove)) {
      alert('유효한 패를 선택해주세요.');
      return;
    }

    // 추천 패
    const userMove = recommendedMove;

    // 결과 계산
    let result = '';
    if (userMove === inputMove) {
      result = '무승부';
    } else if (
      (userMove === '가위' && inputMove === '보') ||
      (userMove === '바위' && inputMove === '가위') ||
      (userMove === '보' && inputMove === '바위')
    ) {
      result = '승리';
    } else {
      result = '패배';
    }

    // 결과 저장
    const newGameResult = [...gameResult, { round: currentRound, userMove, opponentMove: inputMove, result }];
    setGameResult(newGameResult);

    // 상대 패 기록 업데이트
    const newHistory = [...opponentHistory, inputMove];
    setOpponentHistory(newHistory);

    // 다음 라운드 설정
    if (currentRound >= 10) {
      setGameOver(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleReset = () => {
    setOpponentHistory([]);
    setCurrentRound(1);
    setGameResult([]);
    setGameOver(false);
  };

  return (
    <div style={styles.container}>
      <h1>가위바위보 서포트 봇</h1>
      {!gameOver ? (
        <div style={styles.gameContainer}>
          <h2>라운드 {currentRound} / 10</h2>
          <p>다음에 낼 패 추천: <strong>{recommendedMove || '가위'}</strong></p>
          <div style={styles.buttonContainer}>
            {moves.map((move) => (
              <button
                key={move}
                onClick={() => handleOpponentMove(move)}
                style={styles.button}
              >
                {move}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.resultContainer}>
          <h2>게임 종료!</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>라운드</th>
                <th>내 패</th>
                <th>상대 패</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {gameResult.map((game) => (
                <tr key={game.round}>
                  <td>{game.round}</td>
                  <td>{game.userMove}</td>
                  <td>{game.opponentMove}</td>
                  <td>{game.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleReset} style={styles.resetButton}>다시 시작</button>
        </div>
      )}
    </div>
  );
};

// 간단한 스타일링
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  gameContainer: {
    marginTop: '20px',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  resetButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  resultContainer: {
    marginTop: '20px',
  },
  table: {
    margin: '0 auto',
    borderCollapse: 'collapse',
    width: '80%',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default App;
