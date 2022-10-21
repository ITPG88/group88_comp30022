import request from 'request'
/**
 * Retrieves the HTML source code for a given URL.
 * @param url The url to retrieve the HTML source code for
 */

export const getHTML = async (url: string): Promise<string> => {
  // Sets up request so it uses a browser-like user agent
  const options = {
    headers: {
      'User-Agent':
          // tslint:disable-next-line:max-line-length
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    }
  }
  const customHeaderRequest = request
  return await new Promise((resolve, reject) => {
    // Attempt to retrieve HTML
    customHeaderRequest.get(url, options, (error: any, response: any, body: any) => {
      // If error, pass to promise reject
      if (error as boolean) {
        reject(error)
      }
      // Send back HTML if successful
      resolve(body)
    })
  })
}
