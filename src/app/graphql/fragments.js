import { gql } from "@apollo/client";

export const frag_login_response = gql`
	fragment LoginResponse on MutLoginResponse {
		success
		token
		user {
			role
			id
			name
			email
		}
		error
		message
	}
`;

export const frag_query_response = gql`
	fragment QueryResponse on QueBootcampsResponse {
		success
		count
		pagination {
			total
			next {
				page
				limit
			}
			prev {
				page
				limit
			}
		}
		error
		message
	}
`;

export const frag_bootcamp_fields = gql`
	fragment BootcampFields on Bootcamp {
		_id
		name
		id
		careers
		photo
		housing
		jobAssistance
		jobGuarantee
		acceptGi
		address
		email
		phone
		website
		description
		averageCost
		averageRating
		user
		createdAt
		location {
			type
			coordinates
			formattedAddress
			street
			city
			state
			zipcode
			country
		}
		courses {
			scholarshipAvailable
			_id
			title
			description
			weeks
			tuition
			minimumSkill
			user
			bootcamp
			createdAt
		}
	}
`;
