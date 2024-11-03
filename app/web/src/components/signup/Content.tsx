import { SIGNUP_EMAIL_PAGE_VALUES, useSignupEmailStore } from "@/stores/signup";
import EmailConfirm from "@/components/signup/EmailConfirm";
import SignupForm from "@/components/signup/SignupForm";
import Verification from "@/components/signup/Verification";

export default function Content() {
  const page = useSignupEmailStore((store) => store.page);

  let content: JSX.Element;
  switch (page) {
    case SIGNUP_EMAIL_PAGE_VALUES.EMAIL:
      content = <SignupForm />;
      break;
    case SIGNUP_EMAIL_PAGE_VALUES.EMAIL_CONFIRM:
      content = <EmailConfirm />;
      break;
    case SIGNUP_EMAIL_PAGE_VALUES.VERIFICATION:
      content = <Verification />;
      break;
    default:
      content = <SignupForm />;
  }
  return content;
}
