import admin from './admin'

export default app => {
	app.use('/api/admin', admin);
}