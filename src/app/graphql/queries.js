import { gql } from "@apollo/client";
import { frag_bootcamp_fields, frag_login_response, frag_query_response } from "./fragments";

export const graphql_bootcamps = gql`
	query Query($page: Int, $rating: String, $zip: String, $miles: String) {
		bootcamps(page: $page, rating: $rating, zip: $zip, miles: $miles) {
			...QueryResponse
			data {
				_id
				id
				location {
					city
					state
				}
				careers
				photo
				name
				averageRating
			}
		}
	}
	${frag_query_response}
`;

export const graphql_publisher_bootcamp = gql`
	query Query($id: String) {
		publisherBootcamp(id: $id) {
			success
			error
			message
			data {
				...BootcampFields
			}
		}
	}
	${frag_bootcamp_fields}
`;

export const graphql_login = gql`
	mutation($email: String, $password: String) {
		login(email: $email, password: $password) {
			...LoginResponse
		}
	}
	${frag_login_response}
`;

export const graphql_register = gql`
	mutation($name: String, $role: String, $email: String, $password: String) {
		register(name: $name, role: $role, email: $email, password: $password) {
			...LoginResponse
		}
	}
	${frag_login_response}
`;

export const graphql_reset_pass = gql`
	mutation($resetToken: String, $password: String) {
		resetPass(resetToken: $resetToken, password: $password) {
			...LoginResponse
			data
		}
	}
	${frag_login_response}
`;

export const graphql_logout = gql`
	mutation {
		logout {
			success
			error
		}
	}
`;

export const graphql_update_account = gql`
	mutation($email: String, $name: String) {
		updateAccount(email: $email, name: $name) {
			success
			error
			message
		}
	}
`;

export const graphql_create_bootcamp = gql`
	mutation($bootcamp: BootcampInput) {
		createBootcamp(bootcamp: $bootcamp) {
			success
			data {
				...BootcampFields
			}
			error
			message
		}
	}
	${frag_bootcamp_fields}
`;

export const graphql_edit_bootcamp = gql`
	mutation($id: String, $bootcamp: BootcampInput) {
		editBootcamp(id: $id, bootcamp: $bootcamp) {
			success
			data {
				...BootcampFields
			}
			error
			message
		}
	}
	${frag_bootcamp_fields}
`;

export const graphql_create_course = gql`
	mutation($id: String, $course: CourseInput) {
		createCourse(id: $id, course: $course) {
			success
			error
			message
			avgCost
			data {
				scholarshipAvailable
				_id
				title
				weeks
				description
				tuition
				minimumSkill
			}
		}
	}
`;

export const graphql_edit_course = gql`
	mutation($id: String, $course: CourseInput) {
		editCourse(id: $id, course: $course) {
			success
			error
			message
			avgCost
			data {
				scholarshipAvailable
				_id
				title
				weeks
				description
				tuition
				minimumSkill
			}
		}
	}
`;

export const graphql_delete_course = gql`
	mutation($id: String) {
		deleteCourse(id: $id) {
			success
			avgCost
			error
			message
		}
	}
`;

export const graphql_bootcamp = gql`
	query($id: String) {
		bootcamp(id: $id) {
			success
			error
			message
			data {
				photo
				name
				description
				housing
				jobAssistance
				jobGuarantee
				acceptGi
				averageCost
				averageRating
				courses {
					title
					description
					weeks
					tuition
					minimumSkill
					scholarshipAvailable
				}
			}
		}
	}
`;

export const graphql_bootcamp_reviews = gql`
	query($id: String) {
		bootcampReviews(id: $id) {
			success
			error
			message
			data {
				title
				text
				rating
				user {
					name
				}
			}
		}
	}
`;

export const graphql_submit_review = gql`
	mutation($id: String, $review: ReviewInput) {
		submitReview(id: $id, review: $review) {
			success
			error
			message
		}
	}
`;

export const graphql_update_password = gql`
	mutation($currentPassword: String, $newPassword: String) {
		updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			success
			error
			message
		}
	}
`;

export const graphql_reset_token = gql`
	mutation($email: String) {
		resetToken(email: $email) {
			success
			error
			message
			resetToken
		}
	}
`;

export const graphql_user_reviews = gql`
	query($id: String) {
		userReviews(id: $id) {
			success
			error
			message
			data {
				_id
				title
				text
				rating
				bootcamp {
					name
				}
			}
		}
	}
`;

export const graphql_edit_review = gql`
	mutation($id: String, $review: ReviewInput) {
		editReview(id: $id, review: $review) {
			success
			error
			message
		}
	}
`;

export const graphql_delete_review = gql`
	mutation($id: String) {
		deleteReview(id: $id) {
			success
			error
			message
		}
	}
`;
