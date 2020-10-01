import { ApolloClient, createHttpLink, InMemoryCache, concat, ApolloLink } from "@apollo/client";

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_GRAPHQL_API
});

const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext({
		headers: {
			authorization: `Bearer ${localStorage.getItem("TOKEN")}`
		}
	});

	return forward(operation);
});

export const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	queryDeduplication: false,
	cache: new InMemoryCache(),
	defaultOptions: {
		query: {
			fetchPolicy: "network-only",
			errorPolicy: "all"
		},
		mutate: {
			errorPolicy: "all"
		}
	}
});
