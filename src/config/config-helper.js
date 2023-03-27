import config from "../config/index.json";

/**
 * This file abstracts most logic around the configuration of the Reference UI.
 *
 * Configuration is an important part of the "reusability" and "generic-ness" of
 * the Reference UI, but if you are using this app as a starting point for own
 * project, everything related to configuration can largely be thrown away. To
 * that end, this file attempts to contain most of that logic to one place.
 */

export function getConfig() {
  if (process.env.NODE_ENV === "test") {
    return {};
  }

  if (config.index) return config;

  if (
    typeof window !== "undefined" &&
    window.appConfig &&
    window.appConfig.index
  ) {
    return window.appConfig;
  }

  return {};
}

function toLowerCase(string) {
  if (string) return string.toLowerCase();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getTitleField() {
  // If no title field configuration has been provided, we attempt
  // to use a "title" field, if one exists
  return getConfig().titleField || "title";
}

export function getUrlField() {
  return getConfig().urlField;
}

export function getThumbnailField() {
  return getConfig().thumbnailField;
}

export function getResultFields() {
  return getConfig().resultFields || [];
}

export function getFacetFields() {
  return getConfig().facets || [];
}

export function getSearchFields() {
  return getConfig().searchFields || [];
}

export function getSortFields() {
  return getConfig().sortFields || [];
}

export function getResultTitle(result) {
  const titleField = getTitleField();

  return result.getSnippet(titleField);
}

export function buildSearchOptionsFromConfig() {
  const config = getConfig();
  const searchFields = (getSearchFields() || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n] = {};
      return acc;
    },
    undefined
  );

  const resultFields = (getResultFields() || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n.key] = {
        raw: {},
        snippet: {
          size: 100,
          fallback: true
        }
      };
      return acc;
    },
    undefined
  );

  // We can't use url, thumbnail, or title fields unless they're actually
  // in the reuslts.
  if (config.urlField) {
    resultFields[config.urlField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    };
  }

  if (config.thumbnailField) {
    resultFields[config.thumbnailField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    };
  }

  if (config.titleField) {
    resultFields[config.titleField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    };
  }

  const searchOptions = {};
  searchOptions.result_fields = resultFields;
  searchOptions.search_fields = searchFields;
  return searchOptions;
}

export function buildFacetConfigFromConfig() {
  const config = getConfig();

  const facets = (getFacetFields() || []).reduce((acc, n) => {
    acc = acc || {};
    acc[n.key] = {
      type: "value",
      size: 100
    };
    return acc;
  }, undefined);

  return facets;
}

export function buildSortOptionsFromConfig() {
  const config = getConfig();
  return [
    ...(config.sortFields || []).reduce((acc, sortField) => {
      acc.push({
        name: `${capitalizeFirstLetter(sortField)} ASC`,
        value: sortField,
        direction: "asc"
      });
      acc.push({
        name: `${capitalizeFirstLetter(sortField)} DESC`,
        value: sortField,
        direction: "desc"
      });
      return acc;
    }, [])
  ];
}

export function buildAutocompleteQueryConfig() {
  const querySuggestFields = getConfig().querySuggestFields;
  if (
    !querySuggestFields ||
    !Array.isArray(querySuggestFields) ||
    querySuggestFields.length === 0
  ) {
    return {};
  }

  return {
    suggestions: {
      types: {
        documents: {
          fields: getConfig().querySuggestFields
        }
      }
    }
  };
}
