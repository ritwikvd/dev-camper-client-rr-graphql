> Deployed [here](https://dev-camper-rrr.herokuapp.com/) (free dynos from heroku, so API calls are super slow)

## **Dev Camper Client with GraphQL**

Front-end covering almost all routes present in the [API implementation](https://github.com/ritwikvd/dev-camper-rpc-api).

Built with all functional React components and hooks, along with React Router for client-side routing, and Redux for state management.

[Redux Toolkit](https://redux-toolkit.js.org/) was used; it's great! Especially loved the inbuilt thunks, entity adapters and selectors. Tailor made for these kinds of apps.

Styling done thru SCSS with a custom design.

Apollo Client used for graphql querying. No hooks tho; persisted with redux for state management, since Apollo's cache/ local state handling is pretty convoluted imo.
