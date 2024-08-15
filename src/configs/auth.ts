export default {
	jwtSecret: process.env.JWT_SECRET || "$€Cr€T",
	jwtExpiresIn: "1d",
	bcryptSaltRounds: 10
};
