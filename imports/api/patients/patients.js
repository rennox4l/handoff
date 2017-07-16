import { Meteor } from "meteor/meteor"
import { Mongo } from "meteor/mongo"

export const Patients = new Mongo.Collection("patients")

// Publications
if (Meteor.isServer) {
	// Kvothe: Only subscribe to patients from your hospital
	Meteor.publish("patients", () => {
		return Patients.find({}, { sort: { createdAt: -1 } })
	})
	Meteor.publish("patient", ({ match }) => {
		return Patients.findOne(match.params._id)
	})
}

Meteor.methods({
	addPatientToUser(patientId, userId) {
		Meteor.users.update(
			{ _id: userId },
			{
				$addToSet: {
					"profile.coveredPatients": patientId
				}
			}
		)
	},
	removePatientFromUser(patientId, userId) {
		Meteor.users.update(
			{ _id: userId },
			{
				$pull: {
					"profile.coveredPatients": patientId
				}
			}
		)
	},

	// insert a patient
	"patient.insert"(patient) {
		// validate against schema
		// new SimpleSchema({
		// 	patient: { type: Object }
		// }).validate({ patient });

		// check that a user is signed in
		let userId = Meteor.userId()
		if (!userId)
			throw new Meteor.Error(
				"Not authorized",
				"You must sign in to create a patient"
			)

		// create the patient obj
		let user = Meteor.user()
		Object.assign(patient, {
			userId: userId,
			email: user.emails[0].address,
			createdAt: new Date()
		})

		// insert the patient
		let patientId = Patients.insert(patient)
		Meteor.users.update(
			{ _id: userId },
			{ $addToSet: { "profile.coveredPatients": [patientId] } }
		)
		return { _id: patientId }
	},
	// update a patient
<<<<<<< HEAD
	"patient.update.color"(patientId, color) {
		// validate
		new SimpleSchema({
			patientId: { type: String },
			color: { type: String }
		}).validate({ patientId, color })

		// does the patient exist
		let patient = Patients.findOne(patientId)
		if (!patient)
			throw new Meteor.Error("Does Not Exist", "patient could not be found")

		// check that user exists and owns patient
		let user = Meteor.user()
		if (patient.userId !== user._id)
			throw new Meteor.Error(
				"Not Authorized",
				"You are not the owner of this patient"
			)
=======

	// "patient.update.color"(patientId, color) {
	// 	// validate
	// 	new SimpleSchema({
	// 		patientId: { type: String },
	// 		color: { type: String }
	// 	}).validate({ patientId, color })

	// 	// does the patient exist
	// 	let patient = Patients.findOne(patientId)
	// 	if (!patient)
	// 		throw new Meteor.Error("Does Not Exist", "patient could not be found")
>>>>>>> 44d5e6ce86044e7d89645e8da3225fa93ce470a4

	// 	// check that user exists and owns patient
	// 	let user = Meteor.user()
	// 	if (patient.userId !== user._id)
	// 		throw new Meteor.Error(
	// 			"Not Authorized",
	// 			"You are not the owner of this patient"
	// 		)

	// 	// update the color
	// 	Patients.update(patientId, { $set: { color: color } })
	// },
	// remove a patient
	"patient.remove"(patientId) {
		// validate
		new SimpleSchema({
			patientId: { type: String }
		}).validate({ patientId })

		// does the patient exist
		let patient = Patients.findOne(patientId)
		if (!patient)
			throw new Meteor.Error("Does Not Exist", "patient could not be found")

		// check that user exists and owns patient
		let user = Meteor.user()
		if (patient.userId !== user._id)
			throw new Meteor.Error(
				"Not Authorized",
				"You are not the owner of this patient"
			)

		// remove the patient
		Patients.remove(patientId)
	}
})
