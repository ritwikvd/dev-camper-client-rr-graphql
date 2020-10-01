import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";
import { createBootcamp, updatePublisher } from "./publisherSlice";
import BootcampDetails from "./BootcampDetails";

const CreateBootcamp = () => {
	const bootcamp = useSelector(state => state.publisher.bootcamp);
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");

	if (loading) return <main className="main-bootcamp-dtls">{loading}</main>;

	if (bootcamp) return <Redirect to="/publisher/manage" />;

	return (
		<main className="main-bootcamp-dtls">
			<div className="alert-container align-center bootcamp-dtls-alert">{alert && <div>{alert}</div>}</div>
			<BootcampDetails {...{ caller: createBootcamp, display: "Create Bootcamp" }} />
		</main>
	);
};
export default CreateBootcamp;
