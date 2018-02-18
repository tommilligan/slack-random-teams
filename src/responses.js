/**
 * Returns options for arequest JSON POST response
 * @param {String} url 
 * @param {Object} body 
 */
export const response = (url, body) => {
  const responseOptions = {
    method: 'POST',
    uri: url,
    body: body,
    json: true
  };
  return responseOptions;
};

/**
 * Returns a closure for generating multiple JSON POST requests to the same URL
 * @param {String} url 
 */
export const delayedResponder = url => {
  const delayedResponse = body => {
    return response(url, body);
  };
  return delayedResponse;
};
