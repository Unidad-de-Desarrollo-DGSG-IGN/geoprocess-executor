export default interface Postman {
  post(url: string, content: string): Promise<JSON>;
  get(url: string): Promise<JSON>;
}
