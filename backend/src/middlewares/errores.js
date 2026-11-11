// Crea un error con código HTTP para el manejador centralizado
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
module.exports = { httpError };
