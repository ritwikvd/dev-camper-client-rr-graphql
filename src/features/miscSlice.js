import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	graphql_bootcamp,
	graphql_bootcamp_reviews,
	graphql_submit_review,
	graphql_update_password,
	graphql_reset_token,
	graphql_user_reviews,
	graphql_delete_review,
	graphql_edit_review
} from "../app/graphql/queries";
import { handleLoadingUpdates, performQuery, performMutation } from "../common/utils/utils";

const miscSlice = createSlice({
	name: "misc",
	initialState: { data: {}, loading: "idle", alert: "" },
	reducers: {
		updateMisc: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("auth/logout/fulfilled", () => ({ data: {}, loading: "idle", alert: "" }))
			.addCase("misc/submit_review/pending", state => {
				state.loading = "CREATING";
			})
			.addCase("misc/update_password/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("misc/reset_password/pending", state => {
				state.loading = "REDIRECTING";
			})
			.addCase("misc/retrieve_user_reviews/pending", state => {
				state.loading = "FETCHING";
			})
			.addCase("misc/edit_user_reviews/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("misc/delete_review/pending", state => {
				state.loading = "DELETING";
			})
			.addMatcher(
				({ type }) => ["misc/bootcamp/pending", "misc/bootcamp_reviews/pending"].includes(type),
				state => {
					state.loading = "FETCHING";
				}
			)
			.addMatcher(
				({ type }) => type.startsWith("misc") && type.endsWith("fulfilled"),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("misc") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updateMisc } = miscSlice.actions;

//thunks
export const getBootcamp = createAsyncThunk("misc/bootcamp", async (arg, { dispatch }) => {
	const {
		bootcamp: { success, data, message, error }
	} = await performQuery(graphql_bootcamp, arg);

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { data: success ? data : {}, loading: "idle", alert: success ? "" : error || message };
});

export const getBootcampReviews = createAsyncThunk("misc/bootcamp_reviews", async (arg, { dispatch }) => {
	const {
		bootcampReviews: { success, data, message, error }
	} = await performQuery(graphql_bootcamp_reviews, arg);

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { data: success ? data : {}, loading: "idle", alert: success ? "" : error || message };
});

export const submitReview = createAsyncThunk("misc/submit_review", async ({ id, body: review }, { dispatch }) => {
	const {
		submitReview: { success, message, error }
	} = await performMutation(graphql_submit_review, { id, review });

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updateMisc);

	return { data: { submitted: success }, loading: "idle", alert: success ? "" : error || message };
});

export const updatePassword = createAsyncThunk("misc/update_password", async (body, { dispatch }) => {
	const {
		updatePassword: { success, message, error }
	} = await performMutation(graphql_update_password, body);

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateMisc);

	return { data: { updated: success }, loading: "idle", alert: success ? "" : error || message };
});

export const resetPassword = createAsyncThunk("misc/reset_password", async body => {
	const {
		resetToken: { success, error, message, resetToken }
	} = await performMutation(graphql_reset_token, body);

	return { data: { resetToken }, loading: "idle", alert: success ? "" : error || message };
});

export const handleReviewRetrieval = createAsyncThunk("misc/retrieve_user_reviews", async (_, { dispatch }) => {
	const {
		userReviews: { success, error, message, data }
	} = await performQuery(graphql_user_reviews, { id: localStorage.getItem("ID") });

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updateMisc);

	return { loading: "idle", alert: success ? "" : error || message, data };
});

export const editReview = createAsyncThunk("misc/edit_user_reviews", async (review, { dispatch }) => {
	const id = review.reviewID;

	delete review.reviewID;

	const {
		editReview: { success, error, message }
	} = await performMutation(graphql_edit_review, { id, review });

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateMisc);

	return { loading: "idle", alert: success ? "" : error || message, data: { edited: success } };
});

export const deleteReview = createAsyncThunk("misc/delete_review", async (arg, { dispatch, getState }) => {
	const {
		deleteReview: { success, error, message }
	} = await performMutation(graphql_delete_review, arg);

	await handleLoadingUpdates([success ? "DONE" : "FAILED"], dispatch, updateMisc);

	let data = getState().misc.data;

	data = success ? data.filter(r => r._id !== arg.id) : data;

	return { loading: "idle", alert: success ? "" : error || message, data };
});

export default miscSlice.reducer;
