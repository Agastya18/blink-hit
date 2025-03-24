import {
  ACTIONS_CORS_HEADERS, // Importing CORS headers for actions
  ActionGetResponse, // Type for GET response
  ActionPostRequest, // Type for POST request
  ActionPostResponse, // Type for POST response
  createPostResponse, // Function to create a POST response
} from "@solana/actions";


import {
  Connection, // Class for Solana network connection
  LAMPORTS_PER_SOL, // Constant for lamports to SOL conversion
  PublicKey, // Class for handling public keys
  SystemProgram, // System program for basic transactions
  Transaction, // Class for creating transactions
  clusterApiUrl, // Function to get cluster API URL
} from "@solana/web3.js";

 

export async function GET(request: Request) {
  const url = new URL(request.url); // Parse the request URL
 console.log("rreqqq",request);
  console.log(url);

  const slug = url.searchParams.get("events"); // Get the event parameter from the URL
  console.log(slug)

  

  async function getEvent(id) {
    const resp = await fetch(`https://dev.api.verolabs.xyz/api/v1/product/public/events/${id}`)
    const data = await resp.json()
    return data
  }

  let event

  if (slug==="trade-on-this-to-test-new-tokens-9a"){

    event = await getEvent(16)

  }else if(slug==="trade-test-2-7z"){
    event = await getEvent(17)
  }else{
    event = await getEvent(16)
  }



  const payload: ActionGetResponse = {
    // Define the GET response payload
    icon:event.data.image_url,
    description:event.data.expiry_date,
    title: event.data.display_name,
    label: event.data.name,
    links: {
      actions: [
        {
          label: event.data.button_text_yes, // Action label
          // href: `/api/actions/bet?choice=yes`, // Action URL with amount parameter
          href: url.href+`&choice=yes`,
        },
        {
          label:event.data.button_text_no, // Action label
          // href: `/api/actions/bet?choice=no`, // Action URL with amount parameter
          href: url.href+`&choice=no`,
        },
      ],
    },
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS, // Set CORS headers
  });
}

export const OPTIONS = GET; // Allow OPTIONS request to use GET handler

export async function POST(request: Request) {
  const body: ActionPostRequest = await request.json(); // Parse the request body
  console.log(body);
  
  const userPub= body.account;
//  console.log(request);

  const url = new URL(request.url); // Parse the request URL
  const c= url.searchParams.get("choice"); 
  // Get the choice parameter from the URL
 // console.log(c);

  const  e= url.searchParams.get("events");
 // console.log("val of e",e);



  const  sender = new PublicKey(body.account);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // Create a connection to the mainnet-beta cluster

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey:sender, // Sender public key
      toPubkey: new PublicKey("8QmrmTiGQt5ed7cd7QBzfSWpe3FjpZw3wkUrR6riG8pU"), // Recipient public key
      lamports: 0.1 * LAMPORTS_PER_SOL, // Amount to transfer in lamports
    })
  );
  transaction.feePayer = sender; // Set the fee payer
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash; // Get the latest blockhash
  transaction.lastValidBlockHeight = (
    await connection.getLatestBlockhash()
  ).lastValidBlockHeight; // Get the last valid block height

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      transaction, // Add the transaction to the response payload
      message: `You choose ${c} for ${e} . transaction confirmed.`,
    },
  });
  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS, // Set CORS headers
  });
}
