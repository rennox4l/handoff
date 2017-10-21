import { Meteor } from "meteor/meteor"
import React from "react"
import PropTypes from "prop-types"
import { createContainer } from "meteor/react-meteor-data"

import { Patients } from "../../../../api/patients/patients.js"
import NoPatientsList from "./no-patients.js"
import LoggedOutBanner from "./LoggedOutBanner.js"
import NewPatientList from "./new-patient-list"
class PatientList extends React.Component {
	static propTypes = {
		patients: PropTypes.array.isRequired,
		selectedRowKeys: PropTypes.array.isRequired,
		setSelectedRowKeys: PropTypes.func.isRequired
	}

	renderPatientCards() {
		if (!Meteor.user()) return <LoggedOutBanner />

		const patients = this.props.patients
		if (patients.length === 0) {
			return <NoPatientsList />
		}

		return (
			<NewPatientList
				patients={patients}
				selectedRowKeys={this.props.selectedRowKeys}
				setSelectedRowKeys={this.props.setSelectedRowKeys}
			/>
		)
	}

	render() {
		return <div style={{ height: "100%" }}>{this.renderPatientCards()}</div>
	}
}

export default createContainer(() => {
	let user = Meteor.user()
	let coveredPatients = []
	if (user && user.profile && user.profile.coveredPatients) {
		coveredPatients = user.profile.coveredPatients
	}
	Meteor.subscribe("patients")

	const patients = Patients.find({
		_id: { $in: coveredPatients }
	}).fetch()

	return { patients }
}, PatientList)
