import { Meteor } from "meteor/meteor"
import React from "react"
import FlatButton from "material-ui/FlatButton"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import { createContainer } from "meteor/react-meteor-data"

import { Patients } from "../../../../api/patients/patients.js"
import NoPatientsList from "./no-patients.js"
import PatientCard from "./patient-card.js"
import DoctorsMenu from "../../doctors/doctors-menu.js"
import AddNewPatientButton from "../patient/AddNewPatientButton"
class PatientList extends React.Component {
	renderPatientCards() {
		const patients = this.props.patients
		if (patients.length === 0) {
			return <NoPatientsList />
		}

		return patients.map(patient => {
			const url = `/patient/${patient._id}`
			return <PatientCard key={patient._id} url={url} patient={patient} />
		})
	}

	render() {
		return (
			<div>
				<div style={{ display: "flex" }}>
					<h3 style={{ marginLeft: "20px" }}>
						Your Patients
					</h3>
					<div style={{ marginTop: "5px" }}>
						<DoctorsMenu users={this.props.users} />
					</div>
				</div>
				<div>
					{this.renderPatientCards()}
				</div>
				<div><AddNewPatientButton /></div>
			</div>
		)
	}
}

export default createContainer(() => {
	let user = Meteor.user()
	let coveredPatients = []
	if (user && user.profile && user.profile.coveredPatients) {
		coveredPatients = user.profile.coveredPatients
	}
	const subscription = Meteor.subscribe("patients")

	const patients = Patients.find({
		_id: { $in: coveredPatients }
	}).fetch()

	return { patients }
}, PatientList)
