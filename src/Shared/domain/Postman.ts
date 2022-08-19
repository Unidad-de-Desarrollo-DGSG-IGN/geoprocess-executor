export default interface Postman {
  post(url: string, content: string): Promise<JSON>;
  postReturningBlob(url: string, content: string): Promise<Blob>;
  get(url: string): Promise<JSON>;
}
