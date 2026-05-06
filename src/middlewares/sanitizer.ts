import type { FastifyRequest, FastifyReply, onRequestHookHandler } from 'fastify';
import xss from 'xss';

/**
 * Security: Middleware para sanitizar entrada e prevenir XSS
 * Remove scripts e tags perigosas de strings de entrada
 */
export const sanitizer: onRequestHookHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
  done
) => {
  // Sanitizar query params
  if (request.query && typeof request.query === 'object') {
    for (const [key, value] of Object.entries(request.query)) {
      if (typeof value === 'string') {
        request.query[key] = xss(value);
      }
    }
  }

  // Sanitizar body
  if (request.body && typeof request.body === 'object') {
    sanitizeObject(request.body);
  }

  done();
};

/**
 * Recursivamente sanitiza um objeto removendo scripts e HTML perigoso
 */
function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        obj[key] = xss(value, {
          whiteList: {},
          stripIgnoredTag: true,
        });
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitizeObject(value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string') {
            value[index] = xss(item);
          } else if (typeof item === 'object' && item !== null) {
            sanitizeObject(item);
          }
        });
      }
    }
  }
}
