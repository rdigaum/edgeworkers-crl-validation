import { logger } from 'log';
import { revokedFingerprints } from './data.js';

export function onClientRequest(request) {
  try {
    const fingerprint = request.getVariable('PMUSER_CLIENT_CERT_FINGERPRINT');

    if (!fingerprint) {
      const responseBody = JSON.stringify({
        status: 'nao_autorizado',
        message: 'Certificado de cliente não encontrado. Acesso negado!'
      });
      request.respondWith(
        401,
        { 'Content-Type': ['application/json'] },
        responseBody
      );
      return;
    }
    // Verifica se o fingerprint está na lista de revogados
    const isRevoked = revokedFingerprints.includes(fingerprint);

    if (isRevoked) {
      const responseBody = JSON.stringify({
        status: 'revogado',
        message: 'Este certificado foi revogado. Acesso negado.'
      });

      request.respondWith(
        403,
        { 'Content-Type': ['application/json'] },
        responseBody
      );
    } else {
      // Segue o Flow! -> 
    }
  } catch (error) {
    logger.log(`Erro no EdgeWorker: ${error.message}`);
     return;
  }
}
