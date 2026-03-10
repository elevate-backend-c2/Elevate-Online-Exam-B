export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function findQuestionDifficultyDecompositions(
  totalQuestions: number,
  totalPoints: number,
): [number, number, number][] {
  const decompositions: [number, number, number][] = [];
  const diff = totalPoints - totalQuestions;

  for (let count = 0; count <= totalQuestions; count++) {
    const mediumCount = diff - 2 * count;
    if (mediumCount < 0) continue;
    const easyCount = totalQuestions - mediumCount - count;
    if (easyCount >= 0) {
      decompositions.push([easyCount, mediumCount, count]);
    }
  }

  return decompositions;
}

export function areAnswersEqual(
  selectedOptions: string[],
  correctOptions: string[],
): boolean {
  if (selectedOptions.length !== correctOptions.length) return false;
  const sortedSelected = [...selectedOptions].sort();
  const sortedCorrect = [...correctOptions].sort();
  return sortedSelected.every((value, index) => value === sortedCorrect[index]);
}
