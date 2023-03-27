import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Result,
  Results,
  Paging,
  PagingInfo,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
  getFacetFields,
  getResultFields
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

const CustomResultView = ({
  result
}) => {
  return (
    <li className="sui-result">
      <div className="sui-result__header">
        {result.title && !result.url && (
          <span
            className="sui-result__title"
            dangerouslySetInnerHTML={{ __html: result.code.raw }}
          />

        )}
        {result.title && result.url && (
          <a
            className="sui-result__title sui-result__title-link"
            dangerouslySetInnerHTML={{ __html: result.code.raw }}
            href={result.url.raw}
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
      </div>

      <div className="sui-result__body">
        <ul className="sui-result__details">
          {getResultFields().map(
            (field) => (
              <li key={field.key}>
                <span className="sui-result__key">{field.label}</span>
                {result[field.key] &&
                  (result[field.key].snippet && (
                    <span
                      className="sui-result__value"
                      dangerouslySetInnerHTML={{ __html: result[field.key].snippet }}
                    />
                  )) ||
                  (result[field.key].raw && (
                    <span
                      className="sui-result__value"
                      dangerouslySetInnerHTML={{ __html: result[field.key].raw }}
                    />
                  ))
                }
              </li>
            )
          )}
        </ul>
      </div>
    </li>
  );
}

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched, results }) => ({ wasSearched, results })}>
        {({ wasSearched, results }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchBox
                      searchAsYouType={false}
                      debounceLength={500}
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
                    <Results resultView={CustomResultView} />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched &&
                        <PagingInfo
                          view={({ start, end, searchTerm, totalResults }) => (
                            <div className="sui-paging-info">
                              Resultados{" "}
                              <strong>
                                {start} - {end}
                              </strong>{" "}
                              total de <strong>{totalResults}</strong>
                              {searchTerm && (
                                <>
                                  {" "}
                                  com termo: <em>{searchTerm}</em>
                                </>
                              )}
                            </div>
                          )}
                        />
                      }
                    </React.Fragment>
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
