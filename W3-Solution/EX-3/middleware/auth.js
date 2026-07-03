const VALID_TOKEN = 'xyz123'; // hardcoded token for simulation

const auth = (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized: token is missing.'
        });
    }

    if (token !== VALID_TOKEN) {
        return res.status(401).json({
            error: 'Unauthorized: invalid token.'
        });
    }

    next(); // token is valid
};

export default auth;