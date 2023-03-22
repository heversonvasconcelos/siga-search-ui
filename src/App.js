import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  Paging,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
  getFacetFields
} from "./config/config-helper";

const { host, index } = getConfig();
const connector = new ElasticsearchAPIConnector({
  host,
  index,
});

const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig()
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      autocompleteSuggestions={false}
                      inputView={({ getInputProps, getButtonProps }) => (
                        <>
                          <div className="sui-search-box__wrapper">
                            <input
                              {...getInputProps({
                                placeholder: "Pesquisar documentos"
                              })}
                            />
                          </div>
                          <input
                            {...getButtonProps({
                              value: "Pesquisar"
                            })}
                          />
                        </>
                      )}
                    />
                  }
                  sideContent={
                    <div>
                      {getFacetFields().map(field => (
                        <Facet key={field.key} field={field.key} label={field.label} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      shouldTrackClickThrough={false}
                    />
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
