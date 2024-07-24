"use client";

import { SIGNUP_EMAIL_PAGE_VALUES, useSignupEmailStore } from "../_lib/store";
import EmailConfirm from "../_component/EmailConfirm";
import SignupForm from "../_component/SignupForm";
import Verification from "../_component/Verification";

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
