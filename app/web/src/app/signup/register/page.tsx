import { Suspense } from "react";
import { Await, defer, useLoaderData, redirect } from "react-router-dom";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/not-found");
  }

  //data fetching
  return defer({
    data: new Promise((resolve) => {
      setTimeout(() => {
        resolve("ok");
      }, 3000);
    }),
  });
};

// function Form() {
//   const { data } = useSuspenseQuery({
//     queryKey: ["test"],
//     queryFn: async () => {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject("ok");
//         }, 1000);
//       });
//     },
//   });

//   return <div>helloworld</div>;
// }

export default function Home() {
  const { data } = useLoaderData() as { data: string };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data} errorElement={<div>Someting wrong!</div>}>
          Hello world!
        </Await>
      </Suspense>
    </div>
  );
}
