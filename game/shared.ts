export type Page =
  | "home"
  | "pokemon";

export type WebviewToBlockMessage = { type: "INIT" } | {
  type: "GET_POKEMON_REQUEST";
  payload: { name: string };
} | {
  type: "FETCH_FORM_DATA";
  payload: { postId: string };
};

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: {
    postId: string;

  };
} | {
  type: "GET_POKEMON_RESPONSE";
  payload: { number: number; name: string; error?: string };
} 
|
{
  type: "FETCH_FORM_DATA";
  payload: { data: string };
} |
{
  type: "FETCH_FORM_DATA_ERROR";
  payload: { error: string };
}

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};