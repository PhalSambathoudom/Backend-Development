const logger = (req, res, next) => {
    console.log('-----------------------------------');
    console.log(`Method:     ${req.method}`);
    console.log(`Path:       ${req.path}`);
    console.log(`Query:      ${JSON.stringify(req.query)}`);
    console.log(`Timestamp:  ${new Date().toISOString()}`);
    console.log('-----------------------------------');
    next(); // pass to next middleware
};

export default logger;