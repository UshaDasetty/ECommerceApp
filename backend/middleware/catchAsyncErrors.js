//catchAsyncErrors is used to overcome send request is loading continuously

module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
}