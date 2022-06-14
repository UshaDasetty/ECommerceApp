class ErrorHandler extends Error{
    
    constructor(message,statusCode) {
        super(message,statusCode);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorHandler;

