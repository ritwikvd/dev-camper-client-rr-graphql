import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { performQuery, performMutation, handleLoadingUpdates } from "../../common/utils/utils";
import { graphql_login, graphql_logout, graphql_register, graphql_reset_pass, graphql_update_account } from "../../app/graphql/queries";

const initialState = {
	email: localStorage.getItem("EMAIL") || "",
	session: localStorage.getItem("EMAIL") ? "active" : "inactive",
	loading: "idle",
	alert: "",
	name: localStorage.getItem("NAME") || ""
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		updateAuth: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("auth/reset_pass_and_login/pending", state => {
				state.loading = "RESETTING";
			})
			.addCase("auth/update_account/pending", state => {
				state.loading = "UPDATING";
			})
			.addCase("auth/logout/pending", state => {
				state.loading = "LOGGING OUT";
			})
			.addMatcher(
				({ type }) => type.startsWith("auth") && type.endsWith("fulfilled"),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("auth") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updateAuth } = authSlice.actions;

export const handleLogin = createAsyncThunk("auth/update_auth_state", async (body, { dispatch }) => {
	dispatch(updateAuth({ loading: "LOGGING IN" }));

	const {
		login: { success, token, message, error, user }
	} = await performMutation(graphql_login, body);

	const loadingArray = [success ? "READY" : "FAILED"];

	await handleLoadingUpdates(loadingArray, dispatch, updateAuth);

	success &&
		[
			["TOKEN", token],
			["EMAIL", user.email],
			["NAME", user.name],
			["ROLE", user.role],
			["ID", user.id]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	return {
		email: body.email,
		session: success ? "active" : "inactive",
		loading: "idle",
		alert: success ? "" : error || message,
		name: user?.name || ""
	};
});

export const handleRegistration = createAsyncThunk("auth/update_auth_state", async (body, { dispatch }) => {
	dispatch(updateAuth({ loading: "REGISTERING" }));

	const {
		register: { success, token, message, error, user }
	} = await performMutation(graphql_register, body);

	const loadingArray = ["LOGGING IN", success ? "READY" : "FAILED"];

	await handleLoadingUpdates(loadingArray, dispatch, updateAuth);

	success &&
		[
			["TOKEN", token],
			["EMAIL", user.email],
			["NAME", user.name],
			["ROLE", user.role],
			["ID", user.id]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	return {
		email: body.email,
		session: success ? "active" : "inactive",
		loading: "idle",
		alert: success ? "" : error || message,
		name: user?.name || ""
	};
});

export const handlePasswordReset = createAsyncThunk("auth/reset_pass_and_login", async ({ email, resetToken, password }, { dispatch }) => {
	const {
		resetPass: { success, token, data, error, user }
	} = await performMutation(graphql_reset_pass, { resetToken, password });

	const loadingArray = success ? ["RESET", "LOGGING IN", "READY"] : ["FAILED"];

	await handleLoadingUpdates(loadingArray, dispatch, updateAuth);

	success &&
		[
			["TOKEN", token],
			["EMAIL", user.email],
			["NAME", user.name],
			["ROLE", user.role],
			["ID", user.id]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	return {
		email,
		session: success ? "active" : "inactive",
		loading: "idle",
		alert: success ? "" : error || data,
		name: user.name
	};
});

export const handleLogout = createAsyncThunk("auth/logout", async payload => {
	await new Promise(res => setTimeout(res, 500));

	const {
		logout: { success, error }
	} = await performMutation(graphql_logout);

	if (!success) console.error(error);

	["TOKEN", "EMAIL", "NAME", "ROLE", "ID"].forEach(a => localStorage.removeItem(a));

	return { ...payload, ...{ loading: "idle" } };
});

export const handleAccountUpdate = createAsyncThunk("auth/update_account", async (body, { dispatch }) => {
	const {
		updateAccount: { success, error, message }
	} = await performMutation(graphql_update_account, body);

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updateAuth);

	const alert = success ? "" : error || message;

	success &&
		[
			["EMAIL", body.email],
			["NAME", body.name]
		].forEach(([a, b]) => localStorage.setItem(a, b));

	if (!success) return { loading: "idle", alert };

	return { email: body.email, name: body.name, loading: "idle", alert };
});

//selectors here

export default authSlice.reducer;
