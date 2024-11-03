import { useTypingStore } from "@/stores/typing";
import Letter from "./Letter";

type LetterLineProps = {
  LETTERS_ARR: string[];
};

export default function LetterLine({ LETTERS_ARR }: LetterLineProps) {
  const row = useTypingStore((store) => store.typedRows);
  const letters = LETTERS_ARR[row] || "";

  return (
    <div>
      {letters.split("").map((s, i) => (
        <Letter key={[letters, i].join("_")} value={s} answer={s} />
      ))}
    </div>
  );
}
