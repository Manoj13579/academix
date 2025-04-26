import axios from "axios";


const axiosInstance = axios.create({
  //set url here so no need to set in every axiosInstance in components
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
   /* If the response is successful, return it as it is. also helpful in google login using session that has own token and expiry(long duration). won't interfer here coz token is long lived(in backend in session cookie expiry date is one day) and in every request it will be successful request */
  (response) => {
    return response;
  },
  async (error) => {
    // Check if it's a 401 error.will get only this status from authenticateToken from backend if accessToken invalid.
    if (error.response && error.response.status === 401) {
      try {
        // Attempt to refresh token
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-request`,
          {},
          { withCredentials: true }
        );
        /*Retry the original request that failed or first request(error.config) which got error or 401. it will work if it got refresh token from await axios.post */
        return axiosInstance(error.config);
      } catch (err) {
        console.error("Refresh token request failed:", err);
        // If refresh fails (e.g., 401 or other error), reject the promise
        // navigate to login handled in components since useNavigate can't be used here
        return Promise.reject(err);
      }
    }
    /*If the error is not a 401, reject the promise with the original error.Promise.reject stops flow of async operation */
    return Promise.reject(error);
  }
);

export default axiosInstance;