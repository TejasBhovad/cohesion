export type Page =
  | "home"
 

export type WebviewToBlockMessage = { type: "INIT" }| {
  type: "FETCH_FORM_DATA";
  payload: { postId: string };
};

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: {
    postId: string;

  };
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