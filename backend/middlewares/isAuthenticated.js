const isAuthenticated = (req, res, next) => {
  if (req.session.username && req.session.username !== '') {
    next()
  } else {
    next(new Error('user is not authenticated'))
  }
}

module.exports = isAuthenticated
