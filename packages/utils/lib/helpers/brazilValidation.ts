/**
 * Utilitários de Validação e Formatação para o Brasil (Ottehr Brasil)
 * Compatível com os padrões HL7 FHIR R4 e RNDS (Ministério da Saúde).
 */

export const BRAZIL_FHIR_SYSTEMS = {
  CPF: 'https://saude.gov.br/fhir/sid/cpf',
  CNS: 'https://saude.gov.br/fhir/sid/cns',
  CRM: 'https://portal.cfm.org.br/crm',
} as const;

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function cleanDigits(value?: string | null): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

/**
 * Valida se um número de CPF é matematicamente válido usando o algoritmo de módulo 11
 */
export function validateCPF(cpfInput?: string | null): boolean {
  if (!cpfInput) return false;
  const cpf = cleanDigits(cpfInput);

  if (cpf.length !== 11) return false;

  // Rejeita sequências conhecidas de dígitos iguais (ex: 111.111.111-11, 000.000.000-00)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let rest = 11 - (sum % 11);
  let firstCheckDigit = rest === 10 || rest === 11 ? 0 : rest;

  if (firstCheckDigit !== parseInt(cpf.charAt(9), 10)) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rest = 11 - (sum % 11);
  let secondCheckDigit = rest === 10 || rest === 11 ? 0 : rest;

  return secondCheckDigit === parseInt(cpf.charAt(10), 10);
}

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export function formatCPF(value?: string | null): string {
  const digits = cleanDigits(value).slice(0, 11);
  if (!digits) return '';

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Aplica máscara de CEP: 00000-000
 */
export function formatCEP(value?: string | null): string {
  const digits = cleanDigits(value).slice(0, 8);
  if (!digits) return '';
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

/**
 * Aplica máscara de telefone brasileiro: (00) 00000-0000 ou (00) 0000-0000
 */
export function formatPhoneBR(value?: string | null): string {
  const digits = cleanDigits(value).slice(0, 11);
  if (!digits) return '';

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export interface AddressLookupResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

/**
 * Busca dados de endereço pelo CEP utilizando a BrasilAPI com fallback no ViaCEP
 */
export async function fetchAddressByCEP(cepInput: string): Promise<AddressLookupResult | null> {
  const cep = cleanDigits(cepInput);
  if (cep.length !== 8) return null;

  try {
    // Tentativa 1: BrasilAPI
    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        cep,
        street: data.street || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: data.state || '',
      };
    }
  } catch (err) {
    console.warn('Falha na BrasilAPI, tentando ViaCEP como fallback...', err);
  }

  try {
    // Tentativa 2: ViaCEP (fallback)
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.erro) {
        return {
          cep,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        };
      }
    }
  } catch (err) {
    console.error('Falha ao consultar CEP no ViaCEP:', err);
  }

  return null;
}
