import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const Patients = new Mongo.Collection("patients");

// Publications
if (Meteor.isServer) {
	Meteor.publish("Patients", match => {
		if (match.path === "/newest")
			return Patients.find({}, { sort: { createdAt: -1 } });
		if (match.path === "/top") return Patients.find();
	});
}

Meteor.methods({
	// insert a patient
	"patient.insert"(color) {
		// validate against schema
		new SimpleSchema({
			color: { type: String }
		}).validate({ color });

		// check that a user is signed in
		let userId = Meteor.userId();
		if (!userId)
			throw new Meteor.Error(
				"Not authorized",
				"You must sign in to create a patient"
			);

		// create the patient obj
		let user = Meteor.user();
		let patient = {
			userId: userId,
			email: user.emails[0].address,
			createdAt: new Date()
		};

		// insert the patient
		let patientId = Patients.insert(patient);

		return { _id: patientId };
	},
	// update a patient
	"patient.update.color"(patientId, color) {
		// validate
		new SimpleSchema({
			patientId: { type: String },
			color: { type: String }
		}).validate({ patientId, color });

		// does the patient exist
		let patient = Patients.findOne(patientId);
		if (!patient)
			throw new Meteor.Error("Does Not Exist", "patient could not be found");

		// check that user exists and owns patient
		let user = Meteor.user();
		if (patient.userId !== user._id)
			throw new Meteor.Error(
				"Not Authorized",
				"You are not the owner of this patient"
			);

		// update the color
		Patients.update(patientId, { $set: { color: color } });
	},
	// remove a patient
	"patient.remove"(patientId) {
		// validate
		new SimpleSchema({
			patientId: { type: String }
		}).validate({ patientId });

		// does the patient exist
		let patient = Patients.findOne(patientId);
		if (!patient)
			throw new Meteor.Error("Does Not Exist", "patient could not be found");

		// check that user exists and owns patient
		let user = Meteor.user();
		if (patient.userId !== user._id)
			throw new Meteor.Error(
				"Not Authorized",
				"You are not the owner of this patient"
			);

		// remove the patient
		Patients.remove(patientId);
	}
});
