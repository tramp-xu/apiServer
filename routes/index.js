import admin from './admin'
import thirdParty from './third-partyLogin'

export default app => {
	app.use('/api/admin', admin);
	app.use('/api/github', thirdParty);
}