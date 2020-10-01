import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleLoadingUpdates, performQuery, performMutation } from "../../common/utils/utils";
import {
	graphql_create_bootcamp,
	graphql_create_course,
	graphql_edit_bootcamp,
	graphql_edit_course,
	graphql_delete_course,
	graphql_publisher_bootcamp
} from "../../app/graphql/queries";

const initialState = {
	bootcamp: null,
	loading: "idle",
	alert: "",
	photoPath: ""
};

const publisherSlice = createSlice({
	name: "publisher",
	initialState,
	reducers: {
		updatePublisher: (state, { payload }) => ({ ...state, ...payload })
	},
	extraReducers: builder =>
		builder
			.addCase("publisher/upload_image/pending", state => {
				state.loading = "UPLOADING IMAGE";
			})
			.addCase("publisher/pub_bootcamp/pending", state => {
				state.loading = "FETCHING";
			})
			.addCase("publisher/delete_course/pending", state => {
				state.loading = "DELETING";
			})
			.addCase("publisher/create_course/fulfilled", (state, { payload: { loading, alert, data, avgCost } }) => {
				const { bootcamp } = state;
				const { courses } = bootcamp;

				bootcamp.averageCost = avgCost;
				state.loading = loading;
				state.alert = alert;

				if (!courses) bootcamp.courses = [data];
				else courses.push(data);
			})
			.addCase("publisher/edit_course/fulfilled", (state, { payload: { loading, alert, data, avgCost } }) => {
				const { courses } = state.bootcamp;

				state.bootcamp.averageCost = avgCost;
				state.loading = loading;
				state.alert = alert;

				const index = courses.findIndex(a => a._id === data._id);
				courses[index] = data;
			})
			.addCase("publisher/delete_course/fulfilled", (state, { payload: { loading, alert, id, avgCost } }) => {
				let { courses } = state.bootcamp;

				state.bootcamp.averageCost = avgCost;
				state.loading = loading;
				state.alert = alert;

				state.bootcamp.courses = courses.filter(a => a._id !== id);
			})
			.addCase("auth/logout/fulfilled", () => initialState)
			.addMatcher(
				({ type }) => ["publisher/edit_bootcamp/pending", "publisher/edit_course/pending"].includes(type),
				state => {
					state.loading = "UPDATING";
				}
			)
			.addMatcher(
				({ type }) => ["publisher/create_bootcamp/pending", "publisher/create_course/pending"].includes(type),
				state => {
					state.loading = "CREATING";
				}
			)
			.addMatcher(
				({ type }) =>
					[
						"publisher/create_bootcamp/fulfilled",
						"publisher/upload_image/fulfilled",
						"publisher/edit_bootcamp/fulfilled",
						"publisher/pub_bootcamp/fulfilled"
					].includes(type),
				(state, { payload }) => ({ ...state, ...payload })
			)
			.addMatcher(
				({ type }) => type.startsWith("publisher") && type.endsWith("rejected"),
				state => {
					state.loading = "idle";
					state.alert = "Internal Server Error";
				}
			)
});

export const { updatePublisher } = publisherSlice.actions;

export const getPublisherBootcamp = createAsyncThunk("publisher/pub_bootcamp", async (_, { dispatch }) => {
	const {
		publisherBootcamp: { success, data, error }
	} = await performQuery(graphql_publisher_bootcamp, { id: localStorage.getItem("ID") });

	await handleLoadingUpdates([success ? "READY" : error ? "FAILED" : "REDIRECTING"], dispatch, updatePublisher);

	return {
		bootcamp: data,
		photoPath: data ? `${process.env.REACT_APP_API}/uploads/${data.photo}` : "",
		loading: "idle",
		alert: success ? "" : error || ""
	};
});

export const uploadImage = createAsyncThunk("publisher/upload_image", async ({ file, data }, { dispatch }) => {
	const form = document.createElement("form");
	form.setAttribute("enctype", "multipart/form-data");

	let formData = new FormData(form);
	formData.append("file", file);

	const response = await fetch(`${process.env.REACT_APP_API}/api/v1/bootcamps/${data._id}/photo`, {
		method: "PUT",
		body: formData,
		headers: {
			authorization: `Bearer ${localStorage.getItem("TOKEN")}`
		}
	});

	const { success, error, message, path } = await response.json();

	await handleLoadingUpdates([success ? "READY" : "FAILED"], dispatch, updatePublisher);

	return {
		bootcamp: data,
		loading: "idle",
		alert: success ? "" : error || message,
		photoPath: `${process.env.REACT_APP_API}/${path}` || ""
	};
});

export const createBootcamp = createAsyncThunk("publisher/create_bootcamp", async (bootcamp, { dispatch }) => {
	const { file } = bootcamp;

	delete bootcamp.file;

	const {
		createBootcamp: { success, error, message, data }
	} = await performMutation(graphql_create_bootcamp, { bootcamp });

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { alert: error || message, loading: "idle" };

	if (file) await dispatch(uploadImage({ file, data }));

	if (!file)
		return {
			bootcamp: data,
			alert: "",
			loading: "idle"
		};
});

export const editBootcamp = createAsyncThunk("publisher/edit_bootcamp", async (bootcamp, { dispatch, getState }) => {
	const { file } = bootcamp;

	delete bootcamp.file;

	const {
		editBootcamp: { success, error, message, data }
	} = await performMutation(graphql_edit_bootcamp, {
		id: getState().publisher.bootcamp.id,
		bootcamp
	});

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { alert: error || message, loading: "idle" };

	const image = file instanceof File;

	if (image) await dispatch(uploadImage({ file, data }));

	if (!image)
		return {
			bootcamp: data,
			alert: "",
			loading: "idle"
		};
});

export const createCourse = createAsyncThunk("publisher/create_course", async (course, { dispatch, getState }) => {
	delete course.courseID;

	const {
		createCourse: { success, data, error, message, avgCost }
	} = await performMutation(graphql_create_course, { id: getState().publisher.bootcamp.id, course });

	await handleLoadingUpdates([success ? "CREATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { loading: "idle", alert: error || message };

	return { loading: "idle", alert: "", data, avgCost };
});

export const editCourse = createAsyncThunk("publisher/edit_course", async (course, { dispatch }) => {
	const id = course.courseID;

	delete course.courseID;

	const {
		editCourse: { success, data, error, message, avgCost }
	} = await performMutation(graphql_edit_course, { id, course });

	await handleLoadingUpdates([success ? "UPDATED" : "FAILED"], dispatch, updatePublisher);

	if (!success) return { loading: "idle", alert: error || message };

	return { loading: "idle", alert: "", data, avgCost };
});

export const deleteCourse = createAsyncThunk("publisher/delete_course", async ({ id }, { dispatch }) => {
	const {
		deleteCourse: { success, error, message, avgCost }
	} = await performMutation(graphql_delete_course, { id });

	await handleLoadingUpdates([success ? "DONE" : "FAILED"], dispatch, updatePublisher);

	return { loading: "idle", alert: success ? "" : error || message, id, avgCost };
});

//selectors here

export default publisherSlice.reducer;
