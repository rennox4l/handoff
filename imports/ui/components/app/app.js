// Atmosphere and NPM
import { Meteor } from "meteor/meteor"
import React from "react"
import PropTypes from "prop-types"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import createHistory from "history/createBrowserHistory"

// Components
import Navigation from "../navigation/navigation.js"
import PatientList from "../patients/patient_list/patient-list.js"
import PatientDisplay from "../patients/patient/patient-display.js"
import PatientForm from "../patients/patient/patient-form.js"
import { createContainer } from "meteor/react-meteor-data"

import { blue, orange } from "material-ui/colors"
import createMuiTheme from "material-ui/styles/theme"

import createPalette from "material-ui/styles/palette"
const handoffTheme = createMuiTheme({
	palette: createPalette({
		primary: blue,
		accent: orange
	})
})

// App Component
const App = ({ history, users, ...appProps }) => {
	return (
		<MuiThemeProvider theme={handoffTheme}>
			<Router history={history}>
				<div className="App">
					<Navigation history={history} />
					<Switch>
						<Route exact path="/patient/:_id/edit" component={PatientForm} />
						<Route exact path="/patient/:_id" component={PatientDisplay} />
						<Route exact path="/newpatient" component={PatientForm} />
						<Route exact path="/account/:_id" component={TempAccountPage} />
						<Route
							path="/"
							component={() => <PatientList users={users} {...appProps} />}
						/>
					</Switch>
				</div>
			</Router>
		</MuiThemeProvider>
	)
}

const history = createHistory()

export default createContainer(() => {
	Meteor.subscribe("allUsers")
	let users = Meteor.users.find().fetch()
	return { history, users }
}, App)

const TempAccountPage = () => {
	return <h1>Temp Account Page</h1>
}
