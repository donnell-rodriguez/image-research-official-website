import React from "react";

const emptyIndex = { pages: [], posts: [] };
const jsonCache = new Map();

async function fetchJson(path) {
  if (!path) return null;
  if (jsonCache.has(path)) return jsonCache.get(path);

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }

  const json = await response.json();
  jsonCache.set(path, json);
  return json;
}

function useJson(path, fallback = null) {
  const [state, setState] = React.useState(() => ({
    data: jsonCache.get(path) || fallback,
    isLoading: Boolean(path) && !jsonCache.has(path),
    error: null,
  }));

  React.useEffect(() => {
    let active = true;
    if (!path) {
      setState({ data: fallback, isLoading: false, error: null });
      return undefined;
    }

    setState((current) => ({
      data: jsonCache.get(path) || current.data || fallback,
      isLoading: !jsonCache.has(path),
      error: null,
    }));

    fetchJson(path)
      .then((data) => {
        if (active) setState({ data, isLoading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: fallback, isLoading: false, error });
      });

    return () => {
      active = false;
    };
  }, [path, fallback]);

  return state;
}

export function useSiteIndex() {
  return useJson("/content/site-index.json", emptyIndex);
}

export function usePosts() {
  const { data = emptyIndex, ...query } = useSiteIndex();
  return { data: data.posts, ...query };
}

export function usePost(slug) {
  return useJson(slug ? `/content/posts/${slug}.json` : null, null);
}

export function usePage(slug) {
  return useJson(slug ? `/content/pages/${slug}.json` : null, null);
}
