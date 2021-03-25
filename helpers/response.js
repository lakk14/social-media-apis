module.exports = {
    response: (status, message, result) => {
        return {
            status: status,
            message: message,
            result: result
        };
    }
};