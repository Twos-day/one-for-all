import { toast } from "sonner";
import { useModalStore, useSetModalStore } from "../_lib/modalStore";
import AlertModal from "../_component/modal/AlertModal";

export default function Home() {
  const modalStore = useSetModalStore();

  const onClick = async () => {
    toast.success("클릭했어요!");
    await modalStore.push(AlertModal, {});
  };

  return (
    <div>
      Hello world!
      <div>
        <button onClick={onClick}>클릭!!</button>
      </div>
    </div>
  );
}
