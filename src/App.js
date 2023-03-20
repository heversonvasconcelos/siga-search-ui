import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields
} from "./config/config-helper";

const { host, index} = getConfig();
const connector = new ElasticsearchAPIConnector({
  host,
  index,
});

const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig()
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
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
                  header={<SearchBox autocompleteSuggestions={true} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map(field => (
                        <Facet key={field} field={field} label={field} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().thumbnailField}
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
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

// const config = {
//   searchQuery: {
//     search_fields: {
//       title: {},
//     },
//     result_fields: {
//       title: {
//         snippet: {}
//       },
//       code: {
//         snippet: {}
//       },
//       url: {
//         snippet: {}
//       }
//     },
//     disjunctiveFacets: ["code.keyword", "field_modelo.keyword", "field_origem.keyword"],
//     facets: {
//       "code.keyword": { type: "value" },
//       "field_modelo.keyword": { type: "value" },
//       "field_origem.keyword": { type: "value" }
//     }
//   },
//   autocompleteQuery: {
//     results: {
//       resultsPerPage: 5,
//       search_fields: {
//         "title.suggest": {
//           weight: 3
//         }
//       },
//       result_fields: {
//         title: {
//           snippet: {
//             size: 100,
//             fallback: true
//           }
//         },
//         url: {
//           raw: {}
//         }
//       }
//     },
//     suggestions: {
//       types: {
//         results: { fields: ["title"] }
//       },
//       size: 4
//     }
//   },
//   apiConnector: connector,
//   alwaysSearchOnInitialLoad: true
// };

// export default function App() {
//   return (
//     <SearchProvider config={config}>
//       <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
//         {({ wasSearched }) => {
//           return (
//             <div className="App">
//               <ErrorBoundary>
//                 <Layout
//                   header={
//                     <SearchBox/>
//                   }
//                   sideContent={
//                     <div>
//                       {wasSearched && <Sorting label={"Sort by"} sortOptions={[]} />}
//                       <Facet key={"1"} field={"code.keyword"} label={"code"} />
//                       <Facet key={"2"} field={"field_modelo.keyword"} label={"field_modelo"} />
//                       <Facet key={"3"} field={"field_origem.keyword"} label={"field_origem"} />
//                     </div>
//                   }
//                   bodyContent={<Results shouldTrackClickThrough={true} />}
//                   bodyHeader={
//                     <React.Fragment>
//                       {wasSearched && <PagingInfo />}
//                       {wasSearched && <ResultsPerPage />}
//                     </React.Fragment>
//                   }
//                   bodyFooter={<Paging />}
//                 />
//               </ErrorBoundary>
//             </div>
//           );
//         }}
//       </WithSearch>
//     </SearchProvider>
//   );
// }


