const apiRequest = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const config = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, config);

  if (response.status === 401 && !options._retry) {
    const refreshResult = await refreshToken();

    if (refreshResult.success) {
      options._retry = true;
      return apiRequest(url, options);
    } else {
      if (refreshResult.needsVerification) {
        return response;
      }
      return response;
    }
  }

  if (response.status === 403) {
    try {
      const data = await response.clone().json();
      if (data.verified === false) {
        logout();
        response.needsVerification = true;
      }
    } catch (e) {
      // ignore
    }
  }

  return response;
};

export default apiRequest;
