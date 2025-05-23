class UnauthenticatedError extends Error {
  constructor(message) {
    super(message); 
    this.name = "UnauthenticatedError"; 
    this.statusCode = 401; 
  }
}

export default UnauthenticatedError;
