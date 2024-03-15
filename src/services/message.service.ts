import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { callExternalApi } from "./external-api.service";

const apiServerUrl = `http://localhost:3000`;

export const getAPIRoute = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getPublicResource = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getProtectedResource = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getAdminResource = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const postMessage = async (messageData: Record<string, any>, accessToken: string): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/messages`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`, // Include the access token in the Authorization header
    },
    data: messageData,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};
