import { Suspense } from "react";
import Loader from "@/app/components/Common/Loader";
import ResetPassword from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPassword />
    </Suspense>
  );
}
