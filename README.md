> Deployed [here](https://dev-camper-rrg.herokuapp.com/) (free dynos from heroku AND goes thru the gql endpoint, so API calls are super slow)

## **Dev Camper Client with GraphQL**

Basically, [this](https://github.com/ritwikvd/dev-camper-client-react-redux) but with gql.

Apollo Client used for graphql querying. No hooks tho; persisted with redux for state management, since Apollo's cache/ local state handling is pretty convoluted imo.
