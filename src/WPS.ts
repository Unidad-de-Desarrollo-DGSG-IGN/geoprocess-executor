export interface WPS {
  getForm(): HTMLElement; 
  execute(inputParameters: JSON): Promise<JSON>; 
}
