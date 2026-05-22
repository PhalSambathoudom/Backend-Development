const validateQuery = (req, res, next) => {
    const { minCredits, maxCredits } = req.query;

    // Check if minCredits is a valid integer
    if (minCredits !== undefined) {
        const min = Number(minCredits);
        if (!Number.isInteger(min) || isNaN(min)) {
            return res.status(400).json({
                error: 'Invalid query: minCredits must be a valid integer.'
            });
        }
    }

    // Check if maxCredits is a valid integer
    if (maxCredits !== undefined) {
        const max = Number(maxCredits);
        if (!Number.isInteger(max) || isNaN(max)) {
            return res.status(400).json({
                error: 'Invalid query: maxCredits must be a valid integer.'
            });
        }
    }

    // Check if minCredits > maxCredits
    if (minCredits !== undefined && maxCredits !== undefined) {
        if (Number(minCredits) > Number(maxCredits)) {
            return res.status(400).json({
                error: 'Invalid credit range: minCredits cannot be greater than maxCredits.'
            });
        }
    }

    next(); // all good, pass to route
};

export default validateQuery;