import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* Refresh Queue Setup. if more than one api call from useEffect using functions  useEffect(() => {
      userEnrolledCourses();
      getUserCourseProgress();
    }, []); both will execute independently. one will not wait for other to finish. axiosInstance need to handle refresh token as it will make another refreshRequest without finishing first and first already creates new refresh token in database so second will throw error. Refresh token should only be used once! Not twice in parallel.

    You need to serialize the refresh operation — i.e., make sure only one refresh happens at a time even if multiple requests fail simultaneously. two axiosInstance in above useEffect will throw two 401 error but 1 refresh request need to be send. when refresh request gets new token no 401 error n both request now proceed.
    isRefreshing = true when a refresh is happening.
   While refresh is happening, if any other request gets 401, it waits (does not trigger another /refresh-request).
  After refresh succeeds: It resends all requests waiting.


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

/* Flag to indicate whether a token refresh request is in progress.
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];
A queue to hold failed requests while a token is being refreshed.
Each queue item is an object with resolve and reject to handle the Promise associated with each request

*/
let isRefreshing = false;
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