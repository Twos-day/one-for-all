import classNames from "classnames";

type LetterProps = {
  value: string;
  answer: string | undefined;
};

/**
 * 글자 하나에 대해서 정답과 비교하여 표시하는 컴포넌트
 *
 * 맞으면 빨간색으로 표시
 *
 * 입력되지 않으면 회색
 *
 * 정답이면 검정색
 */
export default function Letter({ value, answer }: LetterProps) {
  const isCorrect = value === answer;
  const isEmpty = value === "";
  return (
    <span
      className={classNames({
        empty: isEmpty,
        correct: isCorrect,
        wrong: !isEmpty && !isCorrect,
      })}
    >
      {value}
    </span>
  );
}
