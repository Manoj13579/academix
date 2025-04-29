import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* Refresh Queue Setup. if more than one api call from useEffect using functions  useEffect(() => {
      userEnrolledCourses();
      getUserCourseProgress();
    }, []); both will execute independently. one will not wait for other to finish. axiosInstance need to handle refresh token as it will make another refreshRequest without finishing first and first already creates new refresh token in database so second will throw error. Refresh token should only be used once! Not twice in parallel for one component mount

    You need to serialize the refresh operation — i.e., make sure only one refresh happens at a time even if multiple requests fail simultaneously coz of expired access token. two axiosInstance in above useEffect will throw two 401 error but 1 refresh request need to be send.
    isRefreshing = true when a refresh is happening.
   While refresh is happening, if any other request gets 401, it waits (does not trigger another /refresh-request).
  After refresh succeeds: It resends all requests waiting that is other api call to backend not  refresh request.refresh-request will only be sent once


this makees request wait
if (isRefreshing) {
  // Don't send another /refresh-request, just wait
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then(() => {
    return axiosInstance(originalRequest); // Retry after refresh
  });
}
Only the first request that sees 401 and !isRefreshing triggers the actual POST /refresh-request.
The second request, which comes while the first is still refreshing, sees that isRefreshing === true, so it:
Does not make another refresh request
Just waits in failedQueue.Will automatically retry after the first refresh finishes
*/

//indicate whether a token refresh request is in progress.
let isRefreshing = false;
/* if js it will be let failedQueue = [];
A queue to hold failed requests while a token is being refreshed.
Each queue item is an object with resolve and reject to handle the Promise associated with each request. 
failedQueue does not hold actual HTTP requests (like http://localhost:4000/api/get-all-courses) themselves. It only stores the resolve and reject handlers from Promises — not the original request configs or URLs.

However, it's used to control what happens to those requests once a token refresh completes or fails, usually by wrapping each failed request in a Promise and then pushing that Promise's resolve/reject into failedQueue. */
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

/* Handles all queued requests: If a refresh failed, reject all queued requests with the error. If refresh succeeded, resolve all requests so they can retry. */

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ---- Axios response interceptor ----
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and originalRequest has not retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh already happening, push request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // After refresh done, retry original request
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
/* If a refresh is already in progress, the request is queued to be retried once the refresh completes.
      originalRequest._retry = true;
      isRefreshing = true;
Marks the request as retried to prevent loops.Sets isRefreshing to true to prevent other refresh attempts.
 */
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try refresh token
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-request`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        /*If the refresh is successful:
Process the queue with no error.
Retry the original failed request.
If refresh fails:
Reject all queued requests.
Reject the current request.
Regardless of outcome, reset isRefreshing to false.*/
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
// If the error is not a 401 or already retried, just reject it.
/* navigate to login handled in components since useNavigate can't be used here. works too if refreshed token expired take user to login */
    return Promise.reject(error);
  }
);

export default axiosInstance;