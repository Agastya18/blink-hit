import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";
// import Cors from 'cors';

// const cors = Cors({
//   origin: '*', // Allow all origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
// });
export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // map all root level routes to an action
      {
        pathPattern: "/events/*",
         apiPath: "/api/actions/bet?events=*"
      },
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;
