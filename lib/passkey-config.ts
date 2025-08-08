// Configuración para manejar errores de Passkey y warnings
export const PASSKEY_CONFIG = {
  // Configuración de timeout para operaciones de Passkey
  timeout: 30000, // 30 segundos
  
  // Configuración de algoritmos soportados
  supportedAlgorithms: [
    { alg: -7, name: 'ES256' },   // ECDSA with SHA-256
    { alg: -257, name: 'RS256' }  // RSASSA-PKCS1-v1_5 with SHA-256
  ],
  
  // Configuración de authenticator
  authenticatorSelection: {
    authenticatorAttachment: 'platform' as const,
    userVerification: 'preferred' as const,
    requireResidentKey: false
  },
  
  // Configuración de attestation
  attestation: 'none' as const,
  
  // Configuración de rp (relying party)
  rp: {
    name: 'INFINITO',
    id: window.location.hostname
  }
};

// Función para manejar errores de Passkey
export function handlePasskeyError(error: any): string {
  if (error.name === 'NotAllowedError') {
    return 'Operación cancelada por el usuario';
  }
  
  if (error.name === 'InvalidStateError') {
    return 'Credencial ya registrada para este usuario';
  }
  
  if (error.name === 'NotSupportedError') {
    return 'Navegador no soporta Passkeys';
  }
  
  if (error.name === 'SecurityError') {
    return 'Error de seguridad: verifique el contexto HTTPS';
  }
  
  if (error.name === 'TimeoutError') {
    return 'Operación expiró. Intente nuevamente';
  }
  
  if (error.name === 'AbortError') {
    return 'Operación abortada';
  }
  
  if (error.name === 'ConstraintError') {
    return 'Restricción de hardware no cumplida';
  }
  
  if (error.name === 'UnknownError') {
    return 'Error desconocido. Verifique su dispositivo';
  }
  
  return `Error de Passkey: ${error.message || 'Error desconocido'}`;
}

// Función para verificar soporte de Passkey
export function isPasskeySupported(): boolean {
  return window.PublicKeyCredential !== undefined &&
         typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
}

// Función para verificar si el usuario tiene un authenticator disponible
export async function checkAuthenticatorAvailability(): Promise<boolean> {
  try {
    if (!isPasskeySupported()) {
      return false;
    }
    
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.warn('Error checking authenticator availability:', error);
    return false;
  }
}

// Función para crear opciones de registro con algoritmos por defecto
export function createRegistrationOptions(userId: string, userName: string, challenge: ArrayBuffer) {
  return {
    challenge,
    rp: PASSKEY_CONFIG.rp,
    user: {
      id: new Uint8Array(Buffer.from(userId, 'utf8')),
      name: userName,
      displayName: userName
    },
    pubKeyCredParams: PASSKEY_CONFIG.supportedAlgorithms.map(alg => ({
      type: 'public-key',
      alg: alg.alg
    })),
    timeout: PASSKEY_CONFIG.timeout,
    attestation: PASSKEY_CONFIG.attestation,
    authenticatorSelection: PASSKEY_CONFIG.authenticatorSelection,
    excludeCredentials: [] // No excluir credenciales existentes
  };
}

// Función para crear opciones de autenticación
export function createAuthenticationOptions(challenge: ArrayBuffer, allowCredentials: PublicKeyCredentialDescriptor[] = []) {
  return {
    challenge,
    rpId: PASSKEY_CONFIG.rp.id,
    allowCredentials,
    userVerification: PASSKEY_CONFIG.authenticatorSelection.userVerification,
    timeout: PASSKEY_CONFIG.timeout
  };
}

// Función para manejar fallback cuando Passkey no está disponible
export function handlePasskeyFallback(): void {
  console.log('Passkey no disponible, usando autenticación alternativa');
  // Aquí se puede implementar lógica de fallback
  // Por ejemplo, redirigir a autenticación por email/password
}

// Función para mostrar mensajes de error amigables
export function showPasskeyError(message: string): void {
  // Usar toast o alert más amigable
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.error(message, {
      duration: 5000,
      position: 'top-center'
    });
  } else {
    alert(message);
  }
}

// Función para mostrar mensajes de éxito
export function showPasskeySuccess(message: string): void {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.success(message, {
      duration: 3000,
      position: 'top-center'
    });
  } else {
    alert(message);
  }
} 