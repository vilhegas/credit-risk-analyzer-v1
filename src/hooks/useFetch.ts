"use client";

import { useCallback, useState } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type FetchOptions = {
  headers?: Record<string, string>;
};

export function useFetch<T = any>(baseHeaders: Record<string, string> = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (url: string, options: RequestInit = {}, extra?: FetchOptions) => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...baseHeaders,
            ...(extra?.headers ?? {}),
            ...(options.headers ?? {}),
          },
        });

        const contentType = res.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");

        const body = isJson ? await res.json() : await res.text();

        if (!res.ok) {
          const message =
            (isJson && body?.message) ||
            (typeof body === "string" && body) ||
            `HTTP ${res.status}`;
          throw new Error(message);
        }

        setState({
          data: body as T,
          loading: false,
          error: null,
        });

        return body as T;
      } catch (err: any) {
        setState({
          data: null,
          loading: false,
          error: err?.message ?? "Erro na requisição",
        });
        throw err;
      }
    },
    [baseHeaders]
  );

  const get = useCallback(
    (url: string, headers?: FetchOptions["headers"]) =>
      request(url, { method: "GET" }, { headers }),
    [request]
  );

  const post = useCallback(
    (url: string, data?: any, headers?: FetchOptions["headers"]) =>
      request(
        url,
        {
          method: "POST",
          body: data !== undefined ? JSON.stringify(data) : undefined,
        },
        { headers }
      ),
    [request]
  );

  const put = useCallback(
    (url: string, data?: any, headers?: FetchOptions["headers"]) =>
      request(
        url,
        {
          method: "PUT",
          body: data !== undefined ? JSON.stringify(data) : undefined,
        },
        { headers }
      ),
    [request]
  );

  const del = useCallback(
    (url: string, headers?: FetchOptions["headers"]) =>
      request(url, { method: "DELETE" }, { headers }),
    [request]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    request,
    get,
    post,
    put,
    del,
    reset,
  };
}