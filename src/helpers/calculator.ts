const ALGERIA_FIRST_ROOF = 150000;
const ALGERIA_SECOND_ROOF = 500000;
const ALGERIA_THIRD_ROOF = 1000000;
export const algeriaCost = (value: number) => {
  let cost = 0;
  if (value >= 0  && value <= ALGERIA_FIRST_ROOF) {
    cost = 500;
  }
  if (value > ALGERIA_FIRST_ROOF && value <= ALGERIA_SECOND_ROOF) {
    cost = 600;
  }
  if (value > ALGERIA_SECOND_ROOF && value <= ALGERIA_THIRD_ROOF) {
    cost = 700;
  }
  if (value > ALGERIA_THIRD_ROOF) {
    cost = 900;
  }
  return cost;
}